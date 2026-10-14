# Preparing and distributing the stable artifact

The package is a monorepo subdirectory, so pointing a Composer VCS repository at the RevaCSS root is insufficient: there is no Laravel Composer manifest at the root. Use the documented path repository for development or an explicit package artifact. A dedicated Composer repository/subtree split can be introduced during release preparation.

From the RevaCSS root:

```sh
npm ci
npm run build:css
node integrations/laravel/scripts/prepare.mjs
python3 integrations/laravel/scripts/package.py
```

Preparation copies built CSS/assets unchanged, records checksums and versioned destinations, and snapshots `tokens/options.json` values. The ZIP has `composer.json` at its root and includes assets, views, PHP code, configuration, license, documentation and Boost guidance. It excludes dependencies, locks, tests, caches and reference app data. The generated archive manifest declares stable version `2.0.0`; the source Composer manifest omits a version, following normal VCS-package conventions.

In a consuming application's Composer configuration:

```json
{
  "repositories": [{ "type": "artifact", "url": "/path/to/package-artifacts" }]
}
```

Place the prepared ZIP in that directory and require `revacss/laravel:^2.0`. Composer artifact repositories require PHP's ZIP extension. Run `php artisan reva:install` after installation. The proposed package name is not yet registered on Packagist.

The release workflow includes `revacss-laravel-2.0.0.zip` and its SHA-256 checksum alongside core and JavaScript adapter archives. Final release validation and explicit publication remain separate. Use the local artifact directory before publication; download the same ZIP after the GitHub release is published. Packagist availability is not claimed, and the monorepo root is not a Composer VCS package.
