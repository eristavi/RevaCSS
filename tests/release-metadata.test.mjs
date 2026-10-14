import test from 'node:test';
import assert from 'node:assert/strict';
import { releaseMetadata } from '../scripts/release-metadata.mjs';

const metadata = { name: 'revacss', version: '2.0.0', releaseName: 'Erisian' };
const lock = { name: 'revacss', version: '2.0.0', packages: { '': { name: 'revacss', version: '2.0.0' } } };
test('release metadata derives matching versioned asset names', () => {
  assert.deepEqual(releaseMetadata(metadata, lock), { version: '2.0.0', tag: 'v2.0.0', package: 'revacss', release_name: 'Erisian', archive_basename: 'revacss-2.0.0-erisian', tarball_name: 'revacss-2.0.0.tgz' });
});
test('release metadata rejects mismatched lockfiles and unsafe identifiers', () => {
  assert.throws(() => releaseMetadata(metadata, { ...lock, version: '1.2.1' }), /differ/);
  assert.throws(() => releaseMetadata(metadata, { ...lock, packages: { '': { name: 'revacss', version: '1.2.1' } } }), /differ/);
  for (const version of ['2.0.0-preview', '02.0.0', '2.0', '2.0.0\n', '2.0.0\nTAG=other']) assert.throws(() => releaseMetadata({ ...metadata, version }, lock), /semantic version/);
  assert.throws(() => releaseMetadata({ ...metadata, releaseName: 'Erisian\nTAG=other' }, lock), /Unsafe/);
});
