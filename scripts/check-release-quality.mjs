import { readFile } from 'node:fs/promises';
const { blockers } = JSON.parse(await readFile(new URL('../quality/blockers.json', import.meta.url), 'utf8'));
const open = blockers.filter(item => item.status !== 'resolved');
if (open.length) {
  console.error(`Release quality gate: BLOCKED (${open.length} outstanding items)`);
  for (const item of open) console.error(`- ${item.id} [${item.kind}]: ${item.summary}`);
  let authorized = false;
  if (process.argv.includes('--npm')) {
    const metadata = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    const exception = JSON.parse(await readFile(new URL('../quality/npm-publication-v1.0.0.json', import.meta.url), 'utf8'));
    authorized = metadata.name === exception.package && metadata.version === exception.version &&
      open.every(item => item.kind === 'manual' && exception.disclosedBlockers.includes(item.id));
  }
  if (authorized) {
    console.warn('First npm release authorized with disclosed manual limitations. These checks remain open; acceptance is not certified.');
  } else {
    process.exitCode = 1;
  }
} else {
  console.log('Recorded quality blockers are resolved. Complete the other release gates in QUALITY_STANDARD.md before publication.');
}
