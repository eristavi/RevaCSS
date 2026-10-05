# Documentation cleanup validation

## Changes

- Complete dashboard, shop, blog and marketing source views use literal escaped text instead of thousands of syntax-highlight spans. Small component examples remain highlighted. Keyboard focus, scrolling, wrapping and source download equality are checked.
- Material stylesheets are loaded once by the shared documentation header. Standalone previews retain their own stylesheet links.
- The CSS-only customizer fallback is a shared, revisioned, minified `customizer.css` asset, loaded only with scripting disabled. It replaces approximately 57 KiB of inline CSS on each documentation page.
- The optional self-hosted Manrope font prefers WOFF2 (53,624 bytes) over TTF (164,700 bytes). The original fallback and license remain included. Glyph mappings and variable-font axes match.

## Measurements

Uncompressed generated HTML; earlier sizes rounded from the preceding audit. Element counts measured in Firefox with JavaScript enabled.

| Page | Earlier HTML | Current HTML | Earlier elements | Current elements |
| --- | ---: | ---: | ---: | ---: |
| Guide | 136 KiB | 81,197 bytes | 1,135 | 1,135 |
| Metrics | 135 KiB | 79,754 bytes | 1,121 | 1,121 |
| Dashboard | 407 KiB | 95,655 bytes | 5,581 | 991 |
| Shop | 259 KiB | 73,999 bytes | 3,058 | 740 |

The shared fallback is approximately 47.3 KiB and can be cached between pages. These measurements demonstrate transfer and DOM reductions; they do not establish an exact RAM reduction or resolve the earlier WebKit memory-retention observation.

## Validation

- Build: passed, 480 pages.
- Unit tests: 60 passed.
- Package tests: 4 passed, including installed exports and Vite font asset output.
- Firefox: all 18 selected customizer, source-viewer and documentation-navigation cases passed. An initial focus assertion used programmatic focus after a pointer click; the test now navigates by keyboard, and all six source-viewer cases passed on rerun.
- Installed-package browser checks: Firefox and WebKit both passed with scripting disabled, including font loading, global/scoped styles, dialogs and disclosures.
- WebKit: 15 of 18 selected checks passed, including source-viewer, material-update, backdrop, submenu-dismissal and accessibility checks. Three no-JavaScript navigation checks timed out: the broad documentation/preview sweep (60-second limit, also observed in the preceding audit) and desktop/phone theme-navigation checks (30-second limits). These results remain unresolved; they are not a clean browser-suite pass.
- The two theme-navigation checks passed on an isolated rerun with a temporary 60-second test allowance and unchanged assertions (29.9 seconds desktop, 29.3 seconds phone). A comparison against the preceding commit passed desktop in 29.7 seconds and timed out on phone at 31.9 seconds. This establishes functional passes for 17 unique selected WebKit cases; the broad navigation sweep remains unresolved. No repository timeout or assertion was changed.

Browser runs used temporary environment-specific launch configuration: Firefox sandbox preferences and locally extracted WebKit host libraries. WebKit is the Linux Playwright build, not a real Safari device. The six existing manual quality blockers remain open. No npm release was made by this cleanup.
