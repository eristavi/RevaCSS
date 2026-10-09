# RevaCSS specification — frozen v0.1 scope

A new default for the web. Native foundations, adaptive design, minimal decisions.

## Current distribution release

RevaCSS 1.0.0 — Erisian is the first public GitHub release, with compiled downloads and recorded validation. The frozen foundation scope below is retained as design history; current settings and component contracts are maintained in the manifests and documentation. The maintainer has authorized the first npm publication with the same six disclosed manual acceptance checks still open. The version-specific exception is recorded in `quality/npm-publication-v1.0.0.json`; it does not certify acceptance or change the standard for future versions.

## Contract
- Websites and applications; beginners and experienced developers.
- HTML and CSS only in delivered framework and documentation. Development tooling may use JavaScript.
- No mandatory wrappers or configuration. Native structural elements stay neutral.
- Public CSS variables --re-*, stylesheet reva.css, nested layers re.tokens/re.base/re.components/re.buttons/re.utilities.
- DTCG tokens are source; primitive → semantic → component overrides.
- Manrope with system fallback; optional multilingual packs and SVG icons.
- MIT core and all components. Paid templates/designs/support can use separate terms.
- Auto light/dark; glass is a separate extension, not a core theme.
- Low specificity, local design overrides, standard CSS customisation.
- Latest stable Chrome/Edge/Firefox/Safari; experimental features in separate opt-in module.

## Frozen attributes
| Attribute | Values | Default | Scope |
|---|---|---|---|
| `data-theme` | `auto`, `light`, `dark` | `auto` | Inherited |
| `data-accent` | `blue`, `violet`, `teal`, `green`, `orange`, `rose` | `blue` | Inherited |
| `data-shape` | `square`, `subtle`, `rounded`, `pill` | `rounded` | Inherited |
| `data-fill` | `gradient`, `solid` | `gradient` | Inherited |
| `data-density` | `compact`, `comfortable`, `spacious` | `comfortable` | Inherited |
| `data-depth` | `flat`, `subtle`, `pronounced` | `subtle` | Inherited |
| `data-edge` | `plain`, `gradient`, `shine`, `animated` | `plain` | Inherited; buttons, .button links and cards |
| `data-motion` | `none`, `subtle`, `expressive` | `subtle` | Inherited |
| `data-type` | `compact`, `standard`, `large` | `standard` | Inherited |
| `data-border` | `subtle`, `defined`, `none` | `subtle` | Inherited |
| `data-contrast` | `auto`, `more` | `auto` | Inherited |
| `data-tone` | `neutral`, `cool`, `warm` | `neutral` | Inherited |
| `data-controls` | `styled`, `minimal` | `styled` | Inherited |
| `data-width` | `narrow`, `standard`, `wide` | `standard` | Inherited; affects .container |
| `data-table` | `plain`, `striped`, `bordered` | `plain` | Inherited; affects tables |
| `data-size` | `small`, `medium`, `large` | `medium` | Inherited; affects controls and menu actions |
| `data-ratio` | `auto`, `square`, `landscape`, `portrait`, `wide` | `auto` | Inherited; affects images and videos |
| `data-fit` | `cover`, `contain` | `cover` | Inherited; affects constrained images and videos |
| `data-gap` | `none`, `small`, `medium`, `large` | `medium` | Inherited; affects .grid, .row and .stack |

## Optional material extension
`data-material="glass"` activates supported frosted surfaces when the glass stylesheet is loaded. `data-material="solid"` ends the material scope locally; another glass attribute can resume it. This is independent of `data-theme` and reuses the shared design attributes. Glass is excluded from core builds and budgets. Unsupported backdrop filtering and accessibility preferences retain opaque surfaces. Text fields retain their core treatments. Buttons, button links and native action inputs support glass with 90% colour backing; solid resets, native states, shared settings and opaque preference fallbacks remain supported. Unsupported filtering retains the original core button variants.

## Behaviour
Inherited design settings remain local to their subtree. Reset one setting without resetting unrelated settings. All core attributes can set defaults on html, a section, or a component. Size, gap, fit, ratio, table and width inherit through the subtree but affect only their documented targets. The nearest explicit value wins, including plain, medium, standard, auto and cover resets. Omitted settings preserve existing defaults. Configure scoped builds at the .reva boundary or within it; each boundary has its own defaults. Visitor reduced motion and forced-colour preferences constrain decoration. User font preferences, zoom and reading order remain usable. Attribute auto restores the appropriate default or device choice. Invalid values have no effect.

Filled buttons are default; .outline/.ghost select treatment; .danger/.warning/.secondary select role. Body links are underlined. Form invalid styling follows interaction. Container widths are optional; tables use a horizontal scrolling wrapper. Density affects spacing; typography affects type scale; size targets controls throughout its subtree. Explicit gap presets inherit independently of density; their multiplier applies to the current density-based --re-gap spacing. Pill applies full rounding to buttons and bounded large rounding to cards.

## Release scope and milestones
Foundation first: tokens, native HTML, light/dark, buttons, cards, layouts, forms, tables, disclosure/dialog appearance. Then navigation, breadcrumbs, pagination, badges, alerts, segmented radio selectors, content switchers, native popovers/dialog patterns and basic scroll-snap carousel. The first navigation component is a responsive top menu: desktop and mobile lists generated from shared links, native popover auto/button toggles, nested submenus, desktop and mobile popover panels with Back controls. Native outside-click and Escape dismissal are supported without JavaScript. CSS anchor positioning enhances desktop placement; centered panels remain usable without it. Ordinary in-page links do not automatically dismiss panels, and application-menubar arrow-key controls are not claimed. Legacy details markup retains disclosure behavior. No autoplay, scripted tabs, client-side fetching or dynamic data table engine. Masonry enhancement remains experimental; any CSS-columns alternative documents column-first ordering.

Global and scoped builds, complete/modular CSS, optional glass module, optional icons and fonts, print styles, RTL, multilingual packs. Docs: static Astro, Markdown, generated API tables, isolated preview pages, GitHub Actions → GitHub Pages. Downloads/npm/versioned CDN prepared before public release.

The normal npm release requirement is the agreed component scope plus automated, manual accessibility and real-device acceptance. The maintainer-authorized exception above applies only to `revacss@1.0.0` and its recorded manual items. New automated or manual blockers, and future versions, remain gated.

## Accessibility and quality
WCAG 2.2 A/AA target for shipped defaults and documented examples; not automatic conformance for consuming sites. Normal text 4.5:1, qualifying large text 3:1, applicable control/state contrast 3:1. Keyboard, focus visibility/order, target sizing and exceptions, reflow at 320 CSS pixels, zoom, text spacing, forced colours, reduced motion, semantic labels and screen readers. Essential content stays in HTML. Hidden panels must leave keyboard and accessibility navigation correctly. Glass contrast requires opaque enough backing and contextual testing.

Custom primary shades do not guarantee accessible foregrounds; explicit foreground and state tokens are tested. Container queries applied deliberately. Scoped builds document inheritance/overlay limits and third-party class collisions. Public attributes/classes/tokens follow semantic versioning and migration notices.

Proposed gzip CSS budgets: 15 KiB core / 35 KiB complete, excluding fonts/icons/extensions. Reference page of plain HTML is primary design acceptance test. Manual screen-reader and current cross-browser checks are required to complete release acceptance. The first npm release exception does not establish that acceptance. No new attribute options until scope reviewed.

Shared appearance contract: shape applies to styled controls, surfaces, tables (including captioned tables), media and code. Border thickness applies to styled controls, surfaces, table separators and navigation panels. Table grid lines use the current border thickness without doubled internal edges. Depth applies to raised surfaces and actions; text-control inset shadows remain controlled by data-controls. Native invalid-field borders, focus indicators and forced-colour boundaries override decorative settings. Theme changes colours without resetting geometry or local settings. Optional material requires its matching global/scoped stylesheet.

Decorative edges preserve the component interior and keyboard focus. They follow action/accent colours, shape and border width. Shine runs one sweep on hover or keyboard focus (focus-within for cards); animated runs an eight-second turn. Motion none pauses movement, reduced motion freezes it, and increased contrast, forced colours and print suppress decoration. Native input actions and browsers without composite masking retain normal borders. The framework reserves ::after on supported edge targets; custom pseudo-element effects must override or disable it.

## Drawer / inspector contract

One .drawer structural class on aside[popover=auto], with semantic header, section and footer. Default width 28rem, bounded by the viewport, on the logical end edge. Optional inherited CSS variables --re-drawer-width, --re-drawer-start and --re-drawer-end allow ordinary CSS customisation. No component-specific attributes. Existing shared attribute contracts remain unchanged. Native opening and dismissal; non-modal overlay, no focus trap or scroll lock. Theme and optional materials inherit within the DOM/scoped boundary. Whole-panel scrolling, forced-colour borders, reduced-motion support and print omission. Included in full, components, scoped and standalone reva.drawers.css builds.

## Metric card contract

Reuse .card with a direct dl containing dt and dd > output; further dd elements provide visible comparison/context and optional labelled native meter/progress. No new classes or data attributes. The existing card appearance, materials, edges and shared attributes apply. Backend supplies data and formatting; CSS does not calculate metrics. Included in card-patterns, full, components and scoped builds.

## Dashboard composition contract

Timeline: one ol.timeline class, native li content and time[datetime], DOM event order retained, logical geometry and inherited shared tokens. Navigation rail: one nav.nav-rail class with direct native anchors and visible labels; vertical by default, wrapping horizontal below 40rem; no implicit app-shell changes. Charts: one figure.chart class wrapping SVG and figcaption; existing line/area and doughnut patterns are reused. Geometry and data are server-supplied; exact values and series remain accessible through descriptions/tables. Local CSS variables --re-chart-color and --re-chart-ring-width configure series strokes. These modules ship standalone and in full/components/scoped builds. Missing chart/metric data reuses empty-state or an explicit unavailable metric; absence is not represented as zero. No new data attributes, JavaScript, chart types or client-side data engine.

## Optional native select enhancement

Separate reva.selects.css and reva.selects.scoped.css extensions, excluded from core/full budgets. @supports guards appearance:base-select and ::picker(select). Ordinary single dropdowns reuse existing shared tokens with opaque option surfaces. No new attributes/classes/markup. Multiple selects and explicit listboxes remain native. Unsupported browsers retain the native picker. Supporting browsers use an in-page picker rather than the mobile OS sheet. Keyboard operation, values and validation remain native; forced colours and reduced motion constrain presentation.

Default colour direction: data-palette="default" uses white/black surfaces with Blue Teal primary actions (#1F6E8C light / #2E8A99 dark). Main headings and links use the readable palette link shade (#65BBC7 dark). Secondary (#4B5563 / #BFC8CD), success (#256B4E / #78B99B), warning (#E6BC63 both), and danger (#A63D4F / #D98B97) use adaptive foregrounds. Gradient endpoints remain subtle companion shades; solid fills use the exact approved values.

The optional data-palette="mono" restores monochrome primary actions and links. Demo pages and standalone HTML downloads start with the default palette and system colour mode.


## Native application patterns

One ol.steps class presents process stages with native links/spans, aria-current=step and explicit visible state text. One .rating class supports a labelled read-only star display or native fieldset/legend/radio choices; integer values, names, required/disabled states, keyboard operation and reset remain native. One table.calendar class presents server-supplied dates, scoped weekday headers, dated time elements and event links; it is not a date-picker or booking engine. One ol.message-thread class arranges existing article.card surfaces in DOM order, using the existing data-variant=primary for logical outgoing alignment and visible sender/time/status text. No component-specific attributes, JavaScript, implied live-region roles or client-side data engines. Included in core/components/scoped and standalone stylesheets.

## Planned 1.1.0 interaction additions

Fragment scrolling follows the nearest scroll container's inherited `data-motion`: none selects auto, subtle and expressive select native smooth scrolling. Expressive also highlights a targeted heading or gallery item briefly. The browser controls scroll timing; CSS does not wait for scroll completion or maintain selected-slide state. Reduced motion, forced colours and print remove these enhancements. A scoped island cannot change the outer document's scrolling.

`a.scroll-top` is a native action link to an existing page ID, sharing action/material selectors rather than duplicating button styles. It stays in document flow unless the application positions it, and is hidden in print. `.gallery` remains a native proximity-snap list, without autoplay or application state.

The optional motion module enhances native popovers and dialogs with starting styles, drawer-edge translation and supported discrete exits. Native HTML keeps visibility/dismissal/focus ownership. Numeric tokens configure offsets and duration; no per-component motion attribute or framework JavaScript is added.

## Action-only materials (1.2 development preview)

Optional reva.button-materials.css and reva.button-materials.scoped.css add inherited data-button-material: default, solid, glass, veil, soft, liquid. Omitted/default follows the existing data-material at the action; explicit values independently override action paint. Applies to button, input button/submit/reset and .button/.scroll-top links, including a value on the action itself. Nested defaults stop a role override and allow the general material to apply again. It does not change navigation toggles, dropdown controls, cards, text inputs, checkboxes, radios, switches or plain links.

The re.buttons cascade layer sits between components and utilities, so role overrides do not lose to a closer general material while system preferences still win. Existing semantic variants, outline/ghost backing, size, shape, depth, borders and focus semantics remain separate. The optional module contains every explicit button finish; other material extensions are needed only for general surfaces.

Liquid is a CSS simulation using transparent neutral backing (12% by default), blur, white reflective rims and press scaling. It adds no accent or semantic tint; labels use the theme text colour, including outline and ghost actions. Other explicit finishes retain semantic colours. Its opaque fallback is neutral. Applications must review contrast over custom backgrounds. It provides no optical lensing, finger tracking, haptics or framework runtime. Motion none removes movement; subtle/expressive select expansion and return timing. Reduced motion, increased contrast, reduced transparency, forced colours and print constrain decoration. Unsupported blur retains opaque backing and unsupported linear() easing retains cubic-bezier easing. Native controls retain activation and disabled semantics; aria-disabled alone does not prevent application actions or navigation.
