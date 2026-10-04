# npm preparation — Erisian 1.0.0

Validation date: 4 October 2026 (Asia/Nicosia).

Scope: prepare an installable npm candidate from the released framework. The package remains private and has not been published to npm. The existing GitHub release tag and downloads remain unchanged.

## Distribution

The tarball exposes the complete core through `revacss`, existing styles and assets through `revacss/dist/*`, and tokens through `revacss/tokens/*`. CSS imports are marked as side effects so bundlers retain them. Stylesheet declarations support strict TypeScript side-effect imports. CDN defaults point to the complete minified core.

The candidate contains 93 files, including all 83 distribution assets, tokens, declarations, licenses, README, changelog, and the npm guide. It contains no framework JavaScript or runtime dependencies. Contributor Node requirements apply to development tooling, not CSS consumers.

| Candidate | Value |
| --- | --- |
| File | `revacss-1.0.0.tgz` |
| Size | 170,483 bytes |
| SHA-256 | `d770aadfb00b80e060bbbb13803674261b8533b9a8aa601e4b3d04a0379988f7` |

This checksum identifies the locally reviewed candidate. Git metadata can change tarball metadata when CI packs a committed checkout; CI retains its own candidate for review.

## Automated verification

Verified with Node 24.19.0, npm 11.9.0, TypeScript 5.9.3, Vite 8.3.1, and Playwright 1.63.0 in the Linux cloud environment.

| Check | Result |
| --- | --- |
| CSS and documentation build | Passed; 383 pages generated |
| Existing unit suite | 55 passed; no failures or skipped tests |
| Package integration suite | 4 passed; no failures or skipped tests |
| Chromium package consumers | Global, scoped, and CSS-only pages passed |
| Firefox package consumers | Global, scoped, and CSS-only pages passed |
| WebKit package consumers | Global, scoped, and CSS-only pages passed |
| Candidate integrity | All distribution files and tokens match the checkout byte for byte |
| Design preservation | All 44 compiled CSS files match the reviewed GitHub release build byte for byte |
| Publication gate | Expected failure; all six manual acceptance items remain open |

Integration tests pack a real tarball, install it offline in a clean project with normal npm lifecycle behavior, check public exports, build three consumer pages, and compile strict TypeScript imports with `noUncheckedSideEffectImports`. The bundle retains CSS and copies font and SVG assets.

Browser checks cover all three consumer pages in each engine at a 375px viewport with JavaScript disabled. They verify actual font loading, icon loading, scoped boundaries, card styling, absence of horizontal overflow and failed requests, keyboard disclosure, native popovers, and Escape dismissal. These headless checks do not establish physical Safari/iOS or screen-reader acceptance. The browser environment adjustments described in [the GitHub release validation](releases/v1.0.0.md) also apply here.

The `Check npm package` workflow installs locked development dependencies, runs the package integration suite, and retains a newly packed candidate for 14 days. It has read-only repository permissions and does not publish to npm.

## Publication status

`private: true` remains in place. `prepublishOnly` invokes `check:release-quality`; the six open manual entries in `quality/blockers.json` still block that gate. No manual item was closed by packaging work.

The registry returned no public `revacss` package during preparation. This observation does not reserve the name. After acceptance is recorded, publication requires a reviewed change to remove `private`, the full validation, and authentication to the intended npm account. See [the npm guide](../NPM.md) for the commands.
