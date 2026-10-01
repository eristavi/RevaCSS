import { readFile } from 'node:fs/promises';
const { blockers } = JSON.parse(await readFile(new URL('../quality/blockers.json', import.meta.url), 'utf8'));
const open = blockers.filter(item => item.status !== 'resolved');
if (open.length) {
  console.error(`Release quality gate: BLOCKED (${open.length} outstanding items)`);
  for (const item of open) console.error(`- ${item.id} [${item.kind}]: ${item.summary}`);
  process.exitCode = 1;
} else {
  console.log('Recorded quality blockers are resolved. Complete the other release gates in QUALITY_STANDARD.md before publication.');
}
