import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';

const metadata = JSON.parse(await readFile('package.json', 'utf8'));
const [packed] = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--ignore-scripts', '--json'], {
  encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'],
}));
const paths = new Set(packed.files.map(file => file.path));
const exports = Object.values(metadata.exports).flatMap(value => typeof value === 'string' ? [value] : Object.values(value));
const entryPoints = [metadata.main, metadata.style, metadata.types, metadata.unpkg, metadata.jsdelivr,
  ...exports.filter(path => !path.includes('*'))];
for (const entry of entryPoints) {
  assert.ok(paths.has(entry.replace(/^\.\//, '')), `Missing package entry: ${entry}`);
}
for (const required of ['LICENSE', 'README.md', 'CHANGELOG.md', 'NPM.md',
  'dist/reva.scoped.css', 'dist/reva.glass.css', 'dist/reva.glass.scoped.css',
  'dist/reva.soft.css', 'dist/reva.soft.scoped.css', 'dist/reva.veil.css', 'dist/reva.motion.css', 'dist/reva.selects.css',
  'dist/reva-fonts.css', 'dist/fonts/Manrope.ttf', 'dist/fonts/OFL.txt',
  'dist/icons/reva.svg', 'tokens/foundation.tokens.json']) {
  assert.ok(paths.has(required), `Missing distribution asset: ${required}`);
}
for (const path of paths) {
  assert.ok(/^(?:(?:package\.json|LICENSE|README\.md|CHANGELOG\.md|NPM\.md)$|(?:dist|tokens|types)\/)/.test(path),
    `Unexpected package file: ${path}`);
  assert.ok(!/\.(?:[cm]?js|py)$/.test(path), `Unexpected framework runtime: ${path}`);
  assert.ok(!path.endsWith('.npmrc'), `Unexpected npm configuration: ${path}`);
}
assert.equal(Object.keys(metadata.dependencies || {}).length, 0, 'Core must have no runtime dependencies.');
assert.ok(!metadata.engines, 'Contributor tooling must not constrain CSS consumers.');
console.log(`npm package verified: ${paths.size} files; CSS entry points, assets, and licenses included.`);
