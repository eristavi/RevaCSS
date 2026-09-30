import { rm } from 'node:fs/promises';

for (const path of ['dist', 'docs/dist', 'docs/public/reva', 'docs/.astro', 'docs/src/pages/generated-reference.json']) {
  await rm(new URL('../' + path, import.meta.url), { recursive: true, force: true });
}
