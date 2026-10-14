import assert from 'node:assert/strict';
import { browserChecks } from '../../../integrations/shared/browser-checks.mjs';
import { execFileSync, spawn } from 'node:child_process';
import { mkdtemp, mkdir, cp, readFile, readdir, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
const exampleRoot = fileURLToPath(new URL('../', import.meta.url));
const root = fileURLToPath(new URL('../../../', import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), 'reva-nuxt-'));
let production;
const run = (cmd, args, cwd) => new Promise((resolve, reject) => {
  const child = spawn(cmd, args, { cwd, stdio: 'inherit', env: { ...process.env, NUXT_TELEMETRY_DISABLED: '1' } });
  child.on('error', reject);
  child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`)));
});
try {
  const pack = cwd => JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], { cwd, encoding: 'utf8' }))[0];
  const core = pack(root);
  const adapter = pack(join(root, 'integrations/vue'));
  const application = join(temporary, 'app');
  await cp(exampleRoot, application, { recursive: true, filter: path => !/(?:^|\/)(?:node_modules|\.nuxt|\.output)(?:\/|$)/.test(path) });
  const modules = join(application, 'node_modules');
  await mkdir(join(modules, '@revacss'), { recursive: true });
  for (const [name, archive] of [['revacss', core], ['@revacss/vue', adapter]]) {
    const destination = join(modules, name);
    await mkdir(destination, { recursive: true });
    execFileSync('tar', ['-xzf', join(temporary, archive.filename), '--strip-components=1', '-C', destination]);
  }
  for (const entry of await readdir(join(exampleRoot, 'node_modules'))) {
    if (entry === 'revacss' || entry === '@revacss' || entry === '.cache') continue;
    await symlink(join(exampleRoot, 'node_modules', entry), join(modules, entry));
  }
  await run('npm', ['run', 'typecheck'], application);
  await run('npm', ['run', 'build'], application);
  const reserve = createServer();
  await new Promise(resolve => reserve.listen(0, '127.0.0.1', resolve));
  const port = reserve.address().port;
  await new Promise(resolve => reserve.close(resolve));
  let serverLog = '';
  production = spawn(process.execPath, ['.output/server/index.mjs'], { cwd: application, env: { ...process.env, NITRO_HOST: '127.0.0.1', NITRO_PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  production.stdout.on('data', chunk => { serverLog += chunk; });
  production.stderr.on('data', chunk => { serverLog += chunk; });
  let startError;
  production.on('error', error => { startError = error; });
  const origin = `http://127.0.0.1:${port}`;
  let html;
  for (let attempt = 0; attempt < 150; attempt++) {
    if (startError) throw startError;
    if (production.exitCode !== null) throw new Error(`Production server stopped: ${serverLog}`);
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(3000) });
      assert.equal(response.status, 200, serverLog);
      html = await response.text(); break;
    } catch (error) {
      if (error instanceof assert.AssertionError) throw error;
      await delay(100);
    }
  }
  assert.ok(html, `Server did not become ready: ${serverLog}`);
  assert.match(html, /<html[^>]+data-theme="auto"/);
  assert.match(html, /<html[^>]+data-font="system"/);
  assert.match(html, /RevaCSS with Nuxt/);
  assert.match(html, /href="#nuxt-main"/);
  assert.match(html, /for="nuxt-email"/);
  assert.match(html, /aria-describedby="email-note nuxt-email-hint nuxt-email-error"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /value="example@example.com"/);
  assert.match(html, /value="support" selected/);
  assert.match(html, /value="feedback" selected/);
  assert.match(html, /Previous text &amp; more/);
  assert.match(html, /<details name="faq">/);
  assert.doesNotMatch(html, /\son(?:click|input|change|submit)=/i);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, list] of html.matchAll(/aria-describedby="([^"]+)"/g)) for (const id of list.split(' ')) assert.ok(ids.includes(id));
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
  const dark = await darkResponse.text();
  assert.match(dark, /<html[^>]+data-theme="dark"/);
  assert.match(dark, /href="#nuxt-dark-main"/);
  const again = await (await fetch(origin)).text();
  assert.match(again, /<html[^>]+data-theme="auto"/);
  if (process.env.REVA_BROWSER_CHECKS === '1') await browserChecks({ url: origin, prefix: 'nuxt' });
  console.log('Nuxt candidate verified: packed Vue/core consumer, strict Nuxt types, production build, live SSR pages, root theme attributes, served CSS and form associations/initial models. ' + (process.env.REVA_BROWSER_CHECKS === '1' ? 'Requested automated browser checks passed.' : 'Browser checks not requested.'));
} finally {
  if (production && production.exitCode === null) {
    await new Promise(resolve => {
      const timer = setTimeout(() => production.kill('SIGKILL'), 2000);
      production.once('exit', () => { clearTimeout(timer); resolve(); });
      production.kill('SIGTERM');
    });
  }
  await rm(temporary, { recursive: true, force: true });
}
