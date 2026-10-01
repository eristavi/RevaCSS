# RevaCSS specification — frozen v0.1 scope

A new default for the web. Native foundations, adaptive design, minimal decisions.

## Contract
- Websites and applications; beginners and experienced developers.
- HTML and CSS only in delivered framework and documentation. Development tooling may use JavaScript.
- No mandatory wrappers or configuration. Native structural elements stay neutral.
- Public CSS variables --re-*, stylesheet reva.css, nested layers re.tokens/re.base/re.components/re.utilities.
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

No npm publication, including an alpha package, until the first fully functional release includes the agreed components and completes automated, manual accessibility and real-device testing. Keep the package private until those release gates are complete.

## Accessibility and quality
WCAG 2.2 A/AA target for shipped defaults and documented examples; not automatic conformance for consuming sites. Normal text 4.5:1, qualifying large text 3:1, applicable control/state contrast 3:1. Keyboard, focus visibility/order, target sizing and exceptions, reflow at 320 CSS pixels, zoom, text spacing, forced colours, reduced motion, semantic labels and screen readers. Essential content stays in HTML. Hidden panels must leave keyboard and accessibility navigation correctly. Glass contrast requires opaque enough backing and contextual testing.

Custom primary shades do not guarantee accessible foregrounds; explicit foreground and state tokens are tested. Container queries applied deliberately. Scoped builds document inheritance/overlay limits and third-party class collisions. Public attributes/classes/tokens follow semantic versioning and migration notices.

Proposed gzip CSS budgets: 15 KiB core / 35 KiB complete, excluding fonts/icons/extensions. Reference page of plain HTML is primary design acceptance test. Manual screen-reader and current cross-browser checks required before stable release. No new attribute options until scope reviewed.

Shared appearance contract: shape applies to styled controls, surfaces, tables (including captioned tables), media and code. Border thickness applies to styled controls, surfaces, table separators and navigation panels. Table grid lines use the current border thickness without doubled internal edges. Depth applies to raised surfaces and actions; text-control inset shadows remain controlled by data-controls. Native invalid-field borders, focus indicators and forced-colour boundaries override decorative settings. Theme changes colours without resetting geometry or local settings. Optional material requires its matching global/scoped stylesheet.

Decorative edges preserve the component interior and keyboard focus. They follow action/accent colours, shape and border width. Shine runs one sweep on hover or keyboard focus (focus-within for cards); animated runs an eight-second turn. Motion none pauses movement, reduced motion freezes it, and increased contrast, forced colours and print suppress decoration. Native input actions and browsers without composite masking retain normal borders. The framework reserves ::after on supported edge targets; custom pseudo-element effects must override or disable it.
