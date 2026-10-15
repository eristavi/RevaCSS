import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync } from 'node:fs';

const site = process.env.REVA_SITE || 'https://revacss.eristavi.org';
const base = '/' + (process.env.REVA_BASE || '/').split('/').filter(Boolean).join('/');
const prefix = base === '/' ? '/' : base + '/';
const publicRoot = new URL(prefix, site);

export default defineConfig({
  output: 'static',
  site,
  base: prefix,
  build: { format: 'directory' },
  integrations: [sitemap({
    // Astro does not discover standalone HTML copied from public/.
    customPages: readdirSync(new URL('./public/launch/', import.meta.url))
      .filter(name => name.endsWith('.html'))
      .map(name => new URL(`launch/${name}`, publicRoot).href),
    filter: url => {
      const path = new URL(url).pathname.slice(prefix.length);
      return !path.startsWith('preview/') &&
        !/^(?:404|500)(?:\.html|\/)?$/.test(path) &&
        !/(?:^|\/)source(?:\/|\.html$)/.test(path) &&
        path !== 'guide/custom-components/starter.html' &&
        !(path.startsWith('demos/marketing/') && path !== 'demos/marketing/');
    },
  })],
});
