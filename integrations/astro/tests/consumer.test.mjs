import test from 'node:test';
import { preview } from 'vite';
import { browserChecks } from '../../shared/browser-checks.mjs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, cp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../../../', import.meta.url));

test('packed Astro adapter builds native global/scoped pages without browser scripts', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'reva-astro-'));
  try {
    const pack = cwd => JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], { cwd, encoding: 'utf8' }))[0];
    const core = pack(root);
    const adapter = pack(join(root, 'integrations/astro'));
    assert.ok(adapter.files.some(f => f.path === 'LICENSE'));
    assert.ok(!adapter.files.some(f => /tests|node_modules/.test(f.path)));
    const application = join(temporary, 'app');
    await cp(join(root, 'examples/astro'), application, { recursive: true });
    const modules = join(application, 'node_modules');
    await mkdir(join(modules, '@revacss'), { recursive: true });
    for (const [name, archive] of [['revacss', core], ['@revacss/astro', adapter]]) {
      const destination = join(modules, name);
      await mkdir(destination, { recursive: true });
      execFileSync('tar', ['-xzf', join(temporary, archive.filename), '--strip-components=1', '-C', destination]);
    }
    // Reuse locked build tooling; both framework packages are real extracted tarballs.
    for (const entry of await readdir(join(root, 'node_modules'))) {
      if (entry === 'revacss' || entry === '@revacss') continue;
      await symlink(join(root, 'node_modules', entry), join(modules, entry));
    }
    const cli = join(root, 'node_modules/astro/bin/astro.mjs');
    execFileSync(process.execPath, [cli, 'build', '--root', application], { cwd: root, stdio: 'pipe' });
    const html = await readFile(join(application, 'dist/index.html'), 'utf8');
    assert.doesNotMatch(html, /<script\b|<astro-island\b|\son\w+=/i);
    assert.match(html, /data-theme="dark"/);
    assert.match(html, /data-font="system"/);
    assert.match(html, /class="card stack"/);
    assert.match(html, /<button[^>]+type="button"[^>]+disabled|<button[^>]+disabled[^>]+type="button"/);
    assert.match(html, /for="contact-email"/);
    assert.match(html, /aria-describedby="email-note contact-email-hint contact-email-error"/);
    assert.match(html, /aria-invalid="true"/);
    assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.match(html, /id="alternate-email"/);
    assert.match(html, /<option value="support" selected/);
    assert.match(html, /<textarea[^>]+aria-describedby="contact-message-error"/);
    assert.match(html, /Previous text &amp; more/);
    assert.match(html, /<details name="faq">/);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const [, list] of html.matchAll(/aria-describedby="([^"]+)"/g)) {
      for (const id of list.split(' ')) assert.ok(ids.includes(id), `Missing description ${id}`);
    }
    const scoped = await readFile(join(application, 'dist/scoped/index.html'), 'utf8');
    assert.match(scoped, /<html[^>]+class="reva"/);
    const assets = await readdir(join(application, 'dist/_astro'));
    assert.ok(assets.some(p => p.endsWith('.css')));
    assert.ok(!assets.some(p => p.endsWith('.js')));
    if (process.env.REVA_BROWSER_CHECKS === '1') {
      const hosted = await preview({ root: application, configFile: false, preview: { host: '127.0.0.1', port: 0 } });
      try { await browserChecks({ url: `http://127.0.0.1:${hosted.httpServer.address().port}`, prefix: 'contact', reactive: false, multiple: false }); }
      finally { await new Promise(resolve => hosted.httpServer.close(resolve)); }
    }
    // Fail clearly rather than producing an unlabelled field if an application omits IDs.
    await writeFile(join(application, 'src/pages/invalid.astro'), `---\nimport Input from '@revacss/astro/Input.astro';\n---\n<Input id="" label="Email" />`);
    assert.throws(() => execFileSync(process.execPath, [cli, 'build', '--root', application], { cwd: root, stdio: 'pipe' }), error => /requires a unique nonempty id and label/.test(String(error.stderr) + String(error.stdout)));
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
