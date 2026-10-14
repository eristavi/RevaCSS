# Preparing and distributing the candidate

The package is a monorepo subdirectory, so pointing a Composer VCS repository at the RevaCSS root is insufficient: there is no Laravel Composer manifest at the root. Use the documented path repository for development or an explicit package artifact. A dedicated Composer repository/subtree split can be introduced during release preparation.

From the RevaCSS root:

```sh
npm ci
npm run build:css
node integrations/laravel/scripts/prepare.mjs
python3 integrations/laravel/scripts/package.py
```

Preparation copies built CSS/assets unchanged, records checksums and versioned destinations, and snapshots `tokens/options.json` values. The ZIP has `composer.json` at its root and includes assets, views, PHP code, configuration, license, documentation and Boost guidance. It excludes dependencies, locks, tests, caches and reference app data. Its version is explicitly `2.0.0-dev`.

In a consuming application's Composer configuration:

```json
{
  "repositories": [{ "type": "artifact", "url": "/path/to/package-artifacts" }]
}
```

Place the prepared ZIP in that directory and require `revacss/laravel:2.0.0-dev`. Composer artifact repositories require PHP's ZIP extension. Run `php artisan reva:install` after installation. The proposed package name is not yet registered on Packagist.

Before version 2 publication: validate framework/Livewire compatibility, validate installed artifacts, finish deferred visual/device/accessibility gates, decide the production distribution mechanism and Composer version, and deliberately publish the package. The candidate scripts do not mark release quality complete, publish to Packagist/npm, modify core builds or change the existing release pipeline.
