import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const metadata = JSON.parse(await readFile('package.json', 'utf8'));
const registry = JSON.parse(await readFile('quality/blockers.json', 'utf8'));
const exception = JSON.parse(await readFile('quality/npm-publication-v1.0.0.json', 'utf8'));

for (const [name, version, packageName, added, expected] of [
  ['authorized Erisian with disclosed manual checks', '1.0.0', 'revacss', null, 0],
  ['future version with manual checks', '1.0.1', 'revacss', null, 1],
  ['different package with manual checks', '1.0.0', 'other-package', null, 1],
  ['new manual blocker', '1.0.0', 'revacss', { id: 'Q-NEW-MANUAL', kind: 'manual', status: 'open' }, 1],
  ['new automated blocker', '1.0.0', 'revacss', { id: 'Q-NEW-AUTOMATED', kind: 'automated', status: 'open' }, 1],
]) {
  test(`npm publication gate: ${name}`, async t => {
    const root = await mkdtemp(join(tmpdir(), 'revacss-npm-gate-'));
    t.after(() => rm(root, { recursive: true, force: true }));
    await mkdir(join(root, 'scripts'));
    await mkdir(join(root, 'quality'));
    await copyFile('scripts/check-release-quality.mjs', join(root, 'scripts/check-release-quality.mjs'));
    await writeFile(join(root, 'package.json'), JSON.stringify({ ...metadata, name: packageName, version }));
    await writeFile(join(root, 'quality/blockers.json'), JSON.stringify({
      // Model the historical open gates independently of today's acceptance record.
      ...registry, blockers: [...registry.blockers.map(item => exception.disclosedBlockers.includes(item.id)
        ? { ...item, status: 'open' } : item), ...(added ? [added] : [])],
    }));
    await writeFile(join(root, 'quality/npm-publication-v1.0.0.json'), JSON.stringify(exception));
    const result = spawnSync(process.execPath, [join(root, 'scripts/check-release-quality.mjs'), '--npm'], { encoding: 'utf8' });
    assert.equal(result.status, expected, result.stdout + result.stderr);
    assert.match(result.stdout + result.stderr, expected ? /BLOCKED/ : /authorized with disclosed manual limitations/);
  });
}
