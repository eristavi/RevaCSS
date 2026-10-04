# First npm release — Erisian 1.0.0

Date: 4 October 2026 (Asia/Nicosia).

The maintainer requested publication of `revacss@1.0.0` after the npm preparation and its known limitations were disclosed. The package account was verified as `eristavi`. Publication is authorized; this record will be updated after the registry upload is verified.

The candidate is configured for public publication and exposes CSS, stylesheet declarations, tokens, fonts, icons, licenses, and installation documentation. It introduces no framework JavaScript or runtime dependencies. The existing GitHub release tag and downloads remain unchanged.

## Release exception

`quality/npm-publication-v1.0.0.json` records the authorization for the six existing manual acceptance items. Those registry entries remain open. The normal `check:release-quality` command continues to fail; `prepublishOnly` uses `--npm` to apply the recorded exception only to the matching package/version and known manual items. New blockers and future versions are not covered.

Automated checks do not certify physical Safari/iOS, screen-reader acceptance, actual browser zoom/print, or approved visual baselines. The [GitHub release validation](releases/v1.0.0.md) and [npm preparation](npm-preparation.md) contain the existing browser results and limitations.

## Validation

The publication changes have five regression checks for the exception: authorized Erisian, future version, different package, new manual blocker, and new automated blocker. Only the authorized case may proceed with outstanding checks. The package CI runs these with the existing unit suite, then tests the actual tarball installation and consumer bundles.

Before publication, a clean `npm ci` succeeded, all 60 unit tests and four package integration checks passed, the complete build generated 383 documentation pages, and the authenticated `npm publish --dry-run --access public` passed. All 44 compiled CSS files still match the reviewed GitHub release build byte for byte.

Registry metadata and the installed public package are verified after publishing. npm authentication is stored outside the repository and is excluded from distribution.
