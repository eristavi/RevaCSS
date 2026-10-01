import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
test('quality blockers are unique, explicit and backed by acceptance tests or manual gates', async () => {
  const { schemaVersion, blockers } = JSON.parse(await readFile('quality/blockers.json', 'utf8'));
  const tests = await readFile('tests/browser/quality.spec.mjs', 'utf8');
  assert.equal(schemaVersion, 1);
  assert.equal(new Set(blockers.map(item => item.id)).size, blockers.length);
  for (const item of blockers) {
    assert.match(item.id, /^Q-[A-Z-]+$/);
    assert.ok(['automated', 'manual'].includes(item.kind));
    assert.ok(['open', 'resolved'].includes(item.status));
    assert.ok(item.summary.length > 20);
    if (item.kind === 'automated') assert.ok(tests.includes(`'${item.id}'`), item.id);
    if (item.status === 'resolved') assert.ok(item.evidence?.trim(), `Resolution needs evidence: ${item.id}`);
  }
  const gate = spawnSync(process.execPath, ['scripts/check-release-quality.mjs'], { encoding: 'utf8' });
  assert.equal(gate.status, blockers.some(item => item.status !== 'resolved') ? 1 : 0);
  assert.ok((gate.stdout + gate.stderr).includes(blockers.some(item => item.status !== 'resolved') ? 'BLOCKED' : 'resolved'));
});
