# First npm release — Erisian 1.0.0

Date: 4 October 2026 (Asia/Nicosia).

The maintainer requested publication of `revacss@1.0.0` after the npm preparation and its known limitations were disclosed. Publication completed under the verified `eristavi` account, with public access and the `latest` tag pointing to `1.0.0`. The package is available at [npm](https://www.npmjs.com/package/revacss).

The published package exposes CSS, stylesheet declarations, tokens, fonts, icons, licenses, and installation documentation. It introduces no framework JavaScript or runtime dependencies. The existing GitHub release tag and downloads remain unchanged.

## Release exception

`quality/npm-publication-v1.0.0.json` records the authorization for the six existing manual acceptance items. Those registry entries remain open. The normal `check:release-quality` command continues to fail; `prepublishOnly` uses `--npm` to apply the recorded exception only to the matching package/version and known manual items. New blockers and future versions are not covered.

Automated checks do not certify physical Safari/iOS, screen-reader acceptance, actual browser zoom/print, or approved visual baselines. The [GitHub release validation](releases/v1.0.0.md) and [npm preparation](npm-preparation.md) contain the existing browser results and limitations.

## Validation

The publication changes have five regression checks for the exception: authorized Erisian, future version, different package, new manual blocker, and new automated blocker. Only the authorized case may proceed with outstanding checks. The package CI runs these with the existing unit suite, then tests the actual tarball installation and consumer bundles.

Before publication, a clean `npm ci` succeeded, all 60 unit tests and four package integration checks passed, the complete build generated 383 documentation pages, and the authenticated `npm publish --dry-run --access public` passed. All 44 compiled CSS files still match the reviewed GitHub release build byte for byte.

The registry download matches the reviewed tarball byte for byte, including all 93 files. Its SHA-1 and SHA-512 integrity both match registry metadata. A separate clean project installed `revacss@1.0.0` from the public registry using a fresh cache. Every distribution file, token, declaration, license, and document matched the checkout; global, scoped, and CSS-only Vite consumer pages built with fonts and icons.

| Published artifact | Value |
| --- | --- |
| Version / latest tag | `1.0.0` |
| Maintainer | `eristavi` |
| Registry source commit | `5600e89c994eabdfff6f90a9c232c476ee82d915` |
| Tarball | `https://registry.npmjs.org/revacss/-/revacss-1.0.0.tgz` |
| SHA-1 | `fe25931b8366f40c1724fe8481fac1f9bcef33d0` |
| SHA-256 | `767f89412726c4abba99dff7ec11497ff9f50363ee4750ee611a1e8e0c785360` |

npm's publishing library uploaded the exact reviewed archive after browser publishing confirmation. Authentication was stored outside the repository and excluded from distribution. The six manual acceptance records remain open.
