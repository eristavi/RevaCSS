# Laravel integration validation — 14 October 2026

This is server-side validation of an optional version 2 candidate. It does not close the framework's release gates or certify accessibility/browser compatibility.

## Tested compatibility

Runtime: PHP 8.3.6, Composer 2.10.3, SQLite. Each compatibility combination was installed into a fresh disposable dependency directory.

| Suite | Laravel | Livewire | Result |
| --- | --- | --- | --- |
| Adapter | 12.70.0 | Not required | 23 tests, 265 assertions passed |
| Adapter | 13.36.0 | Not required | 23 tests, 265 assertions passed |
| Reference application | 12.70.0 | 3.8.10 | 8 tests, 77 assertions passed |
| Reference application | 12.70.0 | 4.4.7 | 8 tests, 77 assertions passed |
| Reference application | 13.36.0 | 3.8.10 | 8 tests, 77 assertions passed |
| Reference application | 13.36.0 | 4.4.7 | 8 tests, 77 assertions passed |

Coverage includes Blade registration/rendering, associated labels/hints/errors, unique generated IDs, named validation bags, bracket/dot field keys, escaped content, malformed previous input, zero and multiple values, password/file non-repopulation, checkbox/radio state, CSRF/method spoofing, native wrappers, supported appearance values, user isolation, registered application palettes, matching global/scoped extensions, immutable asset checksums, ordinary/reactive pagination, non-destructive installation and published view overrides.

The reference suite covers guest restrictions, hashed registration, login/logout, owned CRUD, cross-user record protection, validation output, saved appearance preferences and real server-side Livewire filtering/pagination. It does not exercise browser-side Livewire hydration or touch/keyboard interactions.

The local reference installation also completed package discovery, key generation, SQLite migration, asset publishing, configuration caching, Blade view caching, route caching and cache clearing on Laravel 13. Source syntax and Composer metadata checks pass. Core CSS/tokens/build scripts and npm package metadata are unchanged from baseline `9f1ad5f`.

The standalone `2.0.0-dev` ZIP was installed through a Composer artifact repository into a fresh application, without a source path repository. All 8 reference tests and 77 assertions passed using the installed package. `reva:install` completed, strict Composer metadata validation passed, and every one of the 95 published assets matched its manifest checksum. The archive contains no dependencies, credentials, application database or test suite.

`prepare.mjs` copies 95 existing CSS/font/icon/license files byte for byte. The tests compare each prepared asset with its SHA-256 manifest and original distribution file. Generated copies remain package-preparation outputs; the integration introduces no CSS fork.

## Repeatable commands

```sh
node integrations/laravel/scripts/prepare.mjs
cd integrations/laravel
composer install
composer test
cd ../../examples/laravel
composer install
composer test
```

The manually dispatched `Requested Laravel integration checks` workflow contains the Laravel 12/13 and Livewire 3/4 matrix. It prepares assets and checks the adapter/reference app without browser automation. It does not publish or deploy.

## Deferred version 2 review

Before release, review visual states, 320px/narrow-container reflow, text enlargement, native pickers, mobile navigation, touch/keyboard/focus behaviour, assistive technologies, forced colours, reduced motion, print, scoped isolation and application-side Livewire hydration. Validate supported physical browsers/devices and record evidence using the existing framework quality standard. Review custom palette contrast per consuming application.

Boost resources follow its documented third-party package format. Discovery by actual coding assistants, Packagist publication and production release preparation remain separate steps. The reference app's basic authentication does not implement password reset, email verification or MFA.
