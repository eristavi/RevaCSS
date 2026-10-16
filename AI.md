# Using RevaCSS with AI

RevaCSS is an HTML/CSS-first framework with a zero-JavaScript core. Use native HTML, a small set of documented component classes and inherited data attributes. Start with working markup and adapt it to the project.

This guide is for people building with an AI assistant and for agents given this file as project context. Follow the user's instructions and the project's existing workflow. This file describes RevaCSS usage; it does not authorize publishing, installing tools or running tests.

## Give your assistant the right context

Tell your assistant to use RevaCSS explicitly. Give it the current documentation index at `/llms.txt` under the documentation site's base path, then the relevant Markdown reference pages listed there. For GitHub Pages, that base path is `/RevaCSS/`.

The generated `/ai/api.json` contains the package version, exact supported attribute values, component contracts and HTML examples. `/ai/html-custom-data.json` provides attribute descriptions and value suggestions for compatible HTML editors. `/llms-full.txt` combines the guide and generated reference; it is large, so prefer individual pages when only one component is needed.

Use the version shown in the reference. Consult the getting-started guide for a published download or npm package. Do not assume the newest source version is already available on npm, invent a CDN URL or mix files from different releases.

## Select the version before using the API

Establish what the application actually loads before selecting attributes, copying component markup or recommending an installation command.

### 1. Identify the installed files

| Installation | Evidence to inspect |
| --- | --- |
| npm or another JavaScript package manager | The resolved `revacss` version in the lockfile and installed `node_modules/revacss/package.json`; inspect installed adapter versions separately. A range in the application's `package.json` is not the resolved version. |
| Downloaded GitHub archive | The exact release tag and archive metadata/checksums, then the stylesheet paths the application loads. A renamed `reva.css` filename alone does not identify a version. |
| CDN | The actual stylesheet URL in the page or built output. Use an explicit verified version; an unversioned URL or `latest` alias can change. |
| Repository checkout or local package | The checkout's `package.json`, commit and local changes, plus the source of the assets loaded by the application. The version number can stay unchanged between source commits. |
| Laravel Composer adapter | The resolved `revacss/laravel` entry in `composer.lock` and installed package metadata, plus its asset manifest and published assets. A source `composer.json` may legitimately omit its version. |

When shell access is available, these read-only commands can help identify an npm installation, a Composer installation or a repository checkout:

```sh
npm ls revacss --depth=0
composer show revacss/laravel
git rev-parse HEAD
git status --short
```

Run only commands relevant to the project. A missing package is useful evidence; it is not a reason to install or upgrade it automatically. Check the application's actual CSS imports or link elements as well: an installed package does not prove its files are being used. A failed lookup does not establish a version.

### 2. Match the reference to that installation

For a released distribution, use the documentation included with that package/archive or the repository at its exact release tag. For example, `v2.0.0` identifies the 2.0.0 release sources, while `main` can contain later changes. Read the matching adapter README and dependency requirements too; core and adapter version numbers alone do not establish compatibility.

For a source build, use the same checkout's manifests and examples. Record the commit and relevant local changes. The checkout can generate focused AI references through the documented build workflow when that work is authorized.

Compare the generated API's `version` and `sourceStatus` with the installation. The version alone cannot distinguish two source revisions. The live documentation is updated between releases and is not a permanent snapshot of an older installation. If its revision or feature availability differs, consult the tagged/source documentation instead of assuming that feature exists.

### 3. Verify the distribution channel separately

| Question | Evidence needed |
| --- | --- |
| Is the version downloadable from GitHub? | Its published release and the specific required asset. |
| Is the core or an adapter available from npm? | The exact package name and version in that registry, with the documented entry points. Each adapter is a separate package. |
| Is the Laravel adapter available through Packagist or another Composer source? | That package's registration/version or the explicitly configured artifact/VCS installation method. A GitHub ZIP alone does not establish Packagist availability. |
| Can this CDN serve the selected version and stylesheet? | Availability of that exact package version and file through the chosen CDN. A source manifest does not prove that URL exists. |

The installation guide and npm guide record distribution details. Generated `npmPublished` and `releasePublished` fields describe the documentation build's recorded availability; they are not live registry queries, per-adapter publication status or automatic discovery of newly published packages.

### 4. Resolve differences before generating code

- **An older installation and newer documentation:** stay within the installed API and use its matching reference. Offer an upgrade as a separate change when the requested feature needs it.
- **A desired version available only through another channel:** explain the verified installation option and its dependencies. Follow the project's instructions before changing how dependencies are obtained.
- **Mixed core, extensions or published adapter assets:** identify their origins and align them with the selected compatible distribution. Do not patch around mismatched files by inventing attributes.
- **An unknown version or unavailable matching reference:** inspect package metadata, release records and file provenance first. If the version remains unknown, state that uncertainty and request the missing source or version before relying on version-specific features.
- **An approved upgrade:** read the migration guide for the target release, update matching assets and follow the project's validation workflow. Preserve the existing installation until that change is authorized.

Summarize the selection when it matters: core version (and commit for source builds), reference tag/revision, adapter version if used, asset origin and any unresolved mismatch. Keep this record in the implementation summary so the application's users are not asked to make repository or package-management decisions.

## Quick decision guide

Choose the build, markup approach and extensions before generating a page. Use the matching release's files and component reference for each choice.

### 1. Choose a CSS build

| Project situation | Choose | Required setup |
| --- | --- | --- |
| A new page or application using RevaCSS throughout | `reva.css` or `reva.min.css` | Load one complete global stylesheet. Both contain the same core API. |
| Part of an existing site should use RevaCSS | `reva.scoped.css` | Put RevaCSS content inside a `.reva` boundary; configure shared settings on that boundary or inside it. |
| An intentionally maintained custom CSS subset | Documented modules | Load token and base dependencies, the required component modules and shared preference utilities. Read each component contract before selecting files. |

Default to a complete build unless the project has a specific reason to maintain a modular subset. Load exactly one complete build. The scoped build limits selector matching; it does not provide Shadow DOM isolation. Inherited styles can cross boundaries, and popover/dialog markup must remain inside its RevaCSS boundary.

### 2. Choose native HTML or an adapter

| Application | Starting point |
| --- | --- |
| Static HTML, PHP templates or another server-rendered system | Native HTML with the documented RevaCSS hooks. |
| Astro, React, Vue, Svelte or Laravel | Native markup in the framework's template syntax, or the matching optional adapter when its components help the project. Read that adapter's README before using its API. |
| Next.js, Nuxt or SvelteKit | React, Vue or Svelte guidance respectively, plus the matching reference application. Preserve the framework's server/client boundaries. |

Adapters are optional wrappers around the existing HTML/CSS contract. They do not replace the core stylesheet or supply application routing, authentication, data loading or form processing. Match the adapter's documented core dependency and asset setup; installing an adapter does not establish that the page has loaded its CSS.

### 3. Select only the extensions the design needs

Load CSS extensions after the matching complete core. With the scoped build, choose the `.scoped.css` extension listed below.

| Needed appearance or behaviour | Global extension | Scoped extension / setup |
| --- | --- | --- |
| Standard solid appearance and core native components | None | The complete scoped core is sufficient. |
| Glass on supported surfaces and actions | `reva.glass.css` | `reva.glass.scoped.css`; use documented `data-material="glass"` targets. |
| Soft UI on supported surfaces and actions | `reva.soft.css` | `reva.soft.scoped.css`; use documented `data-material="soft"` targets. |
| A material choice for actions independent of surrounding surfaces, including Liquid | `reva.button-materials.css` | `reva.button-materials.scoped.css`; use `data-button-material` with a supported value. |
| Opening/closing motion for native popovers and dialogs | `reva.motion.css` | `reva.motion.scoped.css`; preserve native state and reduced-motion fallbacks. |
| Progressive enhancement of eligible native selects | `reva.selects.css` | `reva.selects.scoped.css`; ordinary native selects remain the fallback. |
| Bundled Manrope font | `reva-fonts.css` with its adjacent `fonts/` directory | Use the same optional font asset setup; there is no separate scoped font stylesheet. |
| Existing Veil styling that must be retained | `reva.veil.css` | `reva.veil.scoped.css`; Veil is deprecated for new interfaces. |

A material attribute alone does not load an extension. Surface materials and independent button materials are separate choices; a Glass surface with Liquid actions needs both the Glass and button-material extensions. Core disclosures already include their documented motion; the overlay motion extension is an additional choice for popovers/dialogs.

For example, this is a scoped Glass setup using files from one matching distribution:

```html
<link rel="stylesheet" href="dist/reva.scoped.css">
<link rel="stylesheet" href="dist/reva.glass.scoped.css">

<div class="reva" data-theme="auto" data-palette="default">
  <article class="card" data-material="glass">
    <h2>Project overview</h2>
    <p>This card uses the scoped core and its matching Glass extension.</p>
  </article>
</div>
```

Before writing the full interface, identify the selected core file, boundary (if scoped), markup approach, extensions and application behaviours to connect. Then consult the relevant component pages. The generated `/ai/files.md` reference lists stylesheet entry points; the human stylesheet reference explains their dependencies.

## Start with a complete page

Download the compiled starter from the release linked in the getting-started guide. Put this document beside its `dist` directory. The generated global stylesheet works without a package manager or CSS build step.

```html
<!doctype html>
<html lang="en" data-theme="auto" data-palette="default">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My RevaCSS project</title>
    <link rel="stylesheet" href="dist/reva.css">
  </head>
  <body>
    <main class="container">
      <h1>Your projects</h1>
      <article class="card">
        <h2>First project</h2>
        <p>A clear starting point for your work.</p>
        <form action="/projects" method="post">
          <div class="form-group">
            <label for="project-name">Project name</label>
            <input id="project-name" name="name" required>
          </div>
          <button type="submit">Create project</button>
        </form>
      </article>
    </main>
  </body>
</html>
```

The form destination above is a placeholder: replace it with your application's real endpoint. RevaCSS styles the form; your application handles saving the project.

## Configure shared defaults

For an application-defined component, read the [custom-component guide](https://eristavi.github.io/RevaCSS/guide/custom-components/) or the generated `/ai/custom-components.md` reference under the documentation site's base path. Reuse existing hooks when appropriate, consume public tokens and keep application classes separate from the framework API. Colour-token inheritance alone does not apply materials to arbitrary elements. The complete starter adds no browser JavaScript and is a documentation example, not a new shipped core component.

Built-in palettes are `default` and `mono` only. Custom palettes remain ordinary CSS. Veil surface and button materials are deprecated and retained for existing sites; avoid them in new interfaces.

Put shared appearance settings on `html`, or on a documented local boundary when only one section should change. Add local overrides only for intentional exceptions.

```html
<html lang="en"
      data-theme="auto"
      data-palette="mono"
      data-shape="rounded"
      data-density="comfortable">
```

Use `data-theme="auto"` for the system preference. Use `data-shape` for corner shape. Read the generated attribute reference for the exact values and scope of each option; a setting affects its supported targets, not every HTML element.

The generated `/ai/attributes.md` and structured API include `usage` rules for every attribute: supported targets, inheritance, local overrides, dependencies and limitations. Read these before combining settings. Omitting an attribute preserves the inherited setting within the current boundary; it does not automatically restore the unconfigured default. There is no universal `default`, `auto` or `none` reset across attributes. In particular, `data-contrast="auto"` is not a complete inverse of inherited increased contrast, and unsupported material values can stop a parent material scope without selecting a new finish. Use the documented reset for the specific setting.

Use `data-font="manrope"` for the default font preset or `data-font="system"` for the device UI font. The optional `reva-fonts.css` and adjacent font files provide Manrope; without them, the system fallback remains usable. Local font settings reset only that choice, and code remains monospace.

Start with one complete global or scoped build. The scoped build uses a `.reva` boundary. Load matching optional extensions after that build. Glass, Veil, Soft UI and independent button materials require their respective extension files. Preserve reduced-motion, forced-colour and contrast fallbacks.

For colours, shapes and spacing, prefer existing attributes and documented public tokens. Use ordinary application CSS for page composition or custom styling beyond those options. Never promise an effect just because an attribute name sounds plausible.

## Start from a complete application example

The [project workspace example](https://revacss.eristavi.org/guide/ai-application/) connects a dashboard, validated form, responsive top menu and custom project card to real local routes and SQLite storage. Read the generated `/ai/application.md` for its guide and complete Python/CSS source, or use `examples/ai-application/` in the repository/package. The documentation page provides source downloads.

Run it with a matching compiled `dist/reva.css`; it uses Python's standard library and adds no browser JavaScript. Its route/data/validation connection points are explicit. The local example has no authentication or user permissions; move the rendering patterns into the consuming application's own routing, authorization and session facilities when building a product. Recorded HTTP checks do not establish browser or device acceptance.

## Troubleshoot an unexpected result

Use the [symptom-based troubleshooting guide](https://revacss.eristavi.org/guide/ai-troubleshooting/) or `/ai/troubleshooting.md` when styling or behaviour differs from expectations. It covers asset loading, attribute targets/resets, materials, scoped boundaries, cascade priority, fonts, reflow, native navigation, sticky headers, adapter state, application routes, themes and custom palettes. Follow its inspect/fix/verify sequence and distinguish an intentional fallback from a defect. `AI_TROUBLESHOOTING.md` provides the same guide in the source/package.

## Review common mistakes

Read the [incorrect and corrected examples](https://revacss.eristavi.org/guide/ai-mistakes/) or the generated `/ai/mistakes.md` reference before reviewing generated interfaces. The focused guide covers foreign classes, invalid values, missing extensions, scoped boundaries, shared defaults, resets, dropdown semantics, form labels and responsive wrappers. Its **Incorrect** snippets are deliberate counterexamples; use only the **Correct** patterns with their stated dependencies. The same examples ship in `AI_MISTAKES.md` for offline review.

## Preserve component contracts

- Use a native `button` for actions and `a.button` for destinations. Native controls do not need an invented button class.
- Use labelled native inputs, selects, textareas, fieldsets and legends. Keep names, values, validation and form destinations meaningful.
- In current source, native `textarea` elements use `field-sizing: content` by default; it is not in the published 2.0.0 files. It retains the 7rem minimum and caps growth at 24rem, then scrolls. Override `min-block-size` and `max-block-size` with ordinary application CSS. Keep a label, name and fallback `rows`; supported content sizing ignores `rows` for height. Unsupported browsers retain normal vertical resizing. Avoid a fixed `height` or `block-size` when automatic growth is wanted. For a fixed-size field, use application CSS such as `textarea { field-sizing: fixed; max-block-size: none; }`; `rows` then supplies the preferred height subject to the existing minimum. Browser acceptance is pending.
- Use `details` and `summary` for documented disclosures. Exclusive groups share a `name` within the group; separate instances need unique group names. The full core includes shared disclosure/accordion motion; modular builds must load the documented accordion styling dependency. Preserve native open state and reduced-motion fallbacks instead of adding a JavaScript accordion solely for animation. Native popovers need unique IDs and matching `popovertarget` values.
- Copy the full documented structure for navigation, drawers and radio-selected panels. Do not replace it with markup from another framework.
- Current source uses `scrollbar-gutter: stable` inside dialogs, popovers (including drawers/navigation panels) and the scrollable desktop app-shell sidebar. This reserves classic scrollbar space within the existing panel; it does not lock body scrolling, add global page gutters or change overlay-scrollbar geometry. Unsupported browsers retain native automatic allocation. Use ordinary application CSS `scrollbar-gutter: auto` to opt out; overlay gutters reset for print. Browser/device acceptance is pending.
- New overlay examples use a visually bare SVG X close control aligned to the panel header's logical end, with an accessible `aria-label`, a decorative SVG and a minimum 44px target. Retain the native button for interaction and visible keyboard focus. Clear inherited backgrounds, borders, shadows, blur and decorative edges with application CSS; do not introduce a filled text Close button for these examples.
- In current source, a non-table wrapper with a direct native table can use `data-table-sticky="none|header|column|both"` without `.table-scroll`. It is local and non-inherited; invalid values or placing it on the table do not enable it. `none` provides ordinary scrolling. Set a wrapper `max-block-size` for vertical overflow; no height is forced. Whole `thead` groups pin in header/both mode. First-column pinning uses logical inline-start and is disabled for tables with merged cells; both retains header pinning. Preserve caption/th scopes and give the scroll region a label and keyboard access. Existing `data-table` appearance remains separate; pinned surfaces use opaque theme-token backgrounds. Print removes pinning and wrapper height limits. Existing `.table-scroll` markup remains supported. Hover highlighting is not part of this setting. Browser acceptance is deferred.
- Current source styles browser-autofilled native fields by default with a theme-aware border through forgiving `:autofill` / `:-webkit-autofill` selectors. No class, RevaCSS attribute or script is required. Keep explicit labels, names and appropriate native `autocomplete` tokens; browser settings control availability. Preserve the browser's background/text colour pair and suggestion UI: do not mask autofill using huge inset shadows, long transitions or forced text-fill colours. Error borders and focus outlines retain priority, disabled controls are excluded, and read-only dashed borders remain. Typing, setting `value` or filling through automation does not prove actual autofill. The forms demo supplies a saved-profile fixture; actual autofill, editing/reset, themes/materials, forced colours, print and device validation remain deferred.
- Current source adds optional `reva.hero.css` / `reva.hero.scoped.css` and `reva.gradients.css` / `reva.gradients.scoped.css`. These are not in complete core. Use `section.hero` with an appropriately ranked heading; `header` plus `figure` wraps into a split layout. Existing appearance settings apply; matching material modules also style hero surfaces. `span.gradient-text` targets a chosen phrase independently of data-fill. `.gradient-background` adds a contained translucent accent layer on solid surfaces. Within Glass it instead animates the existing glass highlight gradient itself, keeping its colours/transparency/blur and a stationary backdrop; its extra ::before overlay is hidden. Load gradients after the matching material stylesheet. data-fill=solid removes the glass sheen, so that setting has no visible glass gradient to animate. It reserves ::before and establishes relative positioning/isolation; do not combine with competing pseudo-elements or positioning contracts. Text endpoints mix 50% primary/primary-end with text foreground for contrast; custom endpoints or stronger background tints need review. Subtle/default drift is 24s; expressive 12s; none/reduced motion stays static. High contrast/print restore solid text and remove the light layer; reduced transparency removes the light layer. Provide a visible pause control for continuous decoration; `/demos/hero/` includes a native checkbox and application CSS. Unsupported text clipping retains solid text; gradients never move letters, hide content or add semantics. New hero/gradient browser acceptance is pending.
- Current source themes native scrollbars by default: no class or attribute is needed. Inherited `data-scrollbar="auto|thin|native"` configures html, a parent or a scroll container. Auto uses a local palette/data-accent thumb and surface track at normal width. The thumb uses the exact --re-primary colour of the main button in both themes; thin keeps the colours at browser-defined thinner width; native restores browser colours and normal width throughout its subtree. Local auto restores themed normal width; each .reva boundary resets to auto. Colour fallbacks resolve per element, so nested themes/palettes keep their own colours. Included in complete core, or tokens + base for modular use. Standard `scrollbar-color` / `scrollbar-width` only; unsupported properties and OS/mobile overlay controls retain native behaviour. Forced colours and print restore native colours and width. No hidden mode, forced overflow or JavaScript. Existing scrollbar-gutter remains separate. Give independent scroll regions a useful label and keyboard access where needed. Scrollbar browser acceptance is pending; earlier additions through reading progress have maintainer-reported cross-browser success, without supplied browser versions or formal accessibility evidence.
- Current source adds an optional reading-progress extension: load `reva.reading-progress.css` after global core, or `reva.reading-progress.scoped.css` after scoped core. Add one empty `<div data-reading-progress="page" aria-hidden="true"></div>` near body or the root .reva boundary, outside transformed/filtered/contained ancestors. No class is required. `none`, omission and invalid/empty values are inactive; the setting is local. This is decorative root page-scroll position, including headers/footer, not measured reading, article completion, an ARIA progressbar or a nested-scroller indicator. Native `scroll(root block)` timelines and auto duration are required; unsupported browsers and a missing scroll range produce no visible fill. Reduced motion, forced colours, print and inherited `data-motion="none"` hide it. Theme/palette/accent and local overrides apply; RTL fills from the right. Optional public offset/height/colour/layer tokens customise placement. Both complete cores remain unchanged. See the reading-progress component and full-page demo; browser acceptance remains deferred.
- Native tables in current source highlight tbody rows by default; no class or attribute is needed. Local `data-table-hover="row|cell|column|none"` changes it per table and does not inherit. Hover is restricted to hover-capable devices. Column mode uses native child-index selectors for unmerged tables up to 32 columns, falling back to cell feedback for merged/explicitly hidden/oversized tables; use cell mode for application CSS-hidden columns with inconsistent row positions. Keyboard focus highlights a body row in row mode and a focused cell in cell/column mode; none keeps normal focus outlines. Nested-table interactions do not highlight outer tables. Inset tint preserves text, stripes and sticky backgrounds; `--re-table-highlight` overrides its default 5% link-colour tint and needs contrast review if customized. Forced colours and print suppress decoration. No click/selection/sorting/grid keyboard behaviour or JavaScript is added. Browser acceptance is deferred.
- Radio-selected content is not an ARIA tabs widget. A native popover drawer is not a modal dialog or focus trap.
- For anchored help, compose a native `button[popovertarget]` and labelled `[popover="auto"]` panel with a unique ID, heading and explicit close control. Help-icon buttons need a meaningful `aria-label`, a decorative SVG and a minimum 44px target; reuse existing icon styles and explicitly clear inherited background, border, shadow, blur and edge decoration for a visually bare icon. Retain the native button, focus outline and touch target. Keep essential instructions visible outside it. The disclosures examples supply application CSS scoped by panel ID: a viewport-bounded centred fallback plus support-gated `position-anchor: auto`, logical `position-area` and `position-try-fallbacks` for the native invoker. This adds no framework class or attribute and does not reposition arbitrary popovers, drawers or navigation. It is non-modal supplementary help, not an ARIA tooltip; preserve native Tab/Escape/outside-click behaviour and scoped ancestry. Existing appearance, local resets and optional matching motion/material extensions still apply. Anchor fallback does not polyfill missing native popover support; browser acceptance is deferred.
- For an image lightbox, compose existing native `button`, `dialog`, `figure`, `img` and `figcaption` elements; no lightbox class or data attribute is required. Label the modal through a unique caption ID, provide an explicit autofocus close control (the media examples use an SVG X in a visually bare native button with application CSS clearing inherited background, border, shadow, blur and edge decoration, with `aria-label="Close image"`, a decorative `aria-hidden="true"` SVG and a minimum 44px touch target), and retain a thumbnail plus a normal image-file link outside it for unsupported commands. Use existing `data-ratio="auto"` and `data-fit="contain"` on the dialog to reset inherited thumbnail cropping; ordinary CSS such as `max-block-size: 60dvh` bounds the enlarged image. Preserve its intrinsic dimensions, meaningful alt text, safe-area bounds, DOM/scoped ancestry, inherited appearance, local overrides and matching motion/material extensions. This is single-image viewing, not a managed carousel or custom zoom tool. See the media examples; browser acceptance is deferred.
- For native modals, use `<button type="button" commandfor="review-dialog" command="show-modal">` and `<dialog id="review-dialog" aria-labelledby="review-title">` with a labelled heading and an explicit close button (`command="close"`) or `form method="dialog"`. Omit `open`; it only displays a non-modal dialog. Native command support is required, with no framework polyfill; keep essential content/actions reachable elsewhere. `closedby="closerequest"` permits platform dismissal; `closedby="any"` also requests light dismissal where supported. Preserve native focus handling and choose an appropriate autofocus control. Dialogs stay in their DOM/scoped boundary: inherited theme/palette/shape/border/depth/density and local overrides still apply in the top layer. Load matching motion/material extensions for effects; `data-motion="none"` and `data-material="solid"` provide local resets. Decorative edges keep their existing button/card targets. See the disclosures examples; browser acceptance for the new workflows is deferred.
- Keep IDs and radio-group names unique when combining examples. Replace demonstration links and sample data with real project content.
- Follow the required styling dependencies listed in the component reference. Individual component files are not independent behaviour packages.

Read a component's Markdown page before generating its markup. The page includes its hook, states, styling module, behaviour limits and existing examples. For a complex navbar, consult the full top-menu documentation or a complete demo's source.

## Connect application behaviour

CSS supplies appearance and supported native interactions. Your application supplies data, search, sorting, authentication, form processing, payments, persistent state and real-time updates.

Add application JavaScript where the product requires it. Keep that code separate from the zero-JavaScript CSS core. The documentation's optional appearance customizer is a demo helper, not a runtime dependency for ordinary RevaCSS pages.

Use progressive enhancement for modern CSS. Follow the documented browser support and fallbacks. Do not claim accessibility certification or physical-device validation from generated markup alone.

## Optional framework adapters

Keep the CSS core independent of application frameworks. Use the separate Astro,
Vue, React, Svelte or Laravel adapter when it fits the project; ordinary native
HTML remains supported without an adapter. Reuse the existing Vue adapter in
Nuxt, React adapter in Next.js and Svelte adapter in SvelteKit. Do not invent
additional RevaCSS runtime layers, a Nuxt module or framework-specific CSS.

Read `/ai/adapters.md` for the adapter index, then `/ai/adapters/astro.md`, `/ai/adapters/react.md`, `/ai/adapters/vue.md`, `/ai/adapters/svelte.md` or `/ai/adapters/laravel.md`. These pages are generated from the adapter README sources; each has the same seven-decision AI workflow. The structured API's `adapters` entries expose source package names, versions (when declared), requirements and reference links; they do not establish publication status. An installed older archive can contain an earlier README; apply the version-selection procedure before using the current reference.

| Adapter | Layout and document boundary | Field-state rule |
| --- | --- | --- |
| Astro | Full document; Layout forwards root attributes. No client directive is needed for these `.astro` components. | Native input value, selected options and textarea slot text; the application provides server errors. |
| React / Next.js | Layout is a div; the host manages html/head/body. Application state, event handlers and DOM refs need the appropriate client boundary. | Native value/defaultValue rules; controlled fields need onChange or readOnly; React 19 refs reach controls. |
| Vue / Nuxt | Layout is a div; the host manages document attributes/head. Vue owns hydration and model state. | Plain v-model; multiple selects use arrays. A component ref is not an exposed native DOM API. |
| Svelte / SvelteKit | Layout is a div; the app owns the document and server/client state. | bind:value; use supported bind:element for a native node, initialized to null during SSR. |
| Laravel / optional Livewire | Blade Layout renders the document and selects versioned assets. | Old input and error bags for ordinary fields; Livewire-bound controls delegate state to Livewire. |

Follow the matching framework guide and shipped examples for props, field
associations, model/value bindings, refs and server rendering. Preserve native
HTML semantics and the framework's server/client boundaries. The application's
JavaScript runtime is separate from RevaCSS's zero-JavaScript CSS core.

GitHub adapter archives, npm packages and Composer/Packagist availability are
separate. Check the installation guide for the package and release actually
available; do not infer a registry publication from stable manifest metadata or
a GitHub release. The [release validation record](https://github.com/eristavi/RevaCSS/blob/main/quality/releases/v2.0.0.md)
identifies tested framework scope, revisions and evidence limits.

## Prompts you can adapt

**Build a landing page:** “Use RevaCSS and its current AI reference to create a responsive HTML landing page. Use native HTML, shared appearance attributes and documented component structures. Include pricing, an FAQ and a labelled contact form. Identify the form endpoint I need to connect.”

**Adapt a demo:** “Start from the RevaCSS shop demo. Preserve its native navigation and component markup. Replace the fictional products with my catalogue, use the mono palette and keep system light/dark mode. Show where product data and checkout should connect.”

**Change the appearance:** “Update my RevaCSS page to use the default palette and a spacious density through shared settings. Preserve local semantic states and accessibility fallbacks. Use only values supported by the current reference.”

**Review generated code:** “Compare this page with the RevaCSS component contracts. Flag unsupported attributes, missing extensions, duplicate IDs, placeholder destinations and missing labels. Follow my project's instructions about when to run tests.”

## Contributing to the framework

For repository changes, read [the contributor workflow](https://revacss.eristavi.org/guide/contributing/) or `/ai/contributing.md`, also available as `CONTRIBUTING.md` in the source/package. It maps changes to source files, explains generated outputs and identifies checks for the affected behaviour. Start with `AGENTS.md` in a checkout and keep application usage separate from framework-maintenance tasks.

## Evidence for the guidance

Read the [dated evaluation](https://revacss.eristavi.org/guide/ai-evaluation/) or `/ai/evaluation.md` for the measured scope. The initial documentation-conditioned batch passed five static interface scenarios and detected fourteen deliberately broken variants. Prompts, original HTML, diagnostics and file hashes are recorded in the repository. The same assistant authored the guidance and this first batch; this is not an independent model comparison or a guarantee of future output quality.

From a source checkout, `npm run test:ai-guidance` rechecks those committed fixtures without a model call, browser run or installation. Follow `tests/ai/README.md` to record new unedited output batches and use failures to improve the source instructions. Keep static markup results separate from browser, application and adapter-runtime evidence.

## Workflow for agents

1. Follow “Select the version before using the API” to identify the loaded core, matching reference and any adapter dependencies.
2. Select the relevant component pages and existing demo sources.
3. Choose global or scoped CSS and the required extensions.
4. Generate meaningful HTML, then apply shared defaults and intentional local overrides.
5. Connect the application's behaviour without changing the framework's core contract.
6. Review the result and report its limitations. Run tests only when the user or project workflow authorizes them; when deferred, say they have not been run.

The text reference is generated from the documentation's component contracts, examples, public tokens and option manifest on each documentation build. It helps agents look up the supported API; it does not guarantee that an AI service will discover or read it automatically.

## RevaCSS 2.0 patterns

The following patterns are included in the published 2.0.0 GitHub distribution and covered by its recorded release validation. Use matching 2.0 files and references; the older 1.2.1 distribution retains its original API. GitHub publication does not imply npm availability. See the [migration guide](https://github.com/eristavi/RevaCSS/blob/v2.0.0/MIGRATION.md) when upgrading.

- Put `.responsive` on a separate, full-width wrapper inside a sized parent. Descendant `.grid.cols-2`/`.grid.cols-3`, toolbars, card footer rows and navigation rails adapt to that wrapper. Do not put containment on a subgrid card. Viewport/intrinsic fallbacks remain.
- Use native `dir="rtl"` and `lang` for RTL pages, and `dir="auto"` or `bdi` for mixed user content. Do not reverse DOM order or mirror every icon.
- Use `.visually-hidden` for necessary accessible labels. Focusable content using it is revealed on keyboard focus. Decorative content still needs `aria-hidden` where appropriate.
- Print utilities: `.no-print` hides, `.print-only` reveals and `.print-links` appends HTTP(S) destinations on paper. These are opt-in; ordinary link styling does not append URLs.
- Required status and error explanations are visible HTML text. Applications supply validation messages and state; CSS does not compute range outputs or replace native pickers.
