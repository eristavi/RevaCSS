import { readFile, readdir, mkdir, rm, copyFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const root = path.resolve(packageRoot, '../..');
const metadata = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
if (!/^2\.\d+\.\d+$/.test(metadata.version)) throw new Error('This integration targets RevaCSS 2.x.');
const source = path.join(root, 'dist');
const target = path.join(packageRoot, 'resources/assets');
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
const files = {};
async function copy(relative = '') {
  for (const entry of (await readdir(path.join(source, relative), { withFileTypes: true })).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
    const name = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) {
      if (['fonts', 'icons'].includes(name)) { await mkdir(path.join(target, name), { recursive: true }); await copy(name); }
    } else if (entry.isFile() && /\.(css|woff2?|ttf|svg|txt)$/i.test(name)) {
      const bytes = await readFile(path.join(source, name));
      files[name] = createHash('sha256').update(bytes).digest('hex');
      await copyFile(path.join(source, name), path.join(target, name));
    }
  }
}
await copy();
for (const file of ['reva.min.css', 'reva.scoped.css', 'reva-fonts.css', 'fonts/Manrope.woff2']) {
  if (!files[file]) throw new Error(`Missing compiled framework asset: ${file}. Build CSS first.`);
}
const digest = createHash('sha256').update(JSON.stringify(files)).digest('hex');
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const manifest = { version: metadata.version, revision, directory: `${metadata.version}-${digest.slice(0, 12)}`, files };
await writeFile(path.join(target, 'manifest.json'), JSON.stringify(manifest, null, 2)+'\n');
const options = JSON.parse(await readFile(path.join(root, 'tokens/options.json'), 'utf8'));
await writeFile(path.join(packageRoot, 'resources/contracts.json'), JSON.stringify(Object.fromEntries(Object.entries(options).map(([key, value]) => [key, value.values])), null, 2)+'\n');
await copyFile(path.join(root, 'LICENSE'), path.join(packageRoot, 'LICENSE'));
console.log(`Prepared ${Object.keys(files).length} byte-identical assets for ${manifest.directory}. Core untouched.`);
