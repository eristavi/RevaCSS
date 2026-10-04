# RevaCSS

**Start with HTML. Set your defaults once.**

Build consistent interfaces from native HTML. Choose your theme, palette, shape, and spacing on a parent; components inherit the design, and local settings handle the exceptions.

[Documentation](https://eristavi.github.io/RevaCSS/) · [Live demos](#see-it-in-action) · [Get started](#start-with-html) · [API reference](https://eristavi.github.io/RevaCSS/reference/)

**Development preview · 0.1.0-alpha.1** · [Release status](#project-status) · [MIT](LICENSE)

[![The same RevaCSS project card rendered in Light, Dark, Glass, and Veil, using shared design settings.](.github/assets/revacss-preview.png)](https://eristavi.github.io/RevaCSS/demos/marketing/)

## Why RevaCSS

- **A shared design, with fewer repeated decisions.** Set page or section defaults with inherited `data-*` attributes. Override individual settings where you need them.
- **Native elements and interactions.** Buttons, forms, details, radio choices, and popovers keep their browser behavior. The framework requires no JavaScript runtime.
- **Room for your own design.** Tokens, CSS custom properties, low-specificity selectors, and cascade layers make ordinary CSS overrides practical.
- **Appearance that adapts.** Light, dark, and system themes; eight coordinated palettes; optional Glass and Veil materials; support for user preferences.
- **A compact foundation.** The complete minified core has an enforced 15 KiB gzip budget. Fonts, icons, and optional extensions are separate assets.

Use RevaCSS with static pages, server-rendered templates, or a framework that renders HTML. Your application owns its data, routing, and business actions.

## See it in action

Explore complete layouts, change their appearance, and download the starting HTML.

| Demo | Explore |
| --- | --- |
| [Forma · Marketing website](https://eristavi.github.io/RevaCSS/demos/marketing/) | Responsive navigation, features, pricing, FAQ, and a contact form. |
| [Workspace · Dashboard](https://eristavi.github.io/RevaCSS/demos/dashboard/) | An application shell, metric cards, SVG charts, and activity history. |
| [Fieldnotes · Journal](https://eristavi.github.io/RevaCSS/demos/blog/) | Articles, archives, category pages, and author profiles. |
| [Still · Shop](https://eristavi.github.io/RevaCSS/demos/shop/) | A catalogue, product pages, native radio galleries, and a sample bag. |

The demos use sample content. Commerce, form processing, and live application data come from your backend.

## Start with HTML

Download [reva.min.css](https://raw.githubusercontent.com/eristavi/RevaCSS/main/dist/reva.min.css), place it beside your HTML, and link it in the page:

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
| [Palettes](https://eristavi.github.io/RevaCSS/themes/palettes/) | Eight coordinated color families across light, dark, and system themes. |
| [Glass](https://eristavi.github.io/RevaCSS/themes/glass/) | Frosted surfaces, backdrop blur, and shared appearance settings. |
| [Veil](https://eristavi.github.io/RevaCSS/themes/veil/) | Diffused perimeter color and inset contours without backdrop blur. |
| [Motion](https://eristavi.github.io/RevaCSS/guide/motion/) | Optional native-popover entrances that follow the shared motion setting. |
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

Complete, scoped, and modular builds are available in [`dist/`](dist/). Fonts load separately through `reva-fonts.css`; copy `dist/fonts/` alongside it. The [stylesheet reference](https://eristavi.github.io/RevaCSS/reference/) explains dependencies and extension choices.

## Project status

RevaCSS is a development preview at `0.1.0-alpha.1`. npm publication remains on hold until the agreed component scope and automated, manual accessibility, and real-device checks are complete. The package remains private.

The current implementation targets modern browsers. Native popover patterns require browser support; individual enhancements document their fallbacks. Accessibility also depends on your markup and application behavior. See the [behavior and accessibility guide](https://eristavi.github.io/RevaCSS/guide/accessibility/).

[Specification](SPECIFICATION.md) · [Implementation record](IMPLEMENTATION.md) · [Component quality standard](QUALITY_STANDARD.md)

## Develop and validate

Use Node 22.12 or newer; Node 24 is recommended. Python 3 is required for the browser-test server.

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
npm run check:release-quality
```

Unit checks cover tokens, contrast pairs, output budgets, documentation, and runtime boundaries. Browser tests run against the built documentation in Chromium, Firefox, and WebKit. The release-quality command reports remaining blockers separately; automated checks do not replace manual accessibility and real-device review.

GitHub Pages builds and deploys documentation from `main`. The three-engine validation workflow is run manually. `REVA_SITE` and `REVA_BASE` configure the documentation origin and path.

Astro builds the documentation. An optional documentation settings helper remembers appearance choices and prepares demo downloads; the RevaCSS framework itself has no JavaScript runtime.

</details>

## License

RevaCSS is [MIT licensed](LICENSE). The bundled Manrope font retains its [SIL Open Font License](dist/fonts/OFL.txt).
