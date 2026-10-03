# Marketing website demo

First complete website demo: `/demos/marketing/`. The fictional Forma workspace product gives navigation, cards, icons, lists, badges, avatars, radio-selected panels, pricing previews, accordions and native forms a purpose within one website.

## Configuration and source

- Parent settings: theme, palette, material and shape; default Light / Mono / Solid / Rounded.
- The existing 252 base routes remain entry points, including System theme and Solid/Glass/Veil materials. Each initializes the radio controls; subsequent changes are live CSS-only selections and do not navigate or reload.
- All 14 radio groups preview theme, palette, material, shape, motion, edges, density, shadows, fill, typography, control size, borders, width and contrast immediately through CSS. Declarations and rebound material scopes come from the framework CSS and registry, not a separate token map. Explicit descendant material boundaries remain intact. Device preferences retain priority.
- The selected-attributes snippet exposes one line per group for all 14 selections. The complete HTML download/code viewer retain the entry route’s starting configuration: users copy all selected attributes onto the opening html tag. This limitation is explained in the panel and beside the source; CSS does not rewrite attributes or serialize current state into downloads. A native form reset restores all entry defaults without a page reload.
- The customization panel is outside the preview's theme boundary. Its native details disclosure starts expanded and can be collapsed on mobile or desktop.
- The preview background spans the full page width; website content keeps its own inherited-width containers. The customizer, introduction and source remain contained outside the preview theme. No viewport-width offsets are used.
- The preview uses the shared TopMenu component. Complete base HTML downloads and the code viewer render the same MarketingSite component; downloads move base appearance attributes to `<html>`.
- The core supplies component surfaces/states. `docs/public/demos/marketing.css` supplies website composition. No core CSS or public API change is required.
- Contact controls deliberately omit names: browser validation works, but entered data is not transmitted. Production adaptations must supply names and a submission endpoint.

## Pending validation and next work

Automated tests and browser inspection are deferred at the user's request. Building the static pages is a compilation step, not a test pass or release-gate closure.

The next PC session must resume the outstanding desktop keyboard checks: Tab/Shift+Tab, Enter/Space, Escape and focus restoration at each nested menu level. Screen-reader, zoom/print and visual-baseline review remain outstanding. Existing iPhone checklist passes apply to the device-check fixtures, not automatically to this new demo.

Known existing component contracts also apply here: radio-selected panels retain native radio semantics; in-page navigation links do not automatically dismiss an open popover; nested focus restoration is browser-dependent. Appearance changes use checked-control selectors and framework tokens/material scopes; no JavaScript is added and configuration changes no longer reload the page. The preview has no fixed appearance attributes that could conflict with the live selections; the copyable snippet supplies the production data-attribute configuration.

After reviewing this marketing demo, build dashboard and settings/forms demos to cover remaining components in suitable contexts. Do not add every component to the marketing page merely for coverage.
