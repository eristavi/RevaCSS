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

Load `reva.glass.css` after `reva.css`, then add `data-material="glass"` to a component or section. `data-material="solid"` ends the treatment locally. Theme, tone, shape, density, depth, fill and contrast use the shared attributes. Glass surfaces use 70% backing with stronger supporting text, links and control boundaries. Styled text fields retain their existing treatment. Glass actions use 90% colour backing and backdrop blur; a local material attribute also works on a single button, button link or native action input. Use `reva.glass.scoped.css` with the scoped core. Reduced transparency, increased contrast, forced colours and print have opaque fallbacks; browsers without backdrop filtering retain ordinary core surfaces. See the Glass material documentation for supported components, customization and limits.

## Configure once

Set shared defaults on `<html>`, then write ordinary HTML. All 19 core attributes inherit; each affects its supported targets. For example, `data-table="striped"` makes descendant tables striped, `data-size="large"` sizes controls, and `data-gap="large"` sets layout gaps. A nearer value overrides just that setting: `data-table="plain"`, `data-size="medium"` and `data-ratio="auto"` are explicit resets. Width affects `.container`; gap affects `.grid`, `.row` and `.stack`; ratio/fit affect images. Scoped builds take their configuration on `.reva` or within that boundary.

```html
<html data-theme="dark" data-accent="violet"
      data-table="striped" data-size="large" data-gap="large">
```

## Decorative edges

`data-edge="plain"` is the default. Use `gradient` for a static ring, `shine` for one hover/focus sweep, or `animated` for a slow continuous turn. The setting inherits to buttons, `.button` links and `.card` surfaces; native input actions keep their regular borders. Shape and action/accent colours remain shared. The decorative ring uses twice the shared border width for visibility on light and dark surfaces, without changing layout; `data-border="none"` removes it. `data-motion="none"` pauses movement; reduced motion keeps a static ring. Higher contrast, forced colours and print remove decoration. The effect reserves `::after` on supported targets and falls back to the regular border without composite masking.

```html
<button type="button" data-material="glass" data-edge="animated">Continue</button>
<button type="button" class="secondary">Back</button>
```

## Documentation and GitHub Pages

Astro generates static documentation with no browser JavaScript. `npm run dev` previews it locally. Component pages pair live demos with the exact HTML used to render them in a syntax-highlighted, theme-aware code viewer with native line wrapping. Browse typography, buttons, badges, alerts, forms, cards/layouts, tables, images, disclosures, top navigation, glass material, and examples for every shared data attribute. The API reference documents CSS tokens and HTML attributes.

The validation workflow builds from scratch, runs all three browser engines, and checks the `/RevaCSS/` project path. Pushes to `main` deploy documentation only after validation succeeds. In **Settings → Pages → Build and deployment**, select **GitHub Actions** before the first deployment. The expected default address is https://eristavi.github.io/RevaCSS/; a successful deployment is required before that address is available.

`REVA_SITE` and `REVA_BASE` control the documentation origin and path. The deployment workflow reads both from GitHub Pages configuration, including custom domains. Generated docs, public CSS copies, and API-reference data are rebuilt rather than tracked; `dist` remains committed for direct CSS downloads.

## Release status

The public repository is https://github.com/eristavi/RevaCSS, and documentation is live at https://eristavi.github.io/RevaCSS/. The first new component is a responsive top menu with nested native popovers, outside-click dismissal and Escape support; see the Components section in the documentation.

**npm publication is on hold until the first fully functional release includes the agreed components and completes automated, manual accessibility and real-device testing.** There will be no foundation-only npm alpha publication. `private: true` remains in place. Read [SPECIFICATION.md](SPECIFICATION.md) for release scope and [IMPLEMENTATION.md](IMPLEMENTATION.md) for implemented features, verification, and outstanding release checks. Core is MIT; bundled fonts retain their own licence.

Shared defaults: set `data-theme="light"` or `data-theme="dark"` on `<html>` for a complete palette with default component settings. Configure shape, borders, density and other attributes globally, then override only exceptions on sections or elements. The [defaults and coverage reference](https://eristavi.github.io/RevaCSS/attributes/#defaults-reference) lists every supported target and omitted value. Native validation, focus and accessibility preferences remain authoritative.

All documentation and preview page headers use the shared native-popover top menu and one navigation data source. The Theme menu offers System, Light and Dark using native radio inputs and CSS `:has()`. The choice applies to the current page, including code viewers, while explicit local themes stay independent. New pages use their configured default; no preference is stored and no browser JavaScript is shipped.

## Component quality standard

[QUALITY_STANDARD.md](QUALITY_STANDARD.md) defines the acceptance gates and existing-component coverage. Mixed-content fixtures and explicit known-failure regressions run with the browser suite. Expected failures are release blockers, not acceptance passes. `npm run check:release-quality` exits nonzero until recorded automated and manual blockers are resolved. Alpha documentation validation reports this separately; publication remains on hold.


## Badges

Use `<span class="badge">New</span>` for passive labels. Badges inherit theme, accent, size, shape, density, depth, borders, gradient and material settings from the parent. Optional `data-variant="primary|success|warning|danger|neutral"` and `data-appearance="tinted|solid|outline"` configure badges on any parent; local overrides remain optional. Defaults are primary and tinted. Use visible status text and meaningful count context; badges add no live-region roles or interaction. See the [badge examples](https://eristavi.github.io/RevaCSS/components/badges/). Modular builds provide `reva.badges.css`; glass remains opt-in.

### Alerts

Use `<div class="alert">Information: Your draft is saved.</div>` for a persistent message. Alerts inherit shared parent styling and use the same optional `data-variant="primary|success|warning|danger|neutral"` and `data-appearance="tinted|solid|outline"` as badges. Defaults are primary (informational, using the inherited accent) and tinted. Use visible status text. Static messages need no live-region role; application updates can use an established `role="status"` or, when urgent, `role="alert"` region. No JavaScript or dismissal behavior is included. See the [alert examples](https://eristavi.github.io/RevaCSS/components/alerts/). Modular builds provide `reva.alerts.css`; glass remains opt-in.
