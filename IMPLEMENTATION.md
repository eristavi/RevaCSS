# Foundation alpha status

## Implemented
- Frozen specification, 18-option manifest, MIT licence, pinned tooling and lockfile.
- DTCG token sources and generated variables; adaptive light/dark via CSS light-dark().
- Six tested accents, theme/tone independence and local presets.
- Native typography, buttons, native forms, tables, disclosures and overlay appearance.
- Cards, intrinsic grids, rows, stacks, container/prose widths and table scrolling.
- Responsive image options, local sizes/gaps, basic alignment/column helpers.
- Global, scoped and modular builds; optional licensed Manrope variable font (TTF in alpha).
- Reduced-motion, forced-colour, increased contrast, print and logical-direction rules.
- Static Astro documentation, Markdown guide, generated token/attribute reference and isolated previews.
- GitHub Pages build/deploy workflow; no deployed site or remote repository yet.

## Verification
Build succeeded. Five Node checks and nine browser tests passed in Chromium 153.0.8010.0.
Automated axe A/AA checks passed on light/dark reference pages; colour checks passed across six accents in both modes.
Keyboard disclosure/native validation, 320px reflow, nested themes/tones, independent layout gaps, ordinary CSS overrides, scoped isolation, reduced motion and forced colours checked.
Minified CSS gzip: 3,889 bytes (budget 15 KiB). Generated docs contain no scripts or JS assets.
Desktop/light/dark/mobile screenshots inspected. This is not WCAG certification: manual screen-reader, zoom/text-spacing, printing and Firefox/Safari/Edge verification remain.

## Deferred to next milestones
Full component library (navigation patterns, badges, alerts, segmented selectors, switchers, carousel), container-query-specific components, masonry experiment, glass extension, multilingual font packs, optional SVG icons and full templates.
Development token tooling is basic validation, not yet a full DTCG schema validator or comprehensive custom-theme contrast tool. Current source uses tested accent stops; arbitrary custom palettes require explicit foreground/end/state tokens and checks.
Private package flag prevents premature npm publication. GitHub/npm/CDN publication awaits repository setup and a release review.

## Run locally
Node 22.12+ (Node 24 recommended).
`npm ci` → `npm run dev` for docs.
`npm run build` produces CSS and static docs.
`npm test` checks tokens/build output.
`npx playwright install chromium` → `npm run test:browser` for browser checks.
`REVA_CHROMIUM=/path/to/chromium` optionally supplies an existing browser.
GitHub Pages workflow reads repository path from configure-pages, so project-site base paths are supported.

## Modules
Load reva.tokens.css, reva.base.css, then reva.components.css for modular use. Contrast and accessibility utilities are included in the components module; use complete reva.css for the simplest supported setup. Load only one of the global/scoped builds. Scoped boundaries do not isolate inheritance or third-party classes like a Shadow DOM would.
