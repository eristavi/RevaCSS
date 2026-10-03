# Marketing website demo

First complete website demo: `/demos/marketing/`. The fictional Forma workspace product gives navigation, cards, icons, lists, badges, avatars, radio-selected panels, pricing previews, accordions and native forms a purpose within one website.

## Configuration and source

- Parent settings: theme, palette, material and shape; default Light / Mono / Solid / Rounded.
- All 252 base combinations are static routes, including System theme and Solid/Glass/Veil materials. Native links preserve the other three base choices; switching reloads the page and resets transient controls and advanced choices.
- Advanced radio controls preview motion, edges, density, shadows, fill, typography, control size, borders, width and contrast immediately through CSS. Declarations come from the built framework CSS and registry, not a separate token map. Device preferences retain priority.
- The selected-attributes snippet exposes one line per radio group. The complete HTML download/code viewer remain the base configuration: users copy the selected advanced attributes onto the opening html tag. This limitation is explained in the panel and beside the source; CSS does not rewrite attributes or serialize current state into downloads.
- The customization panel is outside the preview's theme boundary. Its native details disclosure starts expanded and can be collapsed on mobile or desktop.
- The preview uses the shared TopMenu component. Complete base HTML downloads and the code viewer render the same MarketingSite component; downloads move base appearance attributes to `<html>`.
- The core supplies component surfaces/states. `docs/public/demos/marketing.css` supplies website composition. No core CSS or public API change is required.
- Contact controls deliberately omit names: browser validation works, but entered data is not transmitted. Production adaptations must supply names and a submission endpoint.

## Pending validation and next work

Automated tests and browser inspection are deferred at the user's request. Building the static pages is a compilation step, not a test pass or release-gate closure.

The next PC session must resume the outstanding desktop keyboard checks: Tab/Shift+Tab, Enter/Space, Escape and focus restoration at each nested menu level. Screen-reader, zoom/print and visual-baseline review remain outstanding. Existing iPhone checklist passes apply to the device-check fixtures, not automatically to this new demo.

Known existing component contracts also apply here: radio-selected panels retain native radio semantics; in-page navigation links do not automatically dismiss an open popover; nested focus restoration is browser-dependent. A reload caused by a configuration choice is intentional, not an instant JavaScript theme update.

After reviewing this marketing demo, build dashboard and settings/forms demos to cover remaining components in suitable contexts. Do not add every component to the marketing page merely for coverage.
