import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

test('generated documentation links and assets resolve under the configured base path', async () => {
  const root = 'docs/dist';
  const base = '/' + (process.env.REVA_BASE || '/').split('/').filter(Boolean).join('/');
  const prefix = base === '/' ? '/' : base + '/';
  let pages = 0;
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (entry.name.endsWith('.html')) {
        pages++;
        const html = await readFile(path, 'utf8');
        for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
          const link = match[1];
          if (link.startsWith('#') || /^(?:[a-z]+:|\/\/)/i.test(link)) continue;
          assert.ok(link.startsWith(prefix), `${path}: ${link} must start with ${prefix}`);
          const pathname = new URL(link, 'https://eristavi.github.io').pathname;
          let target = join(root, decodeURIComponent(pathname.slice(prefix.length)));
          try {
            if ((await stat(target)).isDirectory()) target = join(target, 'index.html');
            assert.ok((await stat(target)).isFile(), `${path}: ${link}`);
          } catch (error) {
            assert.fail(`${path}: missing target for ${link}: ${error.message}`);
          }
        }
      }
    }
  }
  await visit(root);
  assert.ok(pages > 0, 'Documentation must contain HTML pages');
});
