#!/usr/bin/env python3
"""Build an explicit Composer prerelease ZIP; never modify framework source."""
import json
import subprocess
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

package = Path(__file__).resolve().parents[1]
subprocess.run(['node', str(package / 'scripts/prepare.mjs')], check=True)
manifest = json.loads((package / 'resources/assets/manifest.json').read_text())
version = manifest['version'] + '-dev'
destination = package / 'artifacts' / f'revacss-laravel-{version}.zip'
destination.parent.mkdir(exist_ok=True)
files = []
for name in ['composer.json', 'README.md', 'LICENSE']:
    files.append(package / name)
for name in ['src', 'config', 'resources', 'docs']:
    files.extend(p for p in (package / name).rglob('*') if p.is_file())
with ZipFile(destination, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for file in sorted(files):
        relative = file.relative_to(package).as_posix()
        content = file.read_bytes()
        if relative == 'composer.json':
            composer = json.loads(content)
            composer['version'] = version
            content = (json.dumps(composer, indent=4) + '\n').encode()
        info = ZipInfo(relative, date_time=(1980, 1, 1, 0, 0, 0))
        info.compress_type = ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, content)
print(destination)
