import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises';

const registry = 'https://registry.npmjs.org';
const repository = process.env.GITHUB_REPOSITORY;
const tag = process.env.RELEASE_TAG;
const stableTag = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const fail = message => { throw new Error(message); };
const gh = args => execFileSync('gh', args, { encoding: 'utf8', timeout: 120_000 });
const integrity = bytes => 'sha512-' + createHash('sha512').update(bytes).digest('base64');
const normalizeRepository = value => value?.replace(/^git\+/, '').replace(/\.git$/, '');

async function registryMetadata() {
  const response = await fetch(registry + '/revacss', { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) fail('Cannot inspect npm registry: HTTP ' + response.status);
  return response.json();
}

if (process.argv.includes('--verify')) {
  const version = process.env.PACKAGE_VERSION;
  const expected = process.env.PACKAGE_INTEGRITY;
  for (let attempt = 0; attempt < 5; attempt++) {
    const metadata = await registryMetadata();
    if (metadata.versions?.[version]?.dist?.integrity === expected) {
      if (process.env.PUBLISH_TAG === 'latest' && metadata['dist-tags']?.latest !== version) {
        fail('Published bytes match, but latest does not point to ' + version);
      }
      console.log('Verified revacss@' + version + ' on npm; package integrity matches the GitHub archive.');
      process.exit(0);
    }
    if (attempt < 4) await new Promise(resolve => setTimeout(resolve, 2_000));
  }
  fail('npm package integrity does not match the verified GitHub archive.');
}

if (repository !== 'eristavi/RevaCSS') fail('Publication is restricted to eristavi/RevaCSS.');
if (!stableTag.test(tag ?? '')) fail('Choose a stable vMAJOR.MINOR.PATCH release tag.');
const version = tag.slice(1);
const release = JSON.parse(gh(['api', 'repos/' + repository + '/releases/tags/' + tag]));
if (release.draft || release.prerelease || release.tag_name !== tag) fail('A published stable GitHub release is required.');
const commit = JSON.parse(gh(['api', 'repos/' + repository + '/commits/' + tag])).sha;
if (!/^[a-f0-9]{40}$/.test(commit)) fail('Cannot resolve the release tag commit.');
const filename = 'revacss-' + version + '.tgz';
const asset = release.assets.find(item => item.name === filename);
if (!asset || asset.state !== 'uploaded' || !/^sha256:[a-f0-9]{64}$/.test(asset.digest ?? '')) {
  fail('The release must contain a completed npm tarball with a GitHub SHA-256 digest.');
}
await mkdir('artifacts', { recursive: true });
gh(['release', 'download', tag, '--repo', repository, '--pattern', filename, '--dir', 'artifacts']);
const file = 'artifacts/' + filename;
const bytes = await readFile(file);
if (bytes.length !== asset.size || 'sha256:' + createHash('sha256').update(bytes).digest('hex') !== asset.digest) {
  fail('The downloaded npm archive does not match its GitHub release digest.');
}
const manifest = JSON.parse(execFileSync('tar', ['-xOf', file, 'package/package.json'], { encoding: 'utf8' }));
if (manifest.name !== 'revacss' || manifest.version !== version || manifest.private === true ||
    normalizeRepository(manifest.repository?.url) !== 'https://github.com/' + repository) {
  fail('Package identity, version, repository or publishing status differs from the release.');
}
if (Object.keys(manifest.dependencies ?? {}).length || Object.keys(manifest.optionalDependencies ?? {}).length) {
  fail('The CSS package must not introduce runtime dependencies.');
}
const expectedIntegrity = integrity(bytes);
const metadata = await registryMetadata();
const existing = metadata.versions?.[version];
if (existing && existing.dist?.integrity !== expectedIntegrity) {
  fail('This immutable npm version already exists with different bytes; refusing to replace it.');
}
const latest = metadata['dist-tags']?.latest;
const parts = value => value.split('.').map(Number);
const newerThan = (left, right) => {
  const a = parts(left), b = parts(right);
  for (let index = 0; index < 3; index++) {
    if (a[index] !== b[index]) return a[index] > b[index];
  }
  return false;
};
const publishTag = latest && stableTag.test('v' + latest) && newerThan(latest, version) ? 'legacy' : 'latest';
await writeFile('artifacts/release.json', JSON.stringify({ tag, commit, filename, sha256: asset.digest, integrity: expectedIntegrity }, null, 2) + '\n');
if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, Object.entries({
    version, commit, file, integrity: expectedIntegrity, publish_tag: publishTag,
    already_published: String(Boolean(existing))
  }).map(([key, value]) => key + '=' + value).join('\n') + '\n');
}
console.log('Verified ' + filename + ' from ' + commit + '; npm tag: ' + publishTag + '; already published: ' + Boolean(existing));
