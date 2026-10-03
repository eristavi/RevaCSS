# RevaCSS

A new default for the web. Native HTML and CSS, token-driven design, easy overrides.

**Foundation alpha · 0.1.0-alpha.1:** not a complete component library or a WCAG certification.

```html
<link rel="stylesheet" href="reva.css">
<button>Get started</button>
```

## Drawer / inspector

Use one `.drawer` class on a native `aside[popover="auto"]`. Semantic `header`, `section` and `footer` children define its regions. Configure inherited `data-drawer-position="end|start"` and `data-drawer-size="small|medium|large"`; theme and other design attributes stay inherited. Opening, outside-click and Escape dismissal use native HTML, with no JavaScript. See [drawer documentation](https://eristavi.github.io/RevaCSS/components/drawers/) and the [dashboard](https://eristavi.github.io/RevaCSS/demos/dashboard/).

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

Load `reva.glass.css` after `reva.css`, then add `data-material="glass"` to a component or section. `data-material="solid"` ends the treatment locally. Theme, tone, shape, density, depth, fill and contrast use the shared attributes. Glass surfaces use 32% backing with stronger supporting text, links and control boundaries. Styled text fields retain their existing treatment. Glass actions use 90% colour backing and backdrop blur; a local material attribute also works on a single button, button link or native action input. Use `reva.glass.scoped.css` with the scoped core. Reduced transparency, increased contrast, forced colours and print have opaque fallbacks; browsers without backdrop filtering retain ordinary core surfaces. See the Glass material documentation for supported components, customization and limits.

## Optional Veil material

Load `reva.veil.css` after the global core, or `reva.veil.scoped.css` after the scoped core. Set `data-material="veil"` on `html`, `.reva` or a shared parent. Veil uses diffused palette colour at the perimeter, two contained inset contours and 94% surface backing without backdrop blur. Shape, density, depth, fill, borders, motion and semantic variants keep their existing APIs. It uses no decorative pseudo-elements, leaving `data-edge` available. Different explicit materials stop inherited treatments; Solid resets and Glass exceptions retain their own styling. Reduced motion stops highlight transitions; contrast/transparency preferences, forced colours and print simplify the paint. New material validation is deferred; existing Glass passes do not cover Veil. [Documentation](https://eristavi.github.io/RevaCSS/themes/veil/) · [Complete website demo](https://eristavi.github.io/RevaCSS/demos/marketing/light/ocean/veil/rounded/).

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

Astro generates static documentation with no browser JavaScript. `npm run dev` previews it locally. Component pages pair live demos with the exact HTML used to render them in a syntax-highlighted, theme-aware code viewer with native line wrapping. Browse typography, buttons, badges, alerts, accordions, breadcrumbs, pagination, form groups, forms, cards/layouts, tables, images, disclosures, top navigation, glass material, and examples for every shared data attribute. The reorganised guide explains installation and inheritance; theme guides cover light, dark, system and glass; the API reference separates attribute values, stylesheet entry points, component contracts and documented CSS properties.

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

### Accordions, breadcrumbs, pagination and form groups

Use `.accordion` around native `details` items; omit `name` for independent sections or share a unique `name` for native exclusive groups. Use `nav.breadcrumbs` and `nav.pagination` with ordered lists, real destination links and `aria-current="page"` on the current location. Unavailable pagination controls are plain spans, not active links. One `.form-group` arranges a label, control and associated help text; optional `.field-error` styles a known validation message. Fieldsets and legends group related choices.

All four follow meaningful shared parent settings without repeated styling attributes. They add no JavaScript. Pagination routing and application validation remain owned by your application. Each has [documentation examples](https://eristavi.github.io/RevaCSS/) with formatted HTML. Modular builds include `reva.accordions.css`, `reva.breadcrumbs.css`, `reva.pagination.css` and `reva.form-groups.css`.

### More native components

Native `progress` and `meter` already have inherited accent styling; the dedicated documentation page explains completion, indeterminate progress and bounded measurements. New `.spinner` indicators pair decorative CSS motion with visible status text. `.tabs` fieldsets and `.tab-panel` sections implement native radio-selected content panels, with radio semantics rather than ARIA tab roles. `.list-group` arranges native lists; `.empty-state` arranges first-use and no-results messages; `.avatar` supports image or explicitly rendered initials.

These components add no browser JavaScript. Applications own loading state, result fetching, validation and failed-image fallback. Documentation provides live examples and formatted HTML. Modular builds include `reva.loading.css`, `reva.tabs.css`, `reva.lists.css`, `reva.empty-states.css` and `reva.avatars.css`.

### SVG icons

The Reva outline set contains 36 original SVG icons on a 24 × 24 grid with rounded 1.75-unit strokes. Use `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="/path/to/icons/reva.svg#rv-search"></use></svg>` beside visible text. Inline SVG and sprite use inherit `currentColor`, so icons follow light, dark and glass foregrounds without repeated theme attributes. Name icon-only controls on the native button.

Builds include `dist/icons/reva.svg`, individual SVG assets and `reva.icons.css`. Complete and scoped CSS include icon presentation. Set `--re-icon-size` or `--re-icon-stroke` on a parent only when defaults need adjustment. External `img` SVGs do not inherit the page text colour. Browse the [icon gallery and HTML examples](https://eristavi.github.io/RevaCSS/icons/). No JavaScript is required.

### Settings and content patterns

Native checkbox `.switch` controls provide on/off settings with inherited accent, shape, size and motion. `.input-group` flexibly arranges a labelled input with text or an action. Decorative `.skeleton` placeholders retain visible loading text and respect reduced motion. `.toolbar` groups ordinary controls with `role="group"` semantics; applications wanting ARIA toolbar arrow-key navigation supply that behavior separately.

Use `dl.description-list` for responsive term/value pairs. Existing `.card` elements now support native headers, media figures and action footers without extra structural classes. All six patterns include HTML examples in the documentation and standalone CSS modules. No JavaScript was added; application actions, busy states and data updates remain application-owned.

### Shared action variants

`data-variant="primary|success|warning|danger|neutral"` now configures native buttons, action inputs, `.button` links, badges and alerts. Set it on a parent to define a shared default; override only exceptions. Existing semantic button classes (`secondary`, `danger`, `warning`) remain local overrides of inherited variants. A valid action-level `data-variant` takes precedence when both are present. `outline` and `ghost` remain presentation classes; `data-appearance` still belongs to badges and alerts. Native text controls and navigation toggles keep their existing styling.

### Standalone dropdowns

Use `<button type="button" popovertarget="resources">Resources</button>` followed by `<ul class="dropdown" id="resources" popover="auto" role="list" aria-label="Resources">` containing ordinary list items with links or buttons. A single component class is enough; theme, size, shape and material follow the DOM parent. Native popovers handle outside-click and Escape dismissal. CSS uses the opener’s implicit anchor when supported, with a centred viewport-bounded fallback. No JavaScript, ARIA menu roles, arrow-key handling or automatic action dismissal is added. Use a native button with `popovertargetaction="hide"` when explicit closing is needed. Complete/scoped/component builds include the pattern; modular use loads tokens, base and `reva.dropdowns.css`. [HTML examples and behaviour](https://eristavi.github.io/RevaCSS/components/dropdowns/).

### Optional popover motion

Load `reva.motion.css` after the global core, or `reva.motion.scoped.css` after the scoped core. The core bundles remain unchanged. Native popovers, including dropdown and navigation panels, gain a short fade, slide and scale entrance using CSS `@starting-style`. Existing parent `data-motion="none|subtle|expressive"` settings control intensity and duration (0/140/240ms); nearer settings override inherited defaults. Reduced motion, forced colours and print disable this entrance effect. Unsupported starting-style browsers show the content immediately. Closing stays immediate and native; there is no delayed dismissal, JavaScript, scroll reveal or dialog animation in this first module. [Motion guide and HTML examples](https://eristavi.github.io/RevaCSS/guide/motion/).

### Coordinated colour palettes

Mono is the default in light, dark and system modes. Select one of seven coordinated colour families once on a parent:

```html
<html data-theme="auto" data-palette="ocean">
```

Accepted palettes: `mono`, `sand`, `ocean`, `cobalt`, `citrus`, `violet`, `forest`. They supply page and surface colours, text, links, borders and primary actions. Semantic success, warning and error colours retain their meanings. Glass uses the same palette tokens; load the optional glass extension as usual.

A nearer palette installs a complete colour set. On the same element, explicit `data-accent` overrides the primary stops and their foreground; `data-tone` overrides surfaces while preserving palette foregrounds and links. Omitted accent and tone settings follow the selected palette. Theme, material and other shared options inherit independently. Scoped builds accept palettes on `.reva` boundaries. [Compare palettes and HTML examples](https://eristavi.github.io/RevaCSS/themes/palettes/).

### Default gliding highlights

Tabs include scoped underline indicators; desktop top-level navigation and pagination use a gliding hover background. Submenus retain static hover and focus styling. These effects are included in the core and dedicated component modules. Tabs follow selected native choices; navigation and pagination follow eligible hover/visible-focus targets and return to a current-page item where present. Pagination retains its persistent current-page styling. The effect uses CSS anchor positioning and anchor-scope, with ordinary static state styling as fallback. Parent `data-motion` controls duration and reduced-motion preferences disable transitions. No JavaScript, extra markup or animation class is required. These effects reserve `::after` on `.tabs` and `::after` on the desktop top-menu list and pagination’s direct `ol`. The optional motion extension still controls popover entrances separately.

### Top navigation layouts

Set `data-navbar="standard|centered|floating|split"` on `html`, a parent, or `.top-menu`. Standard is the default. Layout inherits, and a local value resets the parent preset. All presets retain the shared mobile popover navigation and theme settings; sidebars are unaffected. Split supports a second desktop link list in `.menu-actions`; include both groups in the mobile list. Floating is an inset surface that scrolls normally. See the [top menu documentation](https://eristavi.github.io/RevaCSS/components/top-menu/) for complete HTML examples.

### Sidebar and application shell

One `.app-shell` class arranges direct native `aside`, `header` and `main` regions. Sidebar links and nested `details` groups need no item classes. A standalone sidebar uses `aside.sidebar`. Theme settings inherit from the parent, including optional Glass and Veil.

At 60rem the persistent desktop sidebar becomes a native mobile popover drawer. Render both navigation copies from one template, with unique drawer IDs and native `popovertarget` buttons. The drawer is non-modal and keeps browser-owned outside-click/Escape dismissal. Load `reva.app-shell.css` with tokens/base, or use the complete build. See [sidebar and app shell examples](https://eristavi.github.io/RevaCSS/components/app-shell/).
