# RevaCSS

A new default for the web. Native HTML and CSS, token-driven design, easy overrides.

**Foundation alpha · 0.1.0-alpha.1:** not a complete component library or a WCAG certification.

```html
<link rel="stylesheet" href="reva.css">
<button>Get started</button>
```

## Develop and validate

Use Node 22.12+ (Node 24 recommended). Python 3 is required for the browser-test server.

```sh
npm ci
npm run dev
```

For a build from scratch and the full automated suite:

```sh
npm run clean
npm run build
npm test
npx playwright install --with-deps chromium firefox webkit
npm run test:browser
```

`npm test` checks tokens, contrast pairs, size budgets, documentation links, and absence of browser JavaScript. Browser tests run against the built docs with Chromium, Firefox, and WebKit. Use `npm run test:browser -- --project=chromium` for one engine. WebKit checks do not replace testing on real Safari/iOS devices.

Built files include `dist/reva.css`, `dist/reva.min.css`, `dist/reva.scoped.css`, modular stylesheets, and opt-in `dist/reva-fonts.css`. Font loading is separate to avoid mandatory downloads. Copy the `dist/fonts` directory alongside the font stylesheet when using it.

## Optional glass material

Load `reva.glass.css` after `reva.css`, then add `data-material="glass"` to a component or section. `data-material="solid"` ends the treatment locally. Theme, tone, shape, density, depth, fill and contrast use the shared attributes. Styled fields and filled actions stay opaque. Use `reva.glass.scoped.css` with the scoped core. Reduced transparency, increased contrast, forced colours and print have opaque fallbacks; browsers without backdrop filtering retain ordinary core surfaces. See the Glass material documentation for supported components, customization and limits.

## Configure once

Set shared defaults on `<html>`, then write ordinary HTML. All 18 core attributes inherit; each affects its supported targets. For example, `data-table="striped"` makes descendant tables striped, `data-size="large"` sizes controls, and `data-gap="large"` sets layout gaps. A nearer value overrides just that setting: `data-table="plain"`, `data-size="medium"` and `data-ratio="auto"` are explicit resets. Width affects `.container`; gap affects `.grid`, `.row` and `.stack`; ratio/fit affect images. Scoped builds take their configuration on `.reva` or within that boundary.

```html
<html data-theme="dark" data-accent="violet"
      data-table="striped" data-size="large" data-gap="large">
```

## Documentation and GitHub Pages

Astro generates static documentation with no browser JavaScript. `npm run dev` previews it locally. Component pages pair live demos with the exact HTML used to render them in a syntax-highlighted, theme-aware code viewer with native line wrapping. Browse typography, buttons, forms, cards/layouts, tables, images, disclosures, top navigation, glass material, and examples for every shared data attribute. The API reference documents CSS tokens and HTML attributes.

The validation workflow builds from scratch, runs all three browser engines, and checks the `/RevaCSS/` project path. Pushes to `main` deploy documentation only after validation succeeds. In **Settings → Pages → Build and deployment**, select **GitHub Actions** before the first deployment. The expected default address is https://eristavi.github.io/RevaCSS/; a successful deployment is required before that address is available.

`REVA_SITE` and `REVA_BASE` control the documentation origin and path. The deployment workflow reads both from GitHub Pages configuration, including custom domains. Generated docs, public CSS copies, and API-reference data are rebuilt rather than tracked; `dist` remains committed for direct CSS downloads.

## Release status

The public repository is https://github.com/eristavi/RevaCSS, and documentation is live at https://eristavi.github.io/RevaCSS/. The first new component is a responsive top menu with nested native disclosures; see the Components section in the documentation.

**npm publication is on hold until the first fully functional release includes the agreed components and completes automated, manual accessibility and real-device testing.** There will be no foundation-only npm alpha publication. `private: true` remains in place. Read [SPECIFICATION.md](SPECIFICATION.md) for release scope and [IMPLEMENTATION.md](IMPLEMENTATION.md) for implemented features, verification, and outstanding release checks. Core is MIT; bundled fonts retain their own licence.
