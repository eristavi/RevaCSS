import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, cp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const adapterRoot = fileURLToPath(new URL('../', import.meta.url));
const root = fileURLToPath(new URL('../../../', import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), 'reva-react-'));
let server;
try {
  const pack = (cwd, scripts) => JSON.parse(execFileSync('npm', ['pack', ...(scripts ? [] : ['--ignore-scripts']), '--json', '--pack-destination', temporary], { cwd, encoding: 'utf8' }))[0];
  const core = pack(root, false);
  const adapter = pack(adapterRoot, true);
  for (const path of ['dist/index.js', 'dist/index.d.ts', 'LICENSE']) assert.ok(adapter.files.some(f => f.path === path));
  assert.ok(!adapter.files.some(f => /^(src|scripts|node_modules)\//.test(f.path)));
  const application = join(temporary, 'app');
  await cp(join(root, 'examples/react'), application, { recursive: true });
  const modules = join(application, 'node_modules');
  await mkdir(join(modules, '@revacss'), { recursive: true });
  for (const [name, archive] of [['revacss', core], ['@revacss/react', adapter]]) {
    const destination = join(modules, name);
    await mkdir(destination, { recursive: true });
    execFileSync('tar', ['-xzf', join(temporary, archive.filename), '--strip-components=1', '-C', destination]);
  }
  for (const entry of await readdir(join(adapterRoot, 'node_modules'))) {
    if (entry === 'revacss' || entry === '@revacss') continue;
    await symlink(join(adapterRoot, 'node_modules', entry), join(modules, entry));
  }
  await writeFile(join(application, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, lib: ['ES2022', 'DOM'], noEmit: true }, include: ['src/**/*.tsx'] }));
  execFileSync(process.execPath, [join(adapterRoot, 'node_modules/typescript/bin/tsc'), '-p', join(application, 'tsconfig.json')], { stdio: 'pipe' });
  const options = { root: application, configFile: false, esbuild: { jsx: 'automatic' } };
  await build(options);
  server = await createServer({ ...options, server: { middlewareMode: true }, appType: 'custom' });
  const { default: App } = await server.ssrLoadModule('/src/App.tsx');
  const html = renderToStaticMarkup(createElement(App));
  assert.doesNotMatch(html, /<script\b|\son\w+=/i);
  assert.match(html, /class="card stack"/);
  assert.match(html, /href="#react-main"/);
  assert.match(html, /for="react-email"/);
  assert.match(html, /aria-describedby="email-note react-email-hint react-email-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /value="example@example.com"/);
  assert.match(html, /value="support" selected=""/);
  assert.match(html, /value="feedback" selected=""/);
  assert.match(html, /Previous text &amp; more/);
  assert.match(html, /type="button"/);
  assert.match(html, /<details name="faq">/);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, list] of html.matchAll(/aria-describedby="([^"]+)"/g)) for (const id of list.split(' ')) assert.ok(ids.includes(id));
  const { Input } = await server.ssrLoadModule('@revacss/react');
  assert.throws(() => renderToStaticMarkup(createElement(Input, { id: '', label: 'Email' })), /require a unique nonempty ID/);
  const assets = await readdir(join(application, 'dist/assets'));
  const css = (await Promise.all(assets.filter(p => p.endsWith('.css')).map(p => readFile(join(application, 'dist/assets', p), 'utf8')))).join('');
  assert.match(css, /--re-radius/);
  await server.close(); server = undefined;
  const nextApp = join(temporary, 'next');
  await cp(join(root, 'examples/next'), nextApp, { recursive: true });
  await symlink(modules, join(nextApp, 'node_modules'));
  execFileSync(process.execPath, [join(adapterRoot, 'node_modules/next/dist/bin/next'), 'build', '--webpack'], { cwd: nextApp, stdio: 'pipe', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
  const nextHTML = await readFile(join(nextApp, 'out/index.html'), 'utf8');
  assert.match(nextHTML, /RevaCSS in a Server Component/);
  assert.match(nextHTML, /for="next-email"/);
  assert.match(nextHTML, /data-theme="auto"/);
  console.log('React candidate verified: package declarations, strict consumer types, Vite build, SSR markup and Next.js Server Component build. Browser/hydration/ref interaction checks deferred.');
} finally {
  await server?.close();
  await rm(temporary, { recursive: true, force: true });
}
