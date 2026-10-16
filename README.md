# RevaCSS

**Start with HTML. Set your defaults once.**

A CSS framework for building consistent interfaces with native HTML, shared appearance settings and a small set of structural classes. Choose a theme, palette, shape and spacing on a page or section, then refine individual components where needed.

[Documentation](https://eristavi.github.io/RevaCSS/) · [Quick start](#quick-start) · [Live demos](#live-demos) · [Framework comparison](https://eristavi.github.io/RevaCSS/guide/comparison/) · [AI guide](AI.md)

**Latest GitHub release: 2.0.0 · Erisian** · [Download](https://github.com/eristavi/RevaCSS/releases/tag/v2.0.0) · [MIT license](LICENSE)

**RevaCSS 2.0.0 is available on GitHub.** This major release removes twelve previously shipped palette values; read the [migration guide](MIGRATION.md) before upgrading. The [release validation record](quality/releases/v2.0.0.md) contains the completed automated checks, maintainer manual acceptance and scoped Nuxt dependency review. npm availability is recorded separately in [NPM.md](NPM.md).

[![One RevaCSS card in light, dark, glass and veil treatments.](https://raw.githubusercontent.com/eristavi/RevaCSS/main/.github/assets/revacss-preview.png)](https://eristavi.github.io/RevaCSS/demos/marketing/)

## Why RevaCSS?

- **Shared design decisions.** Set appearance defaults on a parent instead of repeating them on every component. Local overrides change only the settings you choose.
- **HTML and CSS first.** Native controls, disclosures and popovers provide browser behaviour. The framework core has no JavaScript runtime; compiled CSS works without a build step.
- **Customise with ordinary CSS.** Design tokens, custom properties, cascade layers and low-specificity selectors leave room for your own styles.
- **A coordinated visual system.** Light, dark and system themes, Default and Mono palettes in 2.0.0, your own custom colours, shared sizing and spacing, plus optional surface and button materials.

Appearance inheritance is implemented through CSS rules and custom properties; HTML data attributes do not inherit by themselves. RevaCSS works with static HTML, server-rendered templates and frameworks that render HTML.

## Quick start

Download the [compiled stylesheet](https://github.com/eristavi/RevaCSS/releases/download/v2.0.0/reva-2.0.0.min.css), save it as `reva.min.css` beside your HTML, and link it:

```html
<!doctype html>
<html lang="en" data-theme="auto" data-palette="default" data-shape="rounded">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My RevaCSS page</title>
    <link rel="stylesheet" href="reva.min.css">
  </head>
  <body>
    <main class="container">
      <article class="card">
        <h1>Start with your next idea.</h1>
        <p>Native HTML, with a consistent appearance.</p>
        <a class="button" href="https://eristavi.github.io/RevaCSS/guide/">
          Explore the guide
        </a>
      </article>
    </main>
  </body>
</html>
```

Native elements receive shared defaults. Classes such as `.card`, `.container`, `.grid` and `.stack` identify reusable structures.

For starter HTML, optional stylesheets, icons, the bundled font and separate framework adapter archives, download the [complete 2.0.0 release](https://github.com/eristavi/RevaCSS/releases/tag/v2.0.0). See [installation options](https://eristavi.github.io/RevaCSS/guide/) and the [npm guide](NPM.md) for separately verified registry/CDN availability.

## Configure once, refine locally

Place shared settings on `<html>` or a section. A local setting changes that choice while the remaining appearance settings continue to inherit through the CSS system.

```html
<section data-theme="dark" data-palette="default" data-size="large">
  <button type="button">Save changes</button>
  <button type="button" class="secondary" data-size="small">Back</button>
</section>
```

These example buttons demonstrate appearance. Connect application actions to your own handlers or use a real form destination.

The choices below describe 2.0.0; published 1.2.1 archives retain their original palette set.

| Attribute | Supported choices |
| --- | --- |
| `data-theme` | `auto`, `light`, `dark` |
| `data-palette` | `default`, `mono` |
| `data-font` | `manrope` (default), `system` |
| `data-shape` | `square`, `subtle`, `rounded`, `pill`, `custom` |
| `data-density` | `compact`, `comfortable`, `spacious`, `custom` |
| `data-size` | `small`, `medium`, `large` |
| `data-motion` | `none`, `subtle`, `expressive` |

Browse the [attribute reference](https://eristavi.github.io/RevaCSS/attributes/), [inheritance guide](https://eristavi.github.io/RevaCSS/guide/styling/) and [public CSS tokens](https://eristavi.github.io/RevaCSS/reference/tokens/).

Choose `data-font="system"` for the device UI font or `data-font="manrope"` to restore the framework default locally. Text, headings and native controls inherit the choice; code remains monospace. Load the optional `reva-fonts.css` with its adjacent `fonts/` assets to provide Manrope; when that family is unavailable, the system fallback is used. System works even when that font stylesheet is loaded. The documentation/demo customizer offers exactly Default (Manrope) and System and includes the selected attribute in downloaded HTML. The existing `--re-font-heading` token remains available for an independent heading font.

Only Default and Mono are built into 2.0.0. Define a custom palette with CSS tokens for your own colours. The other experimental palettes have been removed in 2.0.0; replace their `data-palette` values with `default`, `mono` or your own CSS palette before upgrading. Published 1.2.1 archives remain unchanged.

Veil is deprecated for both surfaces and buttons. Its global/scoped stylesheets and attribute values remain available for existing sites; prefer Solid, Glass or Soft UI for new work.

### Choose your own corners

Choose **Customize → Surfaces → Shape → Custom** to set surface, field and action radiuses. Link the values or adjust each independently with a slider or numeric entry. Settings persist across pages; export ordinary CSS or download starting HTML with your values. The framework adds no JavaScript runtime.

```css
@layer re.tokens {
  :where([data-shape="custom"]) {
    --re-custom-surface-radius: 1rem;
    --re-custom-field-radius: .4rem;
    --re-custom-action-radius: 3rem;
  }
}
```

Use `data-shape="custom"` on your page or a parent. Existing Square, Subtle, Rounded and Pill presets remain available and reset the three groups locally.

### Choose your own spacing

Choose **Customize → Layout → Density → Custom** for linked or independent surface padding, control padding and content spacing. Surface padding and content spacing use rem; control padding is a multiplier of the existing comfortable padding. Cards scale base surface padding by 1.5. Minimum control heights remain in place. Choices persist across pages and are included in CSS/HTML exports.

```css
@layer re.tokens {
  :where([data-density="custom"]) {
    --re-custom-surface-padding: 1.2rem;
    --re-custom-control-density: .8;
    --re-custom-content-space: .6rem;
  }
}
```

Use `data-density="custom"` on your page or a parent. Compact, Comfortable and Spacious reset all three groups locally. Layout Gap remains a separate setting that scales layout gaps.

### Choose your page width

Choose **Customize → Layout → Page width**: Narrow, Standard, Wide, Full or Custom. Full fills the parent and retains 1rem side padding. Custom sets a maximum width (including padding) and side padding in rem, with saved choices and CSS/HTML export. Padding is reduced in narrow parents to preserve content space. Navbar width remains independent.

```css
@layer re.tokens {
  :where([data-width="custom"]) {
    --re-custom-max-width: 80rem;
    --re-custom-side-padding: 2rem;
  }
}
```

Use `data-width="full"` or `data-width="custom"` on your page or a parent of `.container`. Nested width presets reset width and padding; content inside a container can still have its own reading-width limit.

### Planned personalized build

A future generator will export one framework stylesheet containing the user’s chosen colours and radiuses directly, replacing unused built-in colour definitions. Full colour editing will include surfaces, text, links, borders, semantic roles, gradients, focus indicators, material highlights, shadows and decorative edges, with contrast feedback. This generator is planned; current exports remain separate CSS configuration or starting HTML with embedded configuration.

### Add your own components

Use native HTML and documented tokens, and extend an existing surface such as `.card` when it fits. Custom components can inherit light/dark/system mode, palettes and shared geometry; supported materials apply through documented hooks. Read the [extension contract](CUSTOM_COMPONENTS.md) or the [online guide and downloadable starter](https://eristavi.github.io/RevaCSS/guide/custom-components/). The HTML/CSS-only example lives in [examples/custom-components.html](examples/custom-components.html), with [its application stylesheet](examples/custom-components.css). Component data, actions and saved user preferences belong to your application.

## Components and extensions

The core includes forms and actions, cards and layouts, navigation and disclosures, tables, status indicators and content patterns. Shared settings apply to supported components without a separate styling vocabulary for each one.

| Area | Included patterns |
| --- | --- |
| Forms and actions | Native fields, form/input groups, buttons, switches, ratings and action groups |
| Navigation | Top menus, sidebars, app shells, drawers, dropdowns, breadcrumbs, pagination and steps |
| Content | Cards, card grids, lists, metrics, timelines, calendars, message threads and avatars |
| Feedback | Alerts, badges, progress/meter, loading indicators, skeletons and empty states |
| Media | Responsive images, SVG chart patterns and native scroll-snap galleries |

See the [component API](https://eristavi.github.io/RevaCSS/reference/components/) for markup, dependencies and behaviour boundaries.

Optional stylesheets add [Glass](https://eristavi.github.io/RevaCSS/themes/glass/), [Veil (deprecated)](https://eristavi.github.io/RevaCSS/themes/veil/), [Soft UI](https://eristavi.github.io/RevaCSS/themes/soft/), [button materials](https://eristavi.github.io/RevaCSS/themes/button-materials/), [motion](https://eristavi.github.io/RevaCSS/guide/motion/) and [enhanced native selects](https://eristavi.github.io/RevaCSS/components/selects/). Load an extension after the matching core:

```html
<link rel="stylesheet" href="reva.min.css">
<link rel="stylesheet" href="reva.glass.css">

<article class="card" data-material="glass">
  <h2>A different surface.</h2>
  <p>The same HTML and shared settings.</p>
</article>
```

Complete, minified, scoped and modular builds are available. Use `reva.scoped.css` inside a `.reva` boundary when integrating with an existing site, and use matching scoped extensions. Fonts and [SVG icons](https://eristavi.github.io/RevaCSS/icons/) are separate assets. The [stylesheet reference](https://eristavi.github.io/RevaCSS/reference/) explains file choices and dependencies.

## Live demos

Explore complete websites, change their appearance with the customizer and download the starting HTML.

| Demo | What you can explore |
| --- | --- |
| [Forma · Marketing](https://eristavi.github.io/RevaCSS/demos/marketing/) | Navigation, features, pricing, FAQ and a contact layout |
| [Workspace · Dashboard](https://eristavi.github.io/RevaCSS/demos/dashboard/) | App shell, metrics, SVG charts and activity history |
| [Fieldnotes · Journal](https://eristavi.github.io/RevaCSS/demos/blog/) | Articles, archives, categories and author profiles |
| [Still · Shop](https://eristavi.github.io/RevaCSS/demos/shop/) | Catalogue, product pages, galleries and a sample bag |
| [Effects Lab · Experimental](https://eristavi.github.io/RevaCSS/demos/effects-lab/) | CSS Aura, Spring lift and Layered depth, with JavaScript-free SVG card taps |

Effects Lab contains candidates for a future release, with draft classes and separate demo stylesheets. It does not add a released effects API or commit these prototypes to the next version. Browser, device and accessibility acceptance checks remain deferred.

Demos use sample content. Your application supplies form processing, commerce, routing and live data. The optional demo customizer uses JavaScript to remember settings and prepare downloads; the CSS core remains independent of it.

Choose **Customize → Colours → Palette → Custom** to create light and dark palettes, derive supporting shades, refine every colour token and see contrast feedback. Export the palette as ordinary CSS or download starting HTML with your colours included. See [custom palette documentation](https://eristavi.github.io/RevaCSS/themes/palettes/#custom) for reusable named palettes without JavaScript.

## Svelte integration

The optional [Svelte adapter](https://github.com/eristavi/RevaCSS/tree/main/integrations/svelte) provides typed native components, Svelte 5 value/element bindings and [plain Svelte](https://github.com/eristavi/RevaCSS/tree/main/examples/svelte)/[SvelteKit](https://github.com/eristavi/RevaCSS/tree/main/examples/sveltekit) examples. Its stable 2.0.0 archive is included in the GitHub release; npm availability is separate. SvelteKit production builds and live server rendering are checked; core CSS stays unchanged. The requested three-engine browser fixtures passed; see the [validation record](quality/releases/v2.0.0.md) for tested scope and revisions.

## React integration

The optional [React adapter](https://github.com/eristavi/RevaCSS/tree/main/integrations/react) provides typed native components, React 19 ref props, form associations and [React](https://github.com/eristavi/RevaCSS/tree/main/examples/react)/[Next.js](https://github.com/eristavi/RevaCSS/tree/main/examples/next) examples. Its separate stable 2.0.0 archive is included in the GitHub release; npm availability is separate. Static wrappers need no client boundary or hooks; application interactivity belongs to the consuming app. Core CSS stays independent; the React browser fixtures passed in all three engines, with scope recorded in the [validation record](quality/releases/v2.0.0.md).

## Vue integration

The optional [Vue adapter](https://github.com/eristavi/RevaCSS/tree/main/integrations/vue) provides typed native components, Vue model bindings, labelled form controls and a [reference application](https://github.com/eristavi/RevaCSS/tree/main/examples/vue). Its separate stable 2.0.0 archive is included in the GitHub release; npm availability is separate. Vue supplies application reactivity; RevaCSS core stays CSS-only. A [Nuxt reference](https://github.com/eristavi/RevaCSS/tree/main/examples/nuxt) covers production builds and live server rendering. The requested Vue/Nuxt browser fixtures passed in all three engines. The [Nuxt dependency review](https://github.com/eristavi/RevaCSS/blob/main/examples/nuxt/DEPENDENCY_REVIEW.md) records unresolved build/dev advisories and the reviewed production boundary.

## Astro integration

The optional [Astro adapter](https://github.com/eristavi/RevaCSS/tree/main/integrations/astro) provides typed native components, accessible field associations and a [reference application](https://github.com/eristavi/RevaCSS/tree/main/examples/astro). Its separate stable 2.0.0 archive is included in the GitHub release with no browser JavaScript; npm availability is separate. Core CSS stays independent; packed Astro browser fixtures passed in all three engines, with scope recorded in the [validation record](quality/releases/v2.0.0.md).

## Laravel integration

An optional [Laravel adapter](https://github.com/eristavi/RevaCSS/tree/main/integrations/laravel) and [runnable reference application](https://github.com/eristavi/RevaCSS/tree/main/examples/laravel) are included in version 2. They provide Blade components, native form/validation handling, versioned assets, application appearance settings, pagination, Livewire examples and Boost guidance. The CSS core stays independent. The stable Composer ZIP is available in the GitHub release without claiming a Packagist registration; all four Laravel/Livewire automated combinations passed. Core manual acceptance does not establish a separate device review of this reference application. Laravel source lives in the repository and is distributed separately from the npm CSS package.

## AI-assisted development and vibe coding

Readable HTML and documented appearance settings give coding assistants clear patterns to follow. You can describe a layout, generate a starting point, then refine it through shared settings and ordinary CSS.

Give your assistant the relevant references for the release or source build you use:

- [AI.md](AI.md): framework conventions, starter HTML and application responsibilities.
- [Documentation index](https://eristavi.github.io/RevaCSS/llms.txt): links to focused Markdown references.
- [Structured API](https://eristavi.github.io/RevaCSS/ai/api.json): supported values, component contracts and examples.
- [HTML editor custom data](https://eristavi.github.io/RevaCSS/ai/html-custom-data.json): attribute descriptions and completion values.

The online references regenerate from the documentation manifests and examples. They include source-preview availability notes where features are unreleased. Providing this context helps an assistant use the intended API; review generated markup and behaviour as you would any other code.

## Why I started this project

> I started RevaCSS because I wanted consistent interfaces without repeating the same design decisions across every component. My aim is to keep HTML readable, use the browser’s native capabilities, and let components share appearance settings that are easy to understand and customise.

— **Revaz Eristavi**, founder of RevaCSS

Read the [full founder’s note](https://eristavi.github.io/RevaCSS/guide/why-revacss/) or [compare RevaCSS with other frameworks](https://eristavi.github.io/RevaCSS/guide/comparison/).

## Release and source status

| Distribution | Status |
| --- | --- |
| **Published 1.2.1 · Erisian** | Compiled CSS and complete archives are available from the [GitHub release](https://github.com/eristavi/RevaCSS/releases/tag/v1.2.1). |
| **Current `main` and documentation preview** | Includes unreleased custom shape/density/page-width settings, custom-palette tools, Default/Mono palette consolidation, Veil deprecation, responsive wrappers, RTL refinements, form/native-control improvements, accessibility and print utilities, and the iOS date/time sizing fix. Source-preview additions have not completed release validation. |

Published archives remain unchanged. See the [new features and availability guide](https://eristavi.github.io/RevaCSS/guide/responsive-rtl-print/) and [changelog](CHANGELOG.md) before using source-preview additions with a released package.

RevaCSS targets modern browsers. Native popovers require browser support; optional enhancements document their fallbacks. Accessible results also depend on your HTML and application behaviour. See [behaviour and accessibility](https://eristavi.github.io/RevaCSS/guide/accessibility/) and the [published release’s validation record](https://github.com/eristavi/RevaCSS/blob/v1.2.1/quality/releases/v1.2.1.md) for recorded coverage and known limits.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for source locations, generated documentation, focused verification and release evidence. Coding agents should start with [AGENTS.md](AGENTS.md).

For documentation or framework development, clone the repository and use Node 22.12 or newer; Node 24 is recommended.

```sh
git clone https://github.com/eristavi/RevaCSS.git
cd RevaCSS
npm ci
npm run dev
```

`npm run build` generates compiled CSS, AI references and the Astro documentation. GitHub Pages deploys from `main`. For a bug report, include the browser/device, the stylesheet version, relevant HTML and a screenshot or reproduction where possible.

The documentation build also generates [the sitemap index](https://revacss.eristavi.org/sitemap-index.xml) and [robots.txt](https://revacss.eristavi.org/robots.txt). New Astro pages and standalone launch pages are discovered automatically; isolated previews, source/starter downloads and duplicate marketing configurations are excluded from the sitemap. `REVA_SITE` and `REVA_BASE` override the public origin and deployment path for other hosts or project-path builds.

<details>
<summary>Validation and release commands</summary>

Run these when validation is requested. Python 3 is required for the browser-test server.

```sh
npm run build
npm test
npx playwright install --with-deps chromium firefox webkit
npm run test:browser
npm run test:package
npm run test:package:browser
npm run check:release-quality
```

Checks cover source contracts, generated output, installed packages and browser behaviour. Manual accessibility and real-device review remain separate requirements. Current source additions have not completed this validation.

After building, `npm run release:package` creates release archives in `artifacts/`. Package publication retains its existing quality gates.

See the [component quality standard](QUALITY_STANDARD.md), [specification](SPECIFICATION.md), [implementation record](IMPLEMENTATION.md) and [versioning policy](VERSIONING.md). Record user-visible changes in the changelog and bump the version once per published release.

</details>

## License

RevaCSS is [MIT licensed](LICENSE). The bundled Manrope font uses the [SIL Open Font License](https://github.com/eristavi/RevaCSS/blob/main/assets/fonts/OFL.txt).
