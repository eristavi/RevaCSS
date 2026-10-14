import { readFile, appendFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export function releaseMetadata(metadata, lock) {
  const { name, version, releaseName } = metadata;
  const clean = value => typeof value === 'string' && value.trim() === value;
  if (!clean(version) || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) throw Error('Release version must be a stable semantic version.');
  if (!clean(name) || !clean(releaseName) || !/^[a-z0-9][a-z0-9-]*$/.test(name) || !/^[a-zA-Z0-9][a-zA-Z0-9-]*$/.test(releaseName)) throw Error('Unsafe release package or name.');
  if (lock.version !== version || lock.packages?.['']?.version !== version || lock.name !== name || lock.packages?.['']?.name !== name) throw Error('Package and lockfile release metadata differ.');
  return { version, tag: `v${version}`, package: name, release_name: releaseName,
    archive_basename: `${name}-${version}-${releaseName.toLowerCase()}`, tarball_name: `${name}-${version}.tgz` };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = new URL('../', import.meta.url);
  const [metadata, lock] = await Promise.all(['package.json', 'package-lock.json'].map(async path => JSON.parse(await readFile(new URL(path, root), 'utf8'))));
  const output = releaseMetadata(metadata, lock);
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, Object.entries(output).map(([key, value]) => `${key}=${value}`).join('\n') + '\n');
  console.log(JSON.stringify(output));
}
