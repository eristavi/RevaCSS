#!/usr/bin/env python3
"""Install the stable Laravel ZIP in an isolated Composer consumer; no app tests."""
import json
import os
import subprocess
import tempfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
version = json.loads((root / 'package.json').read_text())['version']
artifacts = root / 'artifacts'
archive = artifacts / f'revacss-laravel-{version}.zip'
if not archive.is_file():
    raise RuntimeError('Prepare the integration archives first.')
with tempfile.TemporaryDirectory(prefix='reva-composer-artifact-') as directory:
    consumer = Path(directory)
    manifest = {
        'name': 'revacss/artifact-consumer',
        'description': 'Isolated stable artifact installation verification.',
        'type': 'project', 'license': 'MIT',
        'repositories': [{'type': 'artifact', 'url': str(artifacts)}],
        'require': {'revacss/laravel': '^2.0'},
        'config': {'allow-plugins': False}
    }
    (consumer / 'composer.json').write_text(json.dumps(manifest, indent=2)+'\n')
    environment = dict(os.environ, COMPOSER_ALLOW_SUPERUSER='1')
    for arguments in [
        ['validate', '--strict'],
        ['install', '--no-interaction', '--no-progress', '--prefer-dist', '--no-dev'],
    ]:
        subprocess.run(['composer', *arguments], cwd=consumer, env=environment, check=True)
    subprocess.run(['php', '-r', '''
require 'vendor/autoload.php';
if (Composer\\InstalledVersions::getPrettyVersion('revacss/laravel') !== $argv[1]) {
    throw new RuntimeException('Stable version mismatch');
}
if (!class_exists(Reva\\Laravel\\RevaServiceProvider::class)) {
    throw new RuntimeException('Provider autoload failed');
}
$base = 'vendor/revacss/laravel/resources/assets/';
$manifest = json_decode(file_get_contents($base.'manifest.json'), true, 512, JSON_THROW_ON_ERROR);
foreach ($manifest['files'] as $name => $hash) {
    if (hash_file('sha256', $base.$name) !== $hash) throw new RuntimeException('Asset mismatch: '.$name);
}
echo 'Composer artifact installed: revacss/laravel@'.$argv[1].'; provider autoload and '.count($manifest['files']).' asset checksums passed.'.PHP_EOL;
''', version], cwd=consumer, check=True)
