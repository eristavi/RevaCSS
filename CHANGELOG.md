# Changelog

## Unreleased

- Use the existing accordion structure for documentation and demo content disclosures, source panels, customizer groups and the mobile documentation browser. Centre summary labels with the framework’s existing rules and retain native open/close behaviour. Shared demo components also update downloadable HTML. Core CSS, navigation disclosures and intentionally plain native disclosure examples are unchanged. Build verification only; browser/device tests remain deferred.

- Add Full and Custom page widths. Full fills the parent with side padding; Custom configures maximum width including padding and per-side padding. Cap padding in narrow containers, reset local width presets, preserve separate navbar-width behavior, align full-navbar content and update the dashboard container. Add saved custom-width controls with numeric/range entry, CSS copy/export and self-contained HTML downloads. Browser/device tests remain deferred.

- Add Custom density with separate base surface padding, control-padding multiplier and content spacing. Existing density presets reset all groups; surface hooks consume a dedicated padding token with the existing spacing fallback. Preserve minimum control heights and safe-area padding. Add linked/independent sliders and numeric inputs, saved choices, CSS copy/export and self-contained HTML downloads in the optional editor. Browser/device tests remain deferred.

- Add Custom shape with separate surface, field and action radius tokens. Keep existing presets and local resets; let styled text fields consume the field radius with a surface-radius fallback. Add linked/independent sliders and numeric inputs, shared saved settings, CSS copy/export and self-contained HTML downloads in the optional editor. Core output remains CSS-only; browser/device tests remain deferred.

- Simplify built-in palettes to Default and Mono. Remove the other 12 experimental palettes from tokens, generated global/scoped/modular CSS and current examples/controls. This is an intentional breaking source-preview change: migrate removed names to Default, Mono or a custom CSS palette. Published 1.2.1 downloads remain unchanged.
- Deprecate Veil for surfaces and buttons. Retain its stylesheet exports and attribute values for existing interfaces, label the compatibility option, and recommend Solid, Glass or Soft UI for new work.

- Revise the Effects Lab iOS tap prototype to use a native card-sized button as the SVG click source and a direct SVG-to-card sibling selector. Keep links above the preview target and hide the target for desktop hover. Remove the animated descendant-class `:has()` dependency. No JavaScript or inline event hooks are added; real iOS verification remains pending.

- Change Effects Lab mobile previews to normal card taps. Native SVG click timing holds each preview for 1.6 seconds so the same CSS glow, lift and depth response as desktop hover can complete, then animate back automatically. Remove press/release timing and its faster entrance; keep desktop hover, native links and preference fallbacks. No JavaScript or inline event hooks are added. Real-device verification remains pending.

- Prototype direct card contact in Effects Lab using declarative SVG `set` timing and CSS, with no JavaScript or inline event hooks. Native pointer/touch events activate a small SVG class marker; release and cancellation restore it. Remove separate press buttons, preserve desktop hover and ordinary link actions, and retain motion/preferences fallbacks. iPhone and other real-device verification remains pending; this replaces the button-based touch prototype and is not a released framework API.

- Replace the Effects Lab's persistent preview switch with individual native press-and-hold buttons. Touch uses the same glow, lift and depth targets as hover, with a fast entrance and slower return on release. Stationary controls stay outside moving cards, normal links retain their actions, and visible keyboard focus avoids retaining touch focus after release. Core files remain unchanged; browser/device acceptance checks remain deferred.

- Add Effects Lab, a demo-only CSS showcase for Aura, Spring lift and Layered depth, with resting comparisons, a combined study, keyboard-focus responses and a native touch-preview switch. Include matching downloadable HTML, separate effect/composition stylesheets, palette/material customisation and conservative preference fallbacks. Mark all three effects as future-release candidates without a release commitment; core styling and package archives remain unchanged. Browser, device and accessibility acceptance checks remain deferred.

- Document the custom-component extension contract, public token usage, local overrides, custom palettes, material hooks and application responsibilities. Add an HTML/CSS-only project-summary starter, live documentation examples, downloadable files and generated AI reference. Core styling and published archives remain unchanged; browser, device and accessibility acceptance checks for this addition are deferred.

- Clarify Living Blueprint's static fallback when required scroll animation features are unavailable, including default Firefox settings. Show intensity controls only when the assembly can animate, check named view timeline support, and use a nonzero scroll animation duration for compatible Firefox implementations. Core styles remain unchanged; browser tests remain deferred.

- Add Living Blueprint, an original demo-only scroll composition with inherited class-based movement, ten intensity and zoom levels, eight directions, rotation, fade and phased assembly. Include a quieter depth example, native intensity controls, downloadable HTML and responsive/preference fallbacks. Effects and composition CSS are isolated from the core; browser and device tests remain deferred.

- Normalize native date/time field appearance and box sizing to address iOS padded-field overflow; preserve empty-field line height, RTL alignment and browser pickers. Regenerate global, scoped and modular stylesheets. Device testing remains deferred.

Compatible additions and refinements; source and documentation preview only. Tests are deferred by maintainer request. Published 1.2.1 GitHub/npm packages remain unchanged.

- Add opt-in `.responsive` container wrappers for fixed-column grids, narrow card actions, toolbars and navigation rails. Existing intrinsic layouts and viewport fallbacks remain available.
- Correct RTL disclosure chevrons in accordions, sidebar navigation and top menus; mirror breadcrumb separators using semantic `dir` inheritance.
- Refine explicit read-only fields, invalid-field focus and disabled fieldset legends. Preserve native validation and provide complete required/error/disabled-group examples.
- Improve native range, file, colour and date/time field sizing without replacing browser pickers or controls.
- Add `.visually-hidden` with keyboard-focus reveal and clearer disabled/file controls in forced colours.
- Expand print pagination, repeated table headers, wrapping code, natural media ratios and opt-in `.print-only`, `.no-print` and `.print-links` utilities.
- Document new contracts and examples; regenerate global, scoped, modular and AI references. Build compilation is separate from deferred tests.

## 1.2.1 — Erisian · 10 October 2026

- Patch two transitive build dependencies for the cache-response disclosure and source-map denial-of-service advisories; a clean audit reports no vulnerabilities.

- Retain all 14 palettes in the standalone core with a disclosed 17 KiB gzip cap (previously 15 KiB). Keep the automated size gate enforced.
- Restore the script-free customizer stylesheet on standalone preview pages and contain the navbar sizing reference in a labelled keyboard-scrollable table.

- Keep mobile demo headers compact: place Customize before Menu, move mobile Docs access into Customize and use existing mobile navigation for demo calls to action. Mobile Flush removes all navbar rounding; desktop Full width uses square corners. Core, app-shell, scoped and modular builds share the corner rules.

- Keep Flush navigation free of top borders and decorative surface shadows, highlights and gradients across solid, Glass, Veil and Soft UI menus and app-shell headers. Spaced restores the material finish; detached menus keep their own surfaces.

- Give navbar layout, position, spacing and width their own Navbar category in the shared documentation/demo customizer; keep general layout controls together.

- Remove the extra documentation-header divider. Flush navbar spacing now squares the top corners of menus and app-shell headers while preserving the shared lower-corner shape; Spaced restores all corners.

- Add independent flush/spaced navbar spacing and contained/full width, with page-aligned full-width contents. Demo pages now use a single demo navbar with Docs and the shared Customize control; documentation and demos share one saved profile with migration of previous settings.

- Add independent `data-navbar-position="static|sticky"` with an outer `.navbar-header` wrapper, standalone menu/app-shell support, safe-area and stacking settings, anchor/focus clearance and print handling. Documentation and demos start sticky, share a saved position control, and use optional header-size observation to keep stacked preview bars and sidebars clear.

- Add Terracotta, Burgundy, Copper, Rose, Aubergine and Slate palettes, each with complete light/dark tokens, generated global/minified/scoped/modular CSS, shared customizer choices and documentation examples.

- Preserve navigation toggles and dropdown controls when selecting a button material. Liquid now uses transparent neutral glass, without accent or semantic tint, and neutral opaque accessibility fallbacks.
- Guard semantic action scopes during material changes so Firefox does not temporarily paint an unrelated action with a neighbouring variant.
- Initialize the page-defaults preview customizer from its actual page settings, preserving inherited size, width and spacing in both script-enabled and CSS-only previews.

This release includes the compatible 1.2 additions and subsequent refinements; version **1.2.1** was selected by the maintainer.

- Optional inherited `data-button-material`: default, solid, glass, veil, soft and liquid, with global/scoped stylesheets, liquid press/rebound motion, numeric customization and preference fallbacks.
- Button material guide, live examples, references and shared documentation/demo customization.

- Isolated documentation previews follow saved page appearance settings and live Customize changes, including material styles, without replacing their content or resetting native controls.
- Documentation homepage: the introductory card and action inherit the configured page theme, accent and shape instead of forcing light/teal settings. Release-status text now reflects the 1.1.0 maintainer sign-off.

## 1.1.0 — Erisian · 9 October 2026

Backward-compatible additions; see [the versioning policy](VERSIONING.md).

- Motion-aware native fragment scrolling, expressive destination emphasis and an accessible `.scroll-top` link, with local scroll-container overrides and preference handling.
- Optional overlay motion now includes dialogs, edge-directed drawers, RTL and discrete exits/backdrop fades where supported.
- Shop product views demonstrate native scroll snap; marketing pricing demonstrates subgrid; blog pages opt into document transitions. Updated motion/state-feedback guides and component/token references.

- Viewport-safe drawer/app-shell spacing and modal bounds with inherited safe-area tokens.
- Container-responsive three-region card grids with subgrid enhancement and a native scroll-snap gallery; core and modular stylesheets.
- Optional global/scoped scroll-driven card entrances and document-level same-origin view transitions, with reduced-motion handling and readable fallbacks.
- Modern CSS guide with use cases, numeric configuration, standard references and live examples.

- Documentation cleanup: shared minified CSS-only customizer stylesheet, one material stylesheet link per page, and plain selectable complete-demo source views while short component examples retain highlighting.
- Optional self-hosted Manrope font prefers a 52 KiB WOFF2 asset; the existing TTF remains available as a fallback.

- Optional Soft UI material via inherited `data-material="soft"`, with raised surfaces, inset text controls and pressed actions.
- Global and scoped extensions, light/dark examples, and integration with the shared persistent demo customizer.
- Shared navigation Customize control on GitHub Pages replaces the separate theme menu and demo launcher; grouped settings, centred responsive popup, configuration copy and reset, with independent documentation/demo preferences.
- Material changes invalidate loaded extension styles immediately, fixing Firefox surfaces that previously updated only after hover or refresh. CSS-only customizer rules now run only without JavaScript.
- Documentation backgrounds use subtle gradients derived from the selected palette, with plain backgrounds for increased contrast, forced colours and print.


## 1.0.0 — Erisian · 4 October 2026

The first public GitHub release of RevaCSS, with compiled assets and a native HTML starter page.

- A native HTML/CSS foundation with shared inherited settings, low specificity, cascade layers, and ordinary CSS overrides.
- Light, dark, and system themes; eight coordinated palettes; 24 documented settings.
- 38 component contracts covering foundations, forms, navigation, disclosure, feedback, content, and identity.
- Global, minified, scoped, modular, and dedicated component stylesheets.
- Optional Glass, Veil, popover motion, and native-select enhancements.
- 36 outline SVG icons and the separately loaded Manrope font, with their licenses included.
- Marketing, dashboard, blog, and shop demonstrations with downloadable starting HTML.
- Keyboard access for the horizontally scrolling navbar-inheritance example, using the existing named-region pattern.
- Browser expectations aligned with the accepted Glass refinement, adaptive semantic foregrounds, and optional documentation settings helper. Native operation is still tested with JavaScript disabled.
- Versioned ZIP and tar.gz distributions, a standalone minified core, and SHA-256 checksums.

The current component design and Glass styling are preserved. npm publication stays disabled. Six manual quality items remain open; see [release notes](RELEASE_NOTES.md) and the [validation record](quality/releases/v1.0.0.md).
