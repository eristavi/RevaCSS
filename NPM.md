# RevaCSS on npm

Current source prepares the 2.0.0 candidate. Registry/CDN examples below refer to the existing 1.2.1 distribution; the local-checkout example produces 2.0.0. Do not publish the candidate until its [acceptance record](quality/releases/v2.0.0.md) is complete. Read [MIGRATION.md](MIGRATION.md) for the palette changes.

**RevaCSS 1.2.1 — Erisian** is published on npm with the `latest` tag. It is a stylesheet package with no framework JavaScript or runtime dependencies. Its archive matches the public [GitHub release](https://github.com/eristavi/RevaCSS/releases/tag/v1.2.1) byte for byte; see the [npm publication record](quality/releases/v1.2.1.md#npm-publication-on-14-october-2026).

The 1.2.1 distribution includes the optional `reva.button-materials.css` and scoped counterpart. Load the matching extension after the core to use independent action materials.

```sh
npm install revacss@1.2.1
```

## Install the local package

From a development checkout, build and pack the distribution:

```sh
npm ci
mkdir -p artifacts
npm pack --pack-destination artifacts
```

In a separate project, install the generated file:

```sh
npm install /path/to/RevaCSS/artifacts/revacss-2.0.0.tgz
```

The tarball includes compiled CSS, tokens, stylesheet type declarations, SVG icons, the optional Manrope font and its license, the MIT license, the README, changelog, and this guide. It contains no framework JavaScript or runtime dependencies. The contributor's Node requirement applies to development tooling rather than installed CSS consumers.

## Use with a bundler

Import the complete core once in your application's entry file:

```js
import 'revacss';
```

Load optional extensions after the core:

```js
import 'revacss';
import 'revacss/dist/reva.glass.css';
import 'revacss/dist/reva.motion.css';
```

The JavaScript file here belongs to your application; these imports load CSS. RevaCSS adds no JavaScript runtime. Configure appearance with the same inherited HTML attributes used by the GitHub distribution.

A bundler can also resolve imports directly from a CSS entry file:

```css
@import "revacss";
@import "revacss/dist/reva.glass.css";
```

Bare and stylesheet imports include declarations for strict TypeScript projects, including `noUncheckedSideEffectImports`. These declarations describe side-effect stylesheets and introduce no JavaScript exports.

For a scoped integration, use the matching styles and place your markup inside `.reva`:

```js
import 'revacss/dist/reva.scoped.css';
import 'revacss/dist/reva.glass.scoped.css';
```

Global, minified, modular, and component files retain their existing `revacss/dist/*` paths. Tokens are available under `revacss/tokens/*`. Fonts load separately through `revacss/dist/reva-fonts.css`; a bundler copies the referenced font asset. Icons remain available under `revacss/dist/icons/*`.

For plain HTML, copy the required stylesheets from `node_modules/revacss/dist/` to your public assets. Keep `fonts/` beside `reva-fonts.css` when using Manrope.

## Registry and CDN use

```sh
npm install revacss@1.2.1
```

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/revacss@1.2.1/dist/reva.min.css">
```

The unpkg equivalent is `https://unpkg.com/revacss@1.2.1/dist/reva.min.css`. Both CDN defaults select the complete minified core; extensions and fonts still load separately.

## Validate and publish

```sh
npm run test:package
npm run test:package:browser
npm run check:release-quality
```

Package tests install an actual tarball in a clean project, verify public paths and distribution bytes, and build global/scoped consumer pages with Vite. Browser checks exercise the bundled pages without JavaScript in Chromium, Firefox, and WebKit. Use the browser installation steps in the main README first.

The published 1.2.1 release passed both quality gates at its immutable tag. Its manual acceptance and the maintainer's 10 October visual sign-off are recorded in [the tagged quality registry](https://github.com/eristavi/RevaCSS/blob/v1.2.1/quality/blockers.json) and [validation record](https://github.com/eristavi/RevaCSS/blob/v1.2.1/quality/releases/v1.2.1.md). The historic 1.0.0 exception was not used. The 2.0.0 candidate now has fresh maintainer manual acceptance and a completed Nuxt-only dependency review. Stable adapter packaging is prepared and final release validation remains pending; publication is still a separate action.

The commands and pinned CDN URLs above describe the published 1.2.1 package. For future releases, authenticate with npm, verify the account using `npm whoami`, and publish only a validated release. Any required npm two-factor confirmation belongs to that publishing step. The `npm-publish.yml` workflow supports verified GitHub-release archives, manual backfills and future published stable releases when configured as a trusted publisher. The manual authenticated 1.2.1 publication does not establish that workflow's trust configuration.

### Configure token-free GitHub publishing

In the npm settings for `revacss`, add a GitHub Actions trusted publisher:

- Organization or user: `eristavi`
- Repository: `RevaCSS`
- Workflow filename: `npm-publish.yml`
- Environment name: leave empty
- Allowed actions: enable direct `npm publish`

No npm token or GitHub repository secret is required. npm may require your normal sign-in and two-factor confirmation for this account change.

For a verified published GitHub release, open **Actions → Publish verified npm releases → Run workflow** and enter its exact stable tag, such as `v1.2.1`. The default manual mode is a dry run. Turn **dry_run** off only when that release is ready for registry distribution. Future stable GitHub releases can publish automatically when they contain the workflow and a completed npm archive. Ordinary source pushes do not backfill or publish packages.

The publisher downloads the original release tarball, checks its GitHub SHA-256 digest and package identity, and runs the npm quality gate from the exact release commit. Already published versions must have matching bytes. Historical backfills use `legacy` when needed to avoid moving `latest` backwards. Registry verification compares the published SHA-512 integrity with the prepared archive.

The tarball is already built, so publication does not rerun its build lifecycle. The release's completed browser/package checks remain the validation record. Trusted publishing adds npm provenance automatically.

## Stable optional adapter archives

The core remains `revacss`. Optional npm packages are `@revacss/astro`,
`@revacss/vue`, `@revacss/react` and `@revacss/svelte`, each prepared at `2.0.0`.
After building the core and installing React packaging tooling, prepare all
adapter archives without publishing:

```sh
npm --prefix integrations/react ci --ignore-scripts --legacy-peer-deps
node scripts/package-integrations.mjs artifacts
```

This emits four `.tgz` files, `revacss-laravel-2.0.0.zip`, an integration inventory
and SHA-256 checksums. The Laravel archive is a Composer artifact; it is not an
npm package or a Packagist registration. The release workflow gates publication
on packed consumers and Composer installation, then rebuilds matching archives
at the release commit. Core bytes and package exports stay independent.

For a published `v2.x` GitHub release, the npm publishing workflow selects the
core and all four adapter archives. Manual runs select one `package_name` and
start in dry-run mode. Every package gets its own registry identity/integrity
check; existing versions cannot be overwritten and older backfills cannot move
`latest` backwards. GitHub asset digests and the release quality gate still apply.

Each scoped package needs package-creation rights in the `@revacss` scope and its
own trusted-publisher configuration for this repository/workflow. These account
settings and registry availability have not been established by archive
preparation. Confirm package-creation rights and per-package trusted-publisher setup at the
publication step; see the [official npm trusted-publishing guidance](https://docs.npmjs.com/trusted-publishers/).
