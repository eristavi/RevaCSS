import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { chromium, firefox, webkit, expect } from '@playwright/test';
import { createConsumer, bundleConsumer } from './consumer.mjs';

let fixture, server, address;
before(async () => {
  fixture = await createConsumer();
  await bundleConsumer(fixture);
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
    '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2' };
  server = createServer(async (request, response) => {
    try {
      const path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const file = resolve(fixture.output, '.' + (path === '/' ? '/index.html' : path));
      if (!file.startsWith(fixture.output + sep)) { response.writeHead(403).end(); return; }
      response.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
      response.end(await readFile(file));
    } catch { response.writeHead(404).end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  address = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  if (server) {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
  await fixture?.dispose();
});

for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
  test(`${name}: installed global/scoped CSS works with JavaScript disabled`, { timeout: 90000 }, async t => {
    const browser = await engine.launch();
    t.after(() => browser.close());
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
    for (const [route, scoped] of [['/', false], ['/scoped.html', true], ['/imports.html', false]]) {
      const failures = [];
      const failedRequest = request => failures.push(request.url());
      page.on('requestfailed', failedRequest);
      await page.goto(address + route);
      // Firefox's disabled-script context can leave the FontFaceSet promise pending.
      // Poll the actual font states so this wait is bounded and verifies loading.
      await expect.poll(() => page.evaluate(() => [...document.fonts]
        .filter(face => face.family.replaceAll('"', '') === 'Manrope')
        .map(face => face.status))).toEqual(['loaded']);
      await expect(page.locator('#sample')).toHaveCSS('border-top-left-radius', '12px');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.ok(await page.evaluate(() => document.fonts.check('16px Manrope')));
      assert.ok(await page.locator('img').evaluate(el => el.complete && el.naturalWidth > 0));
      if (scoped) {
        await expect(page.locator('#outside')).toHaveCSS('border-top-width', '0px');
        await expect(page.locator('#sample')).toHaveCSS('color', 'rgb(245, 245, 245)');
      }
      await page.locator('summary').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#answer')).toBeVisible();
      await page.getByRole('button', { name: 'Open response' }).click();
      await expect(page.locator('#response')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#response')).toBeHidden();
      assert.deepEqual(failures, []);
      page.off('requestfailed', failedRequest);
    }
  });
}
