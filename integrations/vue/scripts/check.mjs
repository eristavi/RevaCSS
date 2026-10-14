import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, cp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, createServer, preview } from 'vite';
import { browserChecks } from '../../shared/browser-checks.mjs';
import vue from '@vitejs/plugin-vue';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
const adapterRoot = fileURLToPath(new URL('../', import.meta.url));
const root = fileURLToPath(new URL('../../../', import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), 'reva-vue-'));
let server;
try {
  const pack = cwd => JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], { cwd, encoding: 'utf8' }))[0];
  const core = pack(root);
  const adapter = pack(adapterRoot);
  assert.ok(adapter.files.some(f => f.path === 'LICENSE'));
  assert.ok(!adapter.files.some(f => /scripts|node_modules|package-lock|tsconfig/.test(f.path)));
  const application = join(temporary, 'app');
  await cp(join(root, 'examples/vue'), application, { recursive: true });
  const modules = join(application, 'node_modules');
  await mkdir(join(modules, '@revacss'), { recursive: true });
  for (const [name, archive] of [['revacss', core], ['@revacss/vue', adapter]]) {
    const destination = join(modules, name);
    await mkdir(destination, { recursive: true });
    execFileSync('tar', ['-xzf', join(temporary, archive.filename), '--strip-components=1', '-C', destination]);
  }
  await symlink(join(adapterRoot, 'node_modules/vue'), join(modules, 'vue'));
  await writeFile(join(application, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', strict: true, skipLibCheck: true, lib: ['ES2022', 'DOM'], noEmit: true }, include: ['src/**/*.vue', 'src/**/*.ts'] }));
  execFileSync(process.execPath, [join(adapterRoot, 'node_modules/vue-tsc/bin/vue-tsc.js'), '--noEmit', '-p', join(application, 'tsconfig.json')], { stdio: 'pipe' });
  const options = { root: application, configFile: false, plugins: [vue()], ssr: { noExternal: ['@revacss/vue'] } };
  await build(options);
  server = await createServer({ ...options, server: { middlewareMode: true }, appType: 'custom' });
  const { default: App } = await server.ssrLoadModule('/src/App.vue');
  const html = await renderToString(createSSRApp(App));
  assert.doesNotMatch(html, /<script\b|\son\w+=/i);
  assert.match(html, /class="(?:card stack|stack card)"/);
  assert.match(html, /href="#vue-main"/);
  assert.match(html, /for="vue-email"/);
  assert.match(html, /aria-describedby="email-note vue-email-hint vue-email-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /class="email-control"/);
  assert.match(html, /value="example@example.com"/);
  assert.match(html, /value="support" selected/);
  assert.match(html, /value="feedback" selected/);
  assert.match(html, /Previous text &amp; more/);
  assert.match(html, /type="button"/);
  assert.match(html, /<details name="faq">/);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, list] of html.matchAll(/aria-describedby="([^"]+)"/g)) for (const id of list.split(' ')) assert.ok(ids.includes(id));
  const assets = await readdir(join(application, 'dist/assets'));
  const styles = (await Promise.all(assets.filter(p => p.endsWith('.css')).map(p => readFile(join(application, 'dist/assets', p), 'utf8')))).join('');
  assert.match(styles, /--re-radius/);
  if (process.env.REVA_BROWSER_CHECKS === '1') {
    const hosted = await preview({ root: application, configFile: false, preview: { host: '127.0.0.1', port: 0 } });
    try { await browserChecks({ url: `http://127.0.0.1:${hosted.httpServer.address().port}`, prefix: 'vue', focusButton: false }); }
    finally { await new Promise(resolve => hosted.httpServer.close(resolve)); }
  }
  await writeFile(join(application, 'src/Invalid.vue'), '<script setup>import Input from "@revacss/vue/Input.vue";</script><template><Input model-value="" id="" label="Email" /></template>');
  const { default: Invalid } = await server.ssrLoadModule('/src/Invalid.vue');
  await assert.rejects(() => renderToString(createSSRApp(Invalid)), /requires a unique nonempty id and label/);
  console.log('Vue candidate verified: strict component types, packed consumer build, SSR markup, models, native attributes and core stylesheet import. ' + (process.env.REVA_BROWSER_CHECKS === '1' ? 'Requested automated browser checks passed.' : 'Browser checks not requested.'));
} finally {
  await server?.close();
  await rm(temporary, { recursive: true, force: true });
}
