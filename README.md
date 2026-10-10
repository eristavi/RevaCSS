# RevaCSS

**Start with HTML. Set your defaults once.**

Build consistent interfaces from native HTML. Choose your theme, palette, shape, and spacing on a parent; components inherit the design, and local settings handle the exceptions.

[Documentation](https://eristavi.github.io/RevaCSS/) · [Live demos](#see-it-in-action) · [Get started](#start-with-html) · [API reference](https://eristavi.github.io/RevaCSS/reference/) · [Using RevaCSS with AI](https://eristavi.github.io/RevaCSS/guide/ai/)

**Version 1.2.1 · Erisian** · [Download the release](https://github.com/eristavi/RevaCSS/releases/tag/v1.2.1) · [MIT](https://github.com/eristavi/RevaCSS/blob/v1.2.1/LICENSE)

[![The same RevaCSS project card rendered in Light, Dark, Glass, and Veil, using shared design settings.](https://raw.githubusercontent.com/eristavi/RevaCSS/v1.2.1/.github/assets/revacss-preview.png)](https://eristavi.github.io/RevaCSS/demos/marketing/)

## Why RevaCSS

Read the [founder’s note](https://eristavi.github.io/RevaCSS/guide/why-revacss/) about shared design decisions, native HTML and AI-assisted development, or [compare framework approaches](https://eristavi.github.io/RevaCSS/guide/comparison/).

- **A shared design, with fewer repeated decisions.** Set page or section defaults with inherited `data-*` attributes. Override individual settings where you need them.
- **Native elements and interactions.** Buttons, forms, details, radio choices, and popovers keep their browser behavior. The framework requires no JavaScript runtime.
- **Room for your own design.** Tokens, CSS custom properties, low-specificity selectors, and cascade layers make ordinary CSS overrides practical.
- **Appearance that adapts.** Light, dark, and system themes; 14 coordinated palettes; optional Glass, Soft UI and Veil materials; support for user preferences.
- **A compact foundation.** The complete minified core has an enforced 17 KiB gzip budget. Fonts, icons, and optional extensions are separate assets.

Use RevaCSS with static pages, server-rendered templates, or a framework that renders HTML. Your application owns its data, routing, and business actions.

## Build with an AI assistant

Give your coding assistant the [AI guide](AI.md) and the [documentation index](https://eristavi.github.io/RevaCSS/llms.txt). The index links to version-matched Markdown component references, supported attribute values and complete demo starters. The [structured API](https://eristavi.github.io/RevaCSS/ai/api.json) includes component contracts and HTML examples; the [HTML editor custom data](https://eristavi.github.io/RevaCSS/ai/html-custom-data.json) supplies attribute and value suggestions.

These resources regenerate from the same manifests and examples as the website on each documentation build. They provide explicit context for an assistant; they do not guarantee automatic discovery by AI services. Follow your project's instructions about validation and deployment.

## See it in action

Explore complete layouts, change their appearance, and download the starting HTML.

| Demo | Explore |
| --- | --- |
| [Forma · Marketing website](https://eristavi.github.io/RevaCSS/demos/marketing/) | Responsive navigation, features, pricing, FAQ, and a contact form. |
| [Workspace · Dashboard](https://eristavi.github.io/RevaCSS/demos/dashboard/) | An application shell, metric cards, SVG charts, and activity history. |
| [Fieldnotes · Journal](https://eristavi.github.io/RevaCSS/demos/blog/) | Articles, archives, category pages, and author profiles. |
| [Still · Shop](https://eristavi.github.io/RevaCSS/demos/shop/) | A catalogue, product pages, native scroll-snap galleries, and a sample bag. |

The demos use sample content. Commerce, form processing, and live application data come from your backend.

## Start with HTML

Download [reva.min.css](https://raw.githubusercontent.com/eristavi/RevaCSS/v1.2.1/dist/reva.min.css), place it beside your HTML, and link it in the page:

```html
<!doctype html>
<html lang="en" data-theme="auto" data-palette="ocean" data-shape="rounded">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My first RevaCSS page</title>
    <link rel="stylesheet" href="reva.min.css">
  </head>
  <body>
    <main class="container">
      <article class="card">
        <h1>Your next idea starts here.</h1>
        <p>Native HTML. A shared design. Your own direction.</p>
        <button type="button">Get started</button>
      </article>
    </main>
  </body>
</html>
```

Native elements receive useful defaults. A structural class, such as `.card` or `.container`, identifies a pattern where one is needed. See the [getting-started guide](https://eristavi.github.io/RevaCSS/guide/) for installation and stylesheet choices.

Until npm publication is verified, the registry package remains `revacss@1.0.0`. The prepared 1.2.1 package will install with `npm install revacss@1.2.1`; then import `revacss` in your application's CSS-capable bundler. See the [npm guide](https://github.com/eristavi/RevaCSS/blob/main/NPM.md) for scoped styles, fonts, icons, and CDN installation.

Version 1.2.1 includes optional [button materials](https://eristavi.github.io/RevaCSS/themes/button-materials/). Load `reva.button-materials.css` after the core, then set `data-button-material="liquid"` on your HTML root or a section. Choose default, solid, glass, veil, soft or liquid. Liquid is transparent neutral glass without accent tint; its movement follows `data-motion`. Navigation toggles, dropdown controls and general surfaces keep their existing appearance. This extension is included in the 1.2.1 GitHub downloads.

## Configure once, refine locally

Appearance settings work independently. A local value changes that setting while the rest of the design continues to inherit.

```html
<section data-theme="dark" data-palette="violet" data-size="large">
  <button type="button">Save changes</button>
  <button type="button" class="secondary" data-size="small">Back</button>
</section>
```

Choose [shared attributes and defaults](https://eristavi.github.io/RevaCSS/attributes/), learn [inheritance and overrides](https://eristavi.github.io/RevaCSS/guide/styling/), or browse the [component contracts](https://eristavi.github.io/RevaCSS/reference/components/).

## Make it yours

| Choice | What it adds |
| --- | --- |
| [Palettes](https://eristavi.github.io/RevaCSS/themes/palettes/) | 14 coordinated color families across light, dark, and system themes. |
| [Glass](https://eristavi.github.io/RevaCSS/themes/glass/) | Frosted surfaces, backdrop blur, and shared appearance settings. |
| [Soft UI](https://eristavi.github.io/RevaCSS/themes/soft/) | Raised opaque surfaces, inset fields and pressed actions using paired shadows. |
| [Veil](https://eristavi.github.io/RevaCSS/themes/veil/) | Diffused perimeter color and inset contours without backdrop blur. |
| [Motion](https://eristavi.github.io/RevaCSS/guide/motion/) | Optional native overlay transitions that follow the shared motion setting. |
| [Native selects](https://eristavi.github.io/RevaCSS/components/selects/) | An optional enhancement for single-select pickers in supporting browsers. |
| [Icons](https://eristavi.github.io/RevaCSS/icons/) | An outline SVG set that inherits the surrounding text color. |

Load an optional extension after the core, then configure it through the same parent settings:

```html
<link rel="stylesheet" href="reva.min.css">
<link rel="stylesheet" href="reva.glass.css">

<article class="card" data-material="glass">
  <h2>A different atmosphere.</h2>
  <p>The same markup and shared design settings.</p>
</article>
```

Complete, scoped, and modular builds are available in [`dist/`](https://github.com/eristavi/RevaCSS/tree/v1.2.1/dist). Fonts load separately through `reva-fonts.css`; copy `dist/fonts/` alongside it. The [stylesheet reference](https://eristavi.github.io/RevaCSS/reference/) explains dependencies and extension choices.

Version 1.1 adds [modern CSS patterns](https://eristavi.github.io/RevaCSS/guide/modern-css/): viewport-safe overlays, `.card-grid` with container-responsive actions and subgrid, and a native `.gallery` with proximity scroll snapping. Card grids and galleries are included in the complete core and scoped core, with individual modular files available.

Scroll-driven card entrances are opt-in through `reva.scroll-motion.css` (or `reva.scroll-motion.scoped.css`) and inherited `data-motion="expressive"`. Cross-document same-origin transitions are opt-in through `reva.transitions.css` on both pages; this document-level extension has no scoped variant. Unsupported enhancements retain static content or ordinary navigation. Reduced-motion preferences take priority.

Version 1.1 also adds motion-aware native scrolling and a labelled `.scroll-top` link. `none` disables smoothing, `subtle` uses browser-native smooth navigation, and `expressive` adds a brief fragment highlight. The optional motion module now supports dialogs, edge-directed drawers and discrete exits. See [motion](https://eristavi.github.io/RevaCSS/guide/motion/) and [state feedback](https://eristavi.github.io/RevaCSS/guide/effects/) for dependencies and limitations.

## Project status

**RevaCSS 1.2.1 — Erisian** adds six palettes, independent button materials, sticky navbar controls and a shared documentation/demo customizer. Download the compiled CSS, optional extensions, icons, font, and starter HTML from the [release page](https://github.com/eristavi/RevaCSS/releases/tag/v1.2.1). Archives include licenses; a separate SHA-256 checksum file verifies the downloads.

Automated validation and known limits are recorded in the [release notes](https://github.com/eristavi/RevaCSS/blob/v1.2.1/RELEASE_NOTES.md) and [validation record](https://github.com/eristavi/RevaCSS/blob/v1.2.1/quality/releases/v1.2.1.md). The maintainer reports all six manual checks passed. The validation record distinguishes that sign-off from automated results and documents missing device/version evidence. This is not accessibility certification.

The current implementation targets modern browsers. Native popover patterns require browser support; individual enhancements document their fallbacks. Accessibility also depends on your markup and application behavior. See the [behavior and accessibility guide](https://eristavi.github.io/RevaCSS/guide/accessibility/).

[Specification](https://github.com/eristavi/RevaCSS/blob/v1.2.1/SPECIFICATION.md) · [Implementation record](https://github.com/eristavi/RevaCSS/blob/v1.2.1/IMPLEMENTATION.md) · [Component quality standard](https://github.com/eristavi/RevaCSS/blob/v1.2.1/QUALITY_STANDARD.md)

## Develop and validate

Clone the repository for development; the release archives contain compiled assets. Use Node 22.12 or newer; Node 24 is recommended. Python 3 is required for the browser-test server.

```sh
npm ci
npm run dev
```

<details>
<summary>Build and run the automated checks</summary>

```sh
npm run clean
npm run build
npm test
npx playwright install --with-deps chromium firefox webkit
npm run test:browser
npm run test:package
npm run test:package:browser
npm run check:release-quality
```

Unit checks cover tokens, contrast pairs, output budgets, documentation, and runtime boundaries. Browser tests run against the built documentation in Chromium, Firefox, and WebKit. The release-quality command reports remaining blockers separately; automated checks do not replace manual accessibility and real-device review.

After building, run `npm run release:package` to reproduce the GitHub downloads in `artifacts/`, including the starter page, licenses, and SHA-256 checksum file.

The npm package workflow validates a clean tarball installation and retains a candidate archive for review. `npm pack --pack-destination artifacts` creates the same kind of local candidate; the existing quality gate still applies to publication.

GitHub Pages builds and deploys documentation from `main`. The three-engine validation workflow can be run manually. Release publication also requires the complete automated suite, installed-package checks and quality gates. `REVA_SITE` and `REVA_BASE` configure the documentation origin and path.

Optional sticky navigation uses `data-navbar-position="sticky"`, independently of navbar layout and material. Place menus in a `.navbar-header` wrapper alongside page content; standalone menus and app-shell headers are also supported. Set `--re-navbar-height` for custom header clearance. Use `data-navbar-spacing="flush"` and `data-navbar-width="full"` for a header at the safe top edge with page-aligned contents. See [sticky headers](https://eristavi.github.io/RevaCSS/components/top-menu/#navbar-position).

Astro builds the documentation. An optional shared customizer remembers one appearance profile across documentation and demo pages and prepares demo downloads; the RevaCSS framework itself has no JavaScript runtime.

</details>

## License

RevaCSS is [MIT licensed](https://github.com/eristavi/RevaCSS/blob/v1.2.1/LICENSE). The bundled Manrope font retains its [SIL Open Font License](https://github.com/eristavi/RevaCSS/blob/v1.2.1/dist/fonts/OFL.txt).

## Versioning

RevaCSS follows [semantic versioning](VERSIONING.md): fixes and compatible visual tweaks use patch releases; new components, classes, materials and configuration options use minor releases; breaking changes use major releases. Versions are bumped once per published release, with changes recorded in [the changelog](CHANGELOG.md).

## Unreleased source improvements

The source/documentation preview adds opt-in container-responsive layouts, RTL disclosure refinements, improved form/native-control states, accessible hidden labels and print utilities. See [usage and availability](https://eristavi.github.io/RevaCSS/guide/responsive-rtl-print/) and `CHANGELOG.md`.

These changes are not yet in the published 1.2.1 archives or npm package. Their tests are deferred by maintainer request; successful compilation is not browser or accessibility validation.
