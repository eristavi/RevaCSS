# Marketing website demo

First complete website demo: `/demos/marketing/`. The fictional Forma workspace product gives navigation, cards, icons, lists, badges, avatars, radio-selected panels, pricing previews, accordions and native forms a purpose within one website.

## Configuration and source

- Parent settings: theme, palette, material and shape; default Light / Mono / Solid / Rounded.
- All 112 combinations are static routes. Native links preserve the other three choices; switching reloads the page and resets transient controls.
- The customization panel is outside the preview's theme boundary. Its native details disclosure starts expanded and can be collapsed on mobile or desktop.
- The preview uses the shared TopMenu component. Complete downloadable HTML and the code viewer render the same MarketingSite component; downloads move appearance attributes to `<html>`.
- The core supplies component surfaces/states. `docs/public/demos/marketing.css` supplies website composition. No core CSS or public API change is required.
- Contact controls deliberately omit names: browser validation works, but entered data is not transmitted. Production adaptations must supply names and a submission endpoint.

## Pending validation and next work

Automated tests and browser inspection are deferred at the user's request. Building the static pages is a compilation step, not a test pass or release-gate closure.

The next PC session must resume the outstanding desktop keyboard checks: Tab/Shift+Tab, Enter/Space, Escape and focus restoration at each nested menu level. Screen-reader, zoom/print and visual-baseline review remain outstanding. Existing iPhone checklist passes apply to the device-check fixtures, not automatically to this new demo.

Known existing component contracts also apply here: radio-selected panels retain native radio semantics; in-page navigation links do not automatically dismiss an open popover; nested focus restoration is browser-dependent. A reload caused by a configuration choice is intentional, not an instant JavaScript theme update.

After reviewing this marketing demo, build dashboard and settings/forms demos to cover remaining components in suitable contexts. Do not add every component to the marketing page merely for coverage.
