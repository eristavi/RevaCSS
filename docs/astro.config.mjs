import { defineConfig } from 'astro/config';
export default defineConfig({ output: 'static', site: process.env.REVA_SITE || 'https://eristavi.github.io', base: process.env.REVA_BASE || '/', build: { format: 'directory' } });
