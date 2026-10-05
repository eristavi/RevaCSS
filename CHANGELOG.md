# Changelog

## Unreleased

Next planned package release: **1.1.0** (backward-compatible additions). See [the versioning policy](VERSIONING.md).

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
