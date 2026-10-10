# Changelog

## Unreleased

## 1.2.1 — Erisian · 10 October 2026

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
