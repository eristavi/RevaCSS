# RevaCSS on npm

The npm package for **RevaCSS 1.0.0 — Erisian** is prepared for local testing. It has not been published to the registry. The public [GitHub release](https://github.com/eristavi/RevaCSS/releases/tag/v1.0.0) is available now.

## Install the local package

From a development checkout, build and pack the distribution:

```sh
npm ci
mkdir -p artifacts
npm pack --pack-destination artifacts
```

In a separate project, install the generated file:

```sh
npm install /path/to/RevaCSS/artifacts/revacss-1.0.0.tgz
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

## Registry and CDN use after publication

These commands and URLs become available after the package is published:

```sh
npm install revacss@1.0.0
```

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/revacss@1.0.0/dist/reva.min.css">
```

The unpkg equivalent is `https://unpkg.com/revacss@1.0.0/dist/reva.min.css`. Both CDN defaults select the complete minified core; extensions and fonts still load separately.

## Validate and publish

```sh
npm run test:package
npm run test:package:browser
npm run check:release-quality
```

Package tests install an actual tarball in a clean project, verify public paths and distribution bytes, and build global/scoped consumer pages with Vite. Browser checks exercise the bundled pages without JavaScript in Chromium, Firefox, and WebKit. Use the browser installation steps in the main README first.

Six manual acceptance items remain open in [the quality registry](https://github.com/eristavi/RevaCSS/blob/main/quality/blockers.json). The package stays `private: true`, and `prepublishOnly` runs the existing quality gate. Preparation does not close those items or enable publication.

Once recorded acceptance is complete, verify the npm account with `npm whoami`, remove `private` in a reviewed change, run the complete build and validation, and publish from the checkout with `npm publish --access public`. npm authentication and any required two-factor confirmation belong to that publishing step. Package names are claimed by successful publication; the current absence of a public `revacss` entry does not reserve the name.
