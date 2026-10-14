# RevaCSS 2.0.0 — Erisian release candidate

Native HTML, inherited design settings and a CSS-only framework core.

## Breaking change

Default and Mono are the built-in palettes. Twelve palette values shipped in 1.2.1 are removed from the core. Select Default/Mono or migrate those colours into a named custom palette; see [MIGRATION.md](MIGRATION.md). The major version reflects that public API change. Existing 1.2.1 downloads remain unchanged.

## Additions and fixes

- Font selection through `data-font="manrope|system"`, including local resets, native controls and the documentation/demo customizer. Manrope remains the default with optional font files; code remains monospace.
- Custom shape with separate surface, field and action radiuses; local presets retain their reset behaviour.
- Custom density with separate surface padding, control-padding scale and content spacing, preserving minimum control heights.
- Full and Custom page widths with configurable gutters and independent navbar width.
- Responsive wrappers, RTL refinements, native date/time sizing and print/accessibility utilities.
- Consistent accordion markup for documentation, demo panels, customizer sections and downloadable starter HTML.
- Correct documentation links and validation of optional customizer scripts and downloadable project assets.
- Version-derived release tags and filenames, explicit publication and immutable existing releases.

Veil is deprecated but retained for existing integrations. Experimental demo effects and decorative page gradients remain separate from core CSS. The optional customizer does not add a framework JavaScript runtime.

## Validation and publication

This is a candidate, not a published production release. Build, 38 unit/link checks and five installed-package checks pass. Browser coverage includes complete Firefox and WebKit sweeps and the complete Chromium sweep followed by a successful corrected code-viewer spec in all three engines. The [candidate validation record](quality/releases/v2.0.0.md) gives exact counts, revisions and limitations.

Fresh physical-device, screen-reader, actual zoom/text-spacing, print and visual review remains an explicit candidate gate. Publication stays blocked until applicable acceptance is complete. A successful documentation deployment does not close that gate.

When accepted, distributions use matching 2.0.0 core/extensions, a migration guide, starter HTML and checksums. GitHub and npm publication are recorded separately; versioned CDN availability follows verified registry publication.
