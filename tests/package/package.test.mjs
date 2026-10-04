import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { createConsumer, bundleConsumer, root } from './consumer.mjs';
import ts from 'typescript';

let fixture;
before(async () => { fixture = await createConsumer(); });
after(async () => { await fixture?.dispose(); });

test('an offline tarball install preserves every distribution asset and token', async () => {
  async function compare(directory) {
    for (const entry of await readdir(join(root, directory), { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await compare(path);
      else assert.deepEqual(await readFile(join(fixture.installed, path)), await readFile(join(root, path)), path);
    }
  }
  await compare('dist');
  await compare('tokens');
  const files = fixture.packed.files.map(file => file.path);
  assert.ok(files.includes('dist/fonts/OFL.txt'));
  assert.ok(files.includes('LICENSE'));
  assert.ok(files.includes('NPM.md'));
  assert.ok(!files.some(path => /^(?:src|docs|tests|scripts|\.github|node_modules)\//.test(path)));
  assert.ok(!files.some(path => /\.(?:[cm]?js|py)$/.test(path) || path.endsWith('.npmrc')));
});

test('installed public exports resolve core, scoped extensions, nested assets, and tokens', async () => {
  const require = createRequire(join(fixture.consumer, 'package.json'));
  for (const path of ['', '/dist/reva.min.css', '/dist/reva.scoped.css',
    '/dist/reva.glass.scoped.css', '/dist/reva.veil.css', '/dist/reva.motion.css',
    '/dist/reva.selects.css', '/dist/fonts/Manrope.ttf', '/dist/icons/reva.svg',
    '/tokens/foundation.tokens.json', '/package.json']) {
    const resolved = require.resolve('revacss' + path);
    assert.ok((await readFile(resolved)).length > 0, path);
  }
  assert.throws(() => require.resolve('revacss/scripts/build.mjs'), { code: 'ERR_PACKAGE_PATH_NOT_EXPORTED' });
  const metadata = require('revacss/package.json');
  assert.ok(!metadata.engines);
  assert.equal(Object.keys(metadata.dependencies || {}).length, 0);
});

test('Vite keeps global and scoped CSS imports and copies font/icon assets', async () => {
  const pages = await bundleConsumer(fixture);
  for (const page of pages) assert.match(page, /<link[^>]+rel="stylesheet"/);
  const assets = await readdir(join(fixture.output, 'assets'));
  assert.ok(assets.some(path => path.endsWith('.ttf')));
  assert.ok(assets.some(path => path.endsWith('.svg')));
  const styles = (await Promise.all(assets.filter(path => path.endsWith('.css'))
    .map(path => readFile(join(fixture.output, 'assets', path), 'utf8')))).join('\n');
  assert.match(styles, /--re-radius/);
  assert.match(styles, /@font-face/);
  assert.match(styles, /backdrop-filter/);
  assert.match(styles, /:popover-open/);
});

test('strict TypeScript accepts bare and stylesheet imports without JavaScript exports', async () => {
  const file = join(fixture.consumer, 'main.ts');
  await writeFile(file, "import 'revacss';\nimport 'revacss/dist/reva.scoped.css';\nimport 'revacss/dist/reva.glass.css';\nimport 'revacss/dist/reva-fonts.css';\n");
  const program = ts.createProgram([file], { strict: true, noEmit: true,
    noUncheckedSideEffectImports: true, moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 });
  const diagnostics = ts.getPreEmitDiagnostics(program).map(diagnostic =>
    ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
  assert.deepEqual(diagnostics, []);
});
