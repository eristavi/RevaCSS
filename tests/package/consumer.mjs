import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

export const root = fileURLToPath(new URL('../../', import.meta.url));

export async function createConsumer() {
  const temporary = await mkdtemp(join(tmpdir(), 'revacss-package-'));
  try {
    const env = { ...process.env, npm_config_cache: join(temporary, 'cache') };
    const [packed] = JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json',
      '--pack-destination', temporary], { cwd: root, env, encoding: 'utf8' }));
    const consumer = join(temporary, 'consumer');
    await mkdir(consumer);
    await writeFile(join(consumer, 'package.json'), JSON.stringify({
      name: 'revacss-consumer-fixture', version: '0.0.0', private: true, type: 'module',
    }));
    execFileSync('npm', ['install', join(temporary, packed.filename), '--offline',
      '--no-audit', '--no-fund', '--package-lock=false'], {
      cwd: consumer, env, stdio: 'pipe',
    });
    const markup = (scoped, cssOnly = false) => `<!doctype html><html lang="en" data-theme="light">
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Installed RevaCSS</title>${cssOnly ? '<link rel="stylesheet" href="/imports.css">' : ''}</head><body>
      ${scoped ? '<article class="card" id="outside">Outside the scoped boundary</article><section class="reva" data-theme="dark">' : '<main class="container">'}
      <article class="card" id="sample"><h1>Installed from npm tarball</h1>
      <img src="/node_modules/revacss/dist/icons/check.svg" alt="Completed" width="24" height="24">
      <details><summary>Read more</summary><p id="answer">Native disclosure works.</p></details>
      <button id="liquid" data-button-material="liquid" popovertarget="response">Open response</button>
      <div id="response" popover="auto" aria-label="Package response">Ready</div></article>
      ${scoped ? '</section>' : '</main>'}
      ${cssOnly ? '' : `<script type="module" src="/${scoped ? 'scoped' : 'global'}.js"></script>`}</body></html>`;
    await Promise.all([
      writeFile(join(consumer, 'index.html'), markup(false)),
      writeFile(join(consumer, 'scoped.html'), markup(true)),
      writeFile(join(consumer, 'imports.html'), markup(false, true)),
      writeFile(join(consumer, 'imports.css'), '@import "revacss";\n@import "revacss/dist/reva-fonts.css";\n@import "revacss/dist/reva.glass.css";\n@import "revacss/dist/reva.motion.css";\n@import "revacss/dist/reva.button-materials.css";\n'),
      writeFile(join(consumer, 'global.js'), "import 'revacss';\nimport 'revacss/dist/reva-fonts.css';\nimport 'revacss/dist/reva.glass.css';\nimport 'revacss/dist/reva.motion.css';\nimport 'revacss/dist/reva.button-materials.css';\n"),
      writeFile(join(consumer, 'scoped.js'), "import 'revacss/dist/reva.scoped.css';\nimport 'revacss/dist/reva-fonts.css';\nimport 'revacss/dist/reva.glass.scoped.css';\nimport 'revacss/dist/reva.motion.scoped.css';\nimport 'revacss/dist/reva.button-materials.scoped.css';\n"),
    ]);
    return { temporary, consumer, packed, installed: join(consumer, 'node_modules/revacss'),
      output: join(consumer, 'dist'), dispose: () => rm(temporary, { recursive: true, force: true }) };
  } catch (error) {
    await rm(temporary, { recursive: true, force: true });
    throw error;
  }
}

export async function bundleConsumer(fixture) {
  await build({ root: fixture.consumer, configFile: false, logLevel: 'warn',
    build: { outDir: fixture.output, assetsInlineLimit: 0, modulePreload: false,
      rolldownOptions: { input: { global: join(fixture.consumer, 'index.html'),
        scoped: join(fixture.consumer, 'scoped.html'), imports: join(fixture.consumer, 'imports.html') } } } });
  return Promise.all(['index.html', 'scoped.html', 'imports.html'].map(path => readFile(join(fixture.output, path), 'utf8')));
}
