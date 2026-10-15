import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

test('built sitemap and robots use the deployment origin/base and index public pages', async () => {
  const root = 'docs/dist';
  const site = new URL(process.env.REVA_SITE || 'https://revacss.eristavi.org');
  const prefix = '/' + (process.env.REVA_BASE || '/').split('/').filter(Boolean).join('/') + '/';
  const base = prefix === '//' ? '/' : prefix;
  const publicRoot = new URL(base, site);
  const locations = xml => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1].replaceAll('&amp;', '&')));
  const index = await readFile(join(root, 'sitemap-index.xml'), 'utf8');
  assert.match(index, /<sitemapindex\b/);
  const chunks = locations(index);
  assert.ok(chunks.length > 0);
  const pages = [];
  for (const chunk of chunks) {
    assert.equal(chunk.origin, publicRoot.origin);
    assert.ok(chunk.pathname.startsWith(base));
    const xml = await readFile(join(root, chunk.pathname.slice(base.length)), 'utf8');
    assert.match(xml, /<urlset\b/);
    pages.push(...locations(xml));
  }
  assert.equal(new Set(pages.map(url => url.href)).size, pages.length, 'No duplicate page URLs');
  for (const path of ['', 'guide/', 'attributes/', 'components/buttons/', 'reference/components/', 'demos/marketing/',
    'launch/index.html', 'launch/defaults.html', 'launch/forms.html', 'launch/native.html']) {
    assert.ok(pages.some(url => url.href === new URL(path, publicRoot).href), `Missing public page: ${path}`);
  }
  for (const page of pages) {
    assert.equal(page.origin, publicRoot.origin);
    assert.ok(page.pathname.startsWith(base));
    assert.equal(page.search + page.hash, '');
    const path = page.pathname.slice(base.length);
    assert.ok(!path.startsWith('preview/'), 'Isolated preview must not be indexed');
    assert.ok(!/(?:^|\/)source(?:\/|\.html$)/.test(path), 'Download source must not be indexed');
    assert.notEqual(path, '404.html');
    assert.notEqual(path, 'guide/custom-components/starter.html');
    assert.ok(!path.startsWith('demos/marketing/') || path === 'demos/marketing/', 'Marketing variants must not duplicate the main demo');
    let target = join(root, decodeURIComponent(path));
    if ((await stat(target)).isDirectory()) target = join(target, 'index.html');
    assert.ok((await stat(target)).isFile(), `Missing sitemap target: ${page.href}`);
  }
  const robots = await readFile(join(root, 'robots.txt'), 'utf8');
  assert.match(robots, /^User-agent: \*\nAllow: \/\n/m);
  assert.ok(robots.includes(`Sitemap: ${new URL('sitemap-index.xml', publicRoot).href}\n`));
  const home = await readFile(join(root, 'index.html'), 'utf8');
  assert.ok(home.includes(`href="${base}sitemap-index.xml"`));
});
