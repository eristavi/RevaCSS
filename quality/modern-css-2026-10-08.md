# Modern CSS implementation and validation

Implementation and examples were completed before testing began. These additions belong to the unreleased 1.1.0 development build; no npm release was made.

## Features and boundaries

1. Physical safe-area tokens default to `env(safe-area-inset-*, 0px)`. Full-height drawers and app-shell popovers use maximum normal/inset padding. Modal dialogs use the safe rectangle for positioning and bounds. Ordinary containers retain their spacing. The guide explains application-owned full-bleed surfaces and `viewport-fit=cover`; numeric simulations are not real-device certification.
2. `.card-grid` is a structural pattern with three native card regions. Subgrid aligns neighbouring regions. Footer container queries adapt a native action group to its own width. Containment is on the footer, not the subgridded card: an independent formatting context would prevent participation in subgrid. Independent grids are the fallback.
3. `.gallery` is a native, keyboard-reachable list with inline-axis proximity snapping, fragment navigation and all-items print output. No autoplay, selected-slide state, custom arrow controller or JavaScript.
4. `reva.scroll-motion.css` and its scoped variant enhance expressive cards with entry-range view timelines. Static, visible content is the fallback. Local motion boundaries, reduced motion, forced colours and print are respected. `reva.transitions.css` is an optional document-level same-origin navigation opt-in; it has no scoped build or router. Both destination documents must load it. Reduced motion disables snapshots; unsupported browsers navigate normally.

The complete/scoped core includes card grids and galleries. Optional animation extensions remain separate. Configuration uses inherited tokens and the existing motion attribute; no new framework configuration attributes or runtime scripts were introduced.

## Standards consulted

- https://www.w3.org/TR/css-env-1/#safe-area-insets
- https://webkit.org/blog/7929/designing-websites-for-iphone-x/
- https://www.w3.org/TR/css-grid-2/#subgrids
- https://www.w3.org/TR/css-contain-3/
- https://www.w3.org/TR/css-scroll-snap-1/
- https://www.w3.org/TR/scroll-animations-1/
- https://www.w3.org/TR/css-view-transitions-2/

## Validation

- Build: 483 pages, stylesheet parsing and minification passed.
- Unit checks: 60 passed, including gzip budget and documentation assets/links.
- Package checks: 4 passed, including installed exports, Vite and TypeScript; new distribution assets are required by the package checker.
- New feature browser cases: Chromium 9 passed; WebKit 9 passed; Firefox 8 passed and 1 skipped because cross-document CSS transitions are unavailable. Ordinary navigation is tested separately and passed on all engines.
- Chromium and WebKit verified actual scroll-progress changes and native cross-document snapshots, including their absence under reduced motion. Firefox verified the supported/static path selected by its feature checks.
- Existing drawer regression checks: 5 passed per engine, including scoped use, RTL, narrow widths, dismissal, print and forced colours.
- Existing settings cases passed across the selected runs and affected-case reruns. The CSS-only configuration assertion now activates its native disclosure by keyboard focus and Enter. Chromium's earlier pointer click did not settle; pointer-specific behaviour is not established by this keyboard check. No source-selection or appearance assertion was removed.
- The new guide passed narrow-screen layout checks and automated accessibility checks on all three engines. Accessibility and transition listeners were test instrumentation only; feature operation does not require application JavaScript. Browser fixtures use standards mode with a doctype.

Temporary browser launch configuration was needed for this environment. Chromium used an official Chrome headless-shell archive; Firefox used sandbox preferences; Linux WebKit used extracted host libraries. No repository browser timeouts were increased. Linux WebKit is not Safari on macOS/iPhone. Actual cutouts, orientation changes, mobile keyboard behaviour and assistive technology remain real-device/manual checks. The existing six manual quality blockers and prior broad WebKit navigation timeout are not resolved by this feature work.
