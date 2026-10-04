# RevaCSS 1.0 — Erisian

**Start with HTML. Set your defaults once.**

Erisian is the first public GitHub release of RevaCSS. Build consistent interfaces with native HTML, shared inherited settings, adaptive themes, and optional material extensions. The framework has no JavaScript runtime.

[![One RevaCSS project card in Light, Dark, Glass, and Veil.](https://raw.githubusercontent.com/eristavi/RevaCSS/v1.0.0/.github/assets/revacss-preview.png)](https://eristavi.github.io/RevaCSS/demos/marketing/)

## Downloads

- `revacss-1.0.0-erisian.zip` — complete compiled distribution and starter HTML.
- `revacss-1.0.0-erisian.tar.gz` — the same files in tar.gz format.
- `reva-1.0.0.min.css` — standalone complete minified core.
- `SHA256SUMS.txt` — SHA-256 checksums for the downloads.

Each archive includes global, minified, scoped, modular, and component CSS; optional Glass, Veil, motion, and select styles; SVG icons; the optional Manrope font; tokens; licenses; and release documentation.

Extract an archive and serve its `index.html` to see the starter page. Use `dist/reva.min.css` for a complete global setup, or choose the appropriate scoped/modular build. Fonts and extensions load separately.

## What is included

- Light, dark, and system themes, with eight coordinated palettes.
- 24 shared configuration options and 38 documented component contracts.
- Native forms, details/summary, radios, switches, popovers, dropdowns, drawers, and responsive navigation.
- Content patterns including cards, tables, metrics, SVG charts, timelines, calendars, and message threads.
- Optional frosted Glass and diffused Veil surfaces, shared decorative edges, and native-popover entrance motion.
- Four complete website demonstrations: marketing, dashboard, journal, and shop.

The current design patterns and Glass styling are preserved. This release adds keyboard access to the scrolling top-menu documentation sample and brings automated expectations into line with previously accepted design changes.

## Validation and known limits

The [validation record](https://github.com/eristavi/RevaCSS/blob/v1.0.0/quality/releases/v1.0.0.md) records the exact automated results and browser versions. The [quality registry](https://github.com/eristavi/RevaCSS/blob/v1.0.0/quality/blockers.json) retains six open manual items: focus recovery, the reported edge device, physical-device coverage, screen readers, actual zoom/print, and approved visual baselines. These items have not been marked passed by headless tests.

Native popover support is required by the documented overlay patterns. Nested Escape/Back focus restoration follows browser behavior. Radio-selected content retains radio semantics; application-menu arrow keys and modal-dialog focus management are outside the supplied CSS contract. Glass readability depends on the configured backdrop and colors; increased contrast and reduced-transparency fallbacks are documented.

An optional documentation settings helper remembers appearance choices and prepares demo downloads. The framework and exported starter HTML remain independent of that helper. Applications supply data, routing, form processing, live announcements, commerce, and other business behavior.

This is a GitHub distribution release. npm publication remains disabled, and the package stays private pending the recorded manual acceptance work. This release does not claim WCAG certification or completion of that work.

[Documentation](https://eristavi.github.io/RevaCSS/) · [Component reference](https://eristavi.github.io/RevaCSS/reference/components/) · [GitHub release](https://github.com/eristavi/RevaCSS/releases/tag/v1.0.0)
