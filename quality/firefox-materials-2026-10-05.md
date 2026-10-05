# Firefox live material update check

Date: 5 October 2026. Browser: Playwright Firefox 155.0 on Linux.

## Reproduction

On a documentation page, changing the root material updated the HTML attribute
but retained the previous card background, shadow and backdrop filter. Theme,
palette and shape updated normally. Invalidating the loaded material stylesheets
immediately applied the selected material without hover or navigation.

## Change

The optional documentation settings helper toggles the enabled state of loaded
Glass, Veil and Soft stylesheets when the root material changes. This invalidates
stale scope matches without replacing content or fetching stylesheets. The
checked-option CSS preview now runs only when JavaScript is disabled.

Documentation pages also have a subtle, palette-derived background gradient.
Increased contrast, forced colours and print remove this decoration.

## Validation

- Documentation build: 480 pages passed.
- Unit checks: 60 passed.
- Firefox settings and documentation-menu suites: all 12 unique cases passed.
  The first run passed 11 cases; the CSS-only snippet case inspected a collapsed
  disclosure. Its test now opens the disclosure before checking visibility, and
  the corrected case passed on rerun.
- New regression checks compare immediate material appearance with a fresh
  page for Glass, Soft, Veil and Solid in both light and dark themes, without
  hovering the tested surface. Reset restores its initial appearance.
- Palette-driven backdrop changes and increased-contrast fallback passed.
- Existing native no-JS checks, desktop/phone navigation, automated accessibility,
  persistence, storage failure handling and configured downloads passed.
- JavaScript syntax and patch whitespace checks passed.

The local browser used sandbox-level overrides required by the execution
container. Chromium, WebKit, real devices and manual screen-reader acceptance
were not rerun for this change. Existing release-quality blockers remain open.
