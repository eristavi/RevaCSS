# RevaCSS on npm

**RevaCSS 1.2.1 — Erisian** (prepared package; registry publication pending authentication) is a stylesheet package with no framework JavaScript or runtime dependencies. The same CSS is available in the public [GitHub release](https://github.com/eristavi/RevaCSS/releases/tag/v1.2.1).

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
npm install /path/to/RevaCSS/artifacts/revacss-1.2.1.tgz
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

The existing manual acceptance items and the maintainer's 10 October visual sign-off are recorded in [the quality registry](https://github.com/eristavi/RevaCSS/blob/main/quality/blockers.json) and [validation record](https://github.com/eristavi/RevaCSS/blob/main/quality/releases/v1.2.1.md). The ordinary release gate and npm lifecycle gate must pass; the historic 1.0.0 exception does not apply to 1.2.1.

The commands and pinned CDN URLs above describe the 1.2.1 package. They become available after publication; until verified, the published registry version remains 1.0.0. Authenticate with npm, verify the account using `npm whoami`, then run `npm publish --access public`. Any required npm two-factor confirmation belongs to that publishing step. The `npm-publish.yml` workflow supports verified GitHub-release archives, manual backfills and future published stable releases. Publication remains pending until npm trusts this workflow.

### Configure token-free GitHub publishing

In the npm settings for `revacss`, add a GitHub Actions trusted publisher:

- Organization or user: `eristavi`
- Repository: `RevaCSS`
- Workflow filename: `npm-publish.yml`
- Environment name: leave empty
- Allowed actions: enable direct `npm publish`

No npm token or GitHub repository secret is required. npm may require your normal sign-in and two-factor confirmation for this account change.

The workflow's push checks verify both existing release candidates without publishing. For the missing versions, open **Actions → Publish verified npm releases → Run workflow**, choose `v1.1.0`, turn **dry_run** off and wait for successful publication; then repeat with `v1.2.1`. The default manual mode is a dry run. Future stable GitHub releases publish automatically when they contain the workflow and a completed npm archive.

The publisher downloads the original release tarball, checks its GitHub SHA-256 digest and package identity, and runs the npm quality gate from the exact release commit. Already published versions must have matching bytes. Historical backfills use `legacy` when needed to avoid moving `latest` backwards. Registry verification compares the published SHA-512 integrity with the prepared archive.

The tarball is already built, so publication does not rerun its build lifecycle. The release's completed browser/package checks remain the validation record. Trusted publishing adds npm provenance automatically.
