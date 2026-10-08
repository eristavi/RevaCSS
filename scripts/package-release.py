#!/usr/bin/env python3
"""Build reproducible GitHub distribution archives from the compiled framework."""

import argparse
import gzip
import hashlib
import io
import json
from pathlib import Path
import re
import tarfile
import zipfile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output', type=Path, default=Path('artifacts'))
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
metadata = json.loads((root / 'package.json').read_text())
version = metadata['version']
codename = metadata['releaseName'].lower()
if not re.fullmatch(r'\d+\.\d+\.\d+', version) or not re.fullmatch(r'[a-z0-9-]+', codename):
    raise SystemExit('Release version and name must be safe archive identifiers.')
name = f"{metadata['name']}-{version}-{codename}"
required = ['dist/reva.css', 'dist/reva.min.css', 'dist/reva.scoped.css',
            'dist/reva.glass.css', 'dist/reva.soft.css', 'dist/reva.soft.scoped.css', 'dist/reva.veil.css', 'dist/reva.motion.css',
            'dist/reva.selects.css', 'dist/icons/reva.svg', 'dist/fonts/Manrope.ttf',
            'dist/fonts/OFL.txt']
if any(not (root / path).is_file() for path in required):
    raise SystemExit('Compiled assets are missing. Run npm run build before packaging.')
files = {path.relative_to(root).as_posix(): path.read_bytes()
         for directory in ['dist', 'tokens']
         for path in sorted((root / directory).rglob('*')) if path.is_file()}
for filename in ['LICENSE', 'README.md', 'CHANGELOG.md', 'RELEASE_NOTES.md',
                 'SPECIFICATION.md', 'IMPLEMENTATION.md', 'QUALITY_STANDARD.md',
                 'package.json', 'quality/blockers.json',
                 f'quality/releases/v{version}.md', '.github/assets/revacss-preview.png']:
    files[filename] = (root / filename).read_bytes()
files['starter.html'] = (root / 'examples/quick-start.html').read_bytes().replace(b'../dist/', b'dist/')
files['index.html'] = files['starter.html']
if any(filename.endswith('.js') for filename in files if filename.startswith('dist/')):
    raise SystemExit('A framework JavaScript runtime must not enter the distribution.')
output = args.output.resolve()
output.mkdir(parents=True, exist_ok=True)
zip_path = output / f'{name}.zip'
with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for filename, content in sorted(files.items()):
        info = zipfile.ZipInfo(f'{name}/{filename}', date_time=(1980, 1, 1, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, content, compresslevel=9)
tar_path = output / f'{name}.tar.gz'
with tar_path.open('wb') as raw:
    with gzip.GzipFile(filename='', mode='wb', fileobj=raw, mtime=0) as compressed:
        with tarfile.open(fileobj=compressed, mode='w', format=tarfile.PAX_FORMAT) as archive:
            for filename, content in sorted(files.items()):
                info = tarfile.TarInfo(f'{name}/{filename}')
                info.size = len(content)
                info.mode = 0o644
                info.mtime = 0
                archive.addfile(info, io.BytesIO(content))
core_path = output / f'reva-{version}.min.css'
core_path.write_bytes(files['dist/reva.min.css'])
checksums = ''.join(f'{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}\n'
                    for path in [zip_path, tar_path, core_path])
(output / 'SHA256SUMS.txt').write_text(checksums)
for path in [zip_path, tar_path, core_path, output / 'SHA256SUMS.txt']:
    print(f'{path.name}: {path.stat().st_size:,} bytes')
print(f'Both archives contain {len(files)} files; timestamps are fixed for reproducible hashes.')
