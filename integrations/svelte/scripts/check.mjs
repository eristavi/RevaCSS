import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtemp, mkdir, cp, readdir, readFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as netServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { build, createServer, preview } from 'vite';
import { browserChecks } from '../../shared/browser-checks.mjs';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { render } from 'svelte/server';
const adapterRoot = fileURLToPath(new URL('../', import.meta.url));
const root = fileURLToPath(new URL('../../../', import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), 'reva-svelte-'));
let viteServer;
let production;
const run = (cmd, args, cwd) => new Promise((resolve, reject) => {
  const child = spawn(cmd, args, { cwd, stdio: 'inherit' });
  child.on('error', reject);
  child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`)));
});
function markup(html) {
  assert.match(html, /href="#svelte-main"/);
  assert.match(html, /for="svelte-email"/);
  assert.match(html, /aria-describedby="email-note svelte-email-hint svelte-email-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /&lt;script(?:>|&gt;)alert\(1\)&lt;\/script(?:>|&gt;)/);
  assert.match(html, /value="example@example.com"/);
  assert.match(html, /<option[^>]*value="support"[^>]*selected|<option[^>]*selected[^>]*value="support"/);
  assert.match(html, /<option[^>]*value="feedback"[^>]*selected|<option[^>]*selected[^>]*value="feedback"/);
  assert.match(html, /Previous text &amp; more/);
  assert.match(html, /<details[^>]*name="faq"/);
  assert.doesNotMatch(html, /\son(?:click|input|change|submit)=/i);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, list] of html.matchAll(/aria-describedby="([^"]+)"/g)) for (const id of list.split(' ')) assert.ok(ids.includes(id));
}
try {
  const pack = cwd => JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], { cwd, encoding: 'utf8' }))[0];
  const core = pack(root);
  const adapter = pack(adapterRoot);
  assert.ok(adapter.files.some(f => f.path === 'LICENSE'));
  assert.ok(!adapter.files.some(f => /^(scripts|node_modules)\//.test(f.path)));
  async function fixture(name) {
    const application = join(temporary, name);
    await cp(join(root, 'examples', name), application, { recursive: true, filter: path => !/(?:^|\/)(?:node_modules|\.svelte-kit|build|dist)(?:\/|$)/.test(path) });
    const modules = join(application, 'node_modules');
    await mkdir(join(modules, '@revacss'), { recursive: true });
    for (const [packageName, archive] of [['revacss', core], ['@revacss/svelte', adapter]]) {
      const destination = join(modules, packageName);
      await mkdir(destination, { recursive: true });
      execFileSync('tar', ['-xzf', join(temporary, archive.filename), '--strip-components=1', '-C', destination]);
    }
    for (const entry of await readdir(join(adapterRoot, 'node_modules'))) {
      if (['revacss', '@revacss', '.cache', '.vite'].includes(entry)) continue;
      await symlink(join(adapterRoot, 'node_modules', entry), join(modules, entry));
    }
    return application;
  }
  const application = await fixture('svelte');
  await run('npm', ['run', 'check'], application);
  const options = { root: application, configFile: false, plugins: [svelte({ configFile: false })] };
  await build(options);
  viteServer = await createServer({ ...options, server: { middlewareMode: true }, appType: 'custom' });
  const { default: App } = await viteServer.ssrLoadModule('/src/App.svelte');
  const plain = render(App).body;
  markup(plain);
  assert.doesNotMatch(plain, /<script\b/i);
  const { default: Input } = await viteServer.ssrLoadModule('@revacss/svelte/Input.svelte');
  assert.throws(() => render(Input, { props: { id: '', label: 'Email' } }).body, /requires a unique nonempty ID/);
  const { default: Select } = await viteServer.ssrLoadModule('@revacss/svelte/Select.svelte');
  assert.throws(() => render(Select, { props: { id: 'bad-select', label: 'Tags', multiple: true, value: 'support' } }).body, /Multiple Select requires an array value/);
  const assets = await readdir(join(application, 'dist/assets'));
  const css = (await Promise.all(assets.filter(p => p.endsWith('.css')).map(p => readFile(join(application, 'dist/assets', p), 'utf8')))).join('');
  assert.match(css, /--re-radius/);
  if (process.env.REVA_BROWSER_CHECKS === '1') {
    const hosted = await preview({ root: application, configFile: false, preview: { host: '127.0.0.1', port: 0 } });
    try { await browserChecks({ url: `http://127.0.0.1:${hosted.httpServer.address().port}`, prefix: 'svelte', focusButton: true }); }
    finally { await new Promise(resolve => hosted.httpServer.close(resolve)); }
  }
  await viteServer.close(); viteServer = undefined;
  const kit = await fixture('sveltekit');
  await run('npm', ['run', 'check'], kit);
  await run('npm', ['run', 'build'], kit);
  const reserve = netServer();
  await new Promise(resolve => reserve.listen(0, '127.0.0.1', resolve));
  const port = reserve.address().port;
  await new Promise(resolve => reserve.close(resolve));
  let serverLog = '';
  let startError;
  production = spawn(process.execPath, ['build/index.js'], { cwd: kit, env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  production.stdout.on('data', chunk => { serverLog += chunk; });
  production.stderr.on('data', chunk => { serverLog += chunk; });
  production.on('error', error => { startError = error; });
  const origin = `http://127.0.0.1:${port}`;
  let html;
  for (let attempt = 0; attempt < 150; attempt++) {
    if (startError) throw startError;
    if (production.exitCode !== null) throw new Error(serverLog);
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(3000) });
      assert.equal(response.status, 200, serverLog);
      html = await response.text(); break;
    } catch (error) {
      if (error instanceof assert.AssertionError) throw error;
      await delay(100);
    }
  }
  assert.ok(html, serverLog);
  markup(html);
  assert.match(html, /<html[^>]+data-theme="auto"/);
  assert.match(html, /<html[^>]+data-font="system"/);
  let styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('');
  for (const [tag] of html.matchAll(/<link\b[^>]*>/g)) {
    if (!/\brel="stylesheet"/.test(tag)) continue;
    const href = tag.match(/\bhref="([^"]+)"/)?.[1];
    assert.ok(href);
    const response = await fetch(new URL(href, origin));
    assert.equal(response.status, 200, href);
    styles += await response.text();
  }
  assert.match(styles, /--re-radius/);
  const darkResponse = await fetch(origin + '/dark');
  assert.equal(darkResponse.status, 200);
  assert.match(await darkResponse.text(), /<html[^>]+data-theme="dark"/);
  assert.match(await (await fetch(origin)).text(), /<html[^>]+data-theme="auto"/);
  if (process.env.REVA_BROWSER_CHECKS === '1') await browserChecks({ url: origin, prefix: 'svelte', focusButton: true });
  console.log('Svelte candidate verified: component/consumer types, packed packages, plain client build and SSR markup, SvelteKit production Node build, HTTP theme/CSS/form checks. ' + (process.env.REVA_BROWSER_CHECKS === '1' ? 'Requested automated browser checks passed.' : 'Browser checks not requested.'));
} finally {
  await viteServer?.close();
  if (production && production.exitCode === null) {
    await new Promise(resolve => {
      const timer = setTimeout(() => production.kill('SIGKILL'), 2000);
      production.once('exit', () => { clearTimeout(timer); resolve(); });
      production.kill('SIGTERM');
    });
  }
  await rm(temporary, { recursive: true, force: true });
}
