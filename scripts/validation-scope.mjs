import { appendFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// Unknown and mixed changes use the full suite. Shared components, layouts,
// styles, build configuration and navigation data deliberately stay outside
// this content-only allowlist.
export function documentationOnly(paths) {
  return paths.length > 0 && paths.every(path =>
    /^(?:[^/]+\.md|docs\/src\/pages\/.+\.(?:astro|md|mdx|json)|docs\/public\/images\/.+\.(?:svg|png|jpe?g|webp|avif|gif))$/i.test(path));
}

export function validationScope({ event, base, head }, git = (...args) => {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || 'Cannot determine changed files');
  return result.stdout;
}) {
  // Manual runs, initial pushes and unavailable history always run browsers.
  if (!['push', 'pull_request'].includes(event) || !/^[a-f0-9]{40}$/.test(base || '') || /^0+$/.test(base) || !/^[a-f0-9]{40}$/.test(head || '')) return false;
  const range = event === 'pull_request' ? `${base}...${head}` : `${base}..${head}`;
  const paths = git('diff', '--no-renames', '--name-only', '-z', range).split('\0').filter(Boolean);
  if (!documentationOnly(paths)) return false;
  // Pages can also contain styling or native interactions. Such edits retain
  // browser checks even though their files live under documentation.
  for (const path of paths.filter(path => path.startsWith('docs/src/pages/'))) {
    try {
      if (/<(?:style|script)\b/i.test(git('show', `${head}:${path}`))) return false;
    } catch { return false; } // Deleted or unavailable pages use the full suite.
  }
  const patch = git('diff', '--no-renames', '--unified=0', range, '--', 'docs/src/pages/');
  return !patch.split('\n').some(line => {
    if (!/^[+-](?![+-])/.test(line)) return false;
    const changed = line.slice(1);
    return /<\/?(?:style|script|button|nav|details|summary|input|select|textarea|dialog)\b|\b(?:style|class|class:list|popovertarget|popovertargetaction)\s*=|^\s*import\b|^\s*(?:--[\w-]+|[a-z-]+)\s*:[^;{}]+[;}]/i.test(changed);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const docsOnly = validationScope({ event: process.env.REVA_EVENT, base: process.env.REVA_DIFF_BASE, head: process.env.REVA_DIFF_HEAD });
  const output = `docs_only=${docsOnly}\n`;
  process.stdout.write(output);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, output);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    docsOnly ? 'Documentation-only change: build and Node checks; no browser installation.\n' : 'Framework, shared UI, tooling or manual run: full browser validation.\n');
}
