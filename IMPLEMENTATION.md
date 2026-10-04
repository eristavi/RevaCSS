# RevaCSS implementation record

## 1.0.0 — Erisian · 4 October 2026

The first public GitHub distribution includes compiled downloads, licenses, checksums, a native starter page, and recorded automated validation. The accepted component and Glass designs are preserved. The scrolling top-menu documentation example gains the existing named-region keyboard pattern. Automated expectations now reflect accepted materials, adaptive semantic roles, and the optional documentation helper. Six manual quality entries remain open. The maintainer subsequently authorized first npm publication with those limitations disclosed; the `1.0.0` exception is recorded in `quality/npm-publication-v1.0.0.json`. Earlier implementation entries below are historical evidence for their recorded revisions.

## Implemented
- Frozen specification, 19 core options plus the optional material manifest entry, MIT licence, pinned tooling and lockfile.
- DTCG token sources and generated variables; adaptive light/dark via CSS light-dark().
- Six tested accents, theme/tone independence and local presets.
- Native typography, buttons, native forms, tables, disclosures and overlay appearance.
- Cards, intrinsic grids, rows, stacks, container/prose widths and table scrolling.
- Responsive top navigation using shared link templates for desktop and mobile, native disclosure toggles, nested submenus, desktop dropdown panels and a mobile Menu control. Included in complete/scoped/component builds and a dedicated navigation module.
- Responsive image options, inherited control sizes/layout gaps/container widths/table styles, basic alignment/column helpers.
- Global, scoped and modular builds; optional licensed Manrope variable font (TTF in alpha).
- Reduced-motion, forced-colour, increased contrast, print and logical-direction rules.
- Static Astro documentation, Markdown guide, generated token/attribute reference and isolated previews.
- Public GitHub repository at https://github.com/eristavi/RevaCSS.
- GitHub Actions validation and Pages deployment workflow; deployment follows successful validation on main and requires Pages source to be set to GitHub Actions.
- Clean-build command, generated-file exclusions, and documentation link/asset checks at root and project paths.

## Verification
Initial foundation verification: build succeeded. Five Node checks and nine browser tests passed in Chromium 153.0.8010.0.
Automated axe A/AA checks passed on light/dark reference pages; colour checks passed across six accents in both modes.
Keyboard disclosure/native validation, 320px reflow, nested themes/tones, independent layout gaps, ordinary CSS overrides, scoped isolation, reduced motion and forced colours checked.
Minified CSS gzip: 3,889 bytes (budget 15 KiB). Generated docs contain no scripts or JS assets.
Desktop/light/dark/mobile screenshots inspected. This is not WCAG certification: manual screen-reader, zoom/text-spacing, printing and Firefox/Safari/Edge verification remain.

Housekeeping verification (2026-09-30): reproduced the missing `dist/fonts` clean-build failure, fixed directory creation, and rebuilt successfully without pre-existing output. Six Node checks passed with both `/` and `/RevaCSS/` documentation paths. All nine browser tests passed in Chromium 153.0.8010.0 using a local browser supplied through `REVA_CHROMIUM`. Direct Playwright browser downloads failed in the validation environment; local Firefox/WebKit results are pending. The suite and CI now define all three engines (27 test cases in total). Workflow YAML and deployment dependencies were checked. Real Safari/iOS, Edge, screen-reader, zoom/text-spacing and printing checks remain stable-release gates.

## Deferred to next milestones
Remaining component library (other navigation patterns, badges, alerts, segmented selectors, switchers, carousel), container-query-specific components, masonry experiment, multilingual font packs, optional SVG icons and full templates.
Development token tooling is basic validation, not yet a full DTCG schema validator or comprehensive custom-theme contrast tool. Current source uses tested accent stops; arbitrary custom palettes require explicit foreground/end/state tokens and checks.
Private package flag prevents premature npm publication. No npm alpha publication: the first fully functional release must include the agreed components and finish automated, manual accessibility and real-device testing before publication. Documentation is deployed at https://eristavi.github.io/RevaCSS/; main CI has passed Chromium, Firefox and WebKit foundation validation.

## Run locally
Node 22.12+ (Node 24 recommended).
`npm ci` → `npm run dev` for docs.
`npm run clean` removes generated CSS, docs, public asset copies and generated API-reference data; the next build restores them.
`npm run build` produces CSS and static docs.
`npm test` checks tokens/build output.
`npx playwright install --with-deps chromium firefox webkit` → `npm run test:browser` for all browser projects. Python 3 serves the built documentation.
`REVA_CHROMIUM=/path/to/chromium` optionally supplies an existing browser.
GitHub Pages workflow reads repository path from configure-pages, so project-site base paths are supported.

## Modules
Load reva.tokens.css, reva.base.css, then reva.components.css for modular use. Contrast and accessibility utilities are included in the components module; use complete reva.css for the simplest supported setup. Load only one of the global/scoped builds. Scoped boundaries do not isolate inheritance or third-party classes like a Shadow DOM would.

## Top menu component
A regular desktop list is visible at 48rem and wider; a separate native mobile disclosure is visible below that width. Shared static templates keep their links in sync; only the active layout enters keyboard and accessibility navigation. Each layout preserves its own submenu state. Deeper submenus expand inside the dropdown panel. Standard links and details/summary provide Tab, Enter and Space operation; Escape/outside-click dismissal and application-menu arrow-key controls are not part of this native disclosure version. Print hides the navigation. Clipping ancestors and breakpoint focus behavior are documented.

Ten new browser tests cover nested disclosures, closed-link focus exclusion, mobile reflow and target sizes, sibling groups, independent instances, resizing, bounded desktop panels, RTL, long labels, scoped isolation, both themes, user preferences and print. Navigation interactions run with JavaScript disabled. Chromium checks passed locally; the GitHub PR records final cross-browser CI results. Component documentation includes copyable HTML and three isolated theme previews.

## Optional glass material
Separate global and scoped glass stylesheets. `data-material=glass` selects supported frosted surfaces; `solid` creates a local reset. Shared attributes drive colour mode, tone, shape, density, text size, depth, decorative borders, fill and contrast. Inputs and semantic actions retain their core treatment. Reduced transparency, increased contrast, forced colours, unsupported backdrop filtering and print retain opaque fallbacks. Documentation includes light/dark/auto previews. Browser and composited-colour regression results are recorded in the implementation PR; manual real-device and screen-reader review remain release requirements.

## Page-wide defaults
All 19 core data attributes can configure defaults at the top level. Width, table, size, ratio, fit and gap now use inherited custom properties and affect their supported targets only. The nearest explicit value resets one setting without resetting the others. Table stripe colour resolves against the local theme/tone; gap multipliers use local density spacing. Scoped boundaries keep their own defaults and can be configured on .reva or inside it. Native HTML defaults and CSS override priority remain intact. Browser regression coverage includes page/section/component inheritance, neutral resets, local colour/density, scoped boundaries, modular builds and unconfigured defaults. Results are recorded in the implementation PR; manual release gates remain.

Shared-default consistency audit (2026-10-01): fixed hard-coded control/surface/navigation borders, table and small-code corners, inherited navigation sizing, surface shadows and video fit/ratio support. Table grid thickness now composes with the nearest border setting. Defaults, values and target coverage are published from the option manifest with light/dark palette tables. Browser coverage exercises shape/border/local overrides across global, scoped, modular and minified CSS, theme-only defaults, menu sizes, media options and native invalid-state precedence. No class aliases or npm publication.

Button refresh, step 1 (2026-10-01): solid buttons use gentler gradients, an edge highlight, balanced padding and medium-weight labels. Secondary actions inherit an accent tint with theme-aware text. Hover brightening is restrained; pressed buttons lose elevation, including native button/submit/reset inputs. Shared attributes, native disabled and keyboard focus remain in control. Glass buttons and animated edges are subsequent steps.

Glass buttons, step 2 (2026-10-01): the optional material now reaches buttons, .button links and native button/submit/reset inputs, including direct activation on one action within a solid page. Default 95% colour backing, a restrained gradient and a soft edge highlight preserve readable labels with blur. Primary and secondary colours follow inherited accents and themes; solid exceptions and matching scoped builds remain supported. Accessibility preferences use explicit opaque paint, forced colours use system button colours, printing uses black/white, and unsupported blur retains core variants. Animated edges remain a subsequent step.

Gradient edges, step 3 (2026-10-01): inherited data-edge plain/gradient/shine/animated decorates button, .button and .card borders without painting over translucent interiors. The default remains plain; an animated glass main action is explicitly selected. Shared shape, action/accent colours, border, motion and contrast settings remain independent. Reduced motion and disabled actions retain static edges; high contrast, forced colours and print remove decoration. Native input actions retain regular borders. CSS-only demos include local resets and matching global/minified/modular/scoped builds.

Glass transparency correction (2026-10-01): surface backing is reduced from 90% to 70%, with sheen reduced from 12% to 6%. Filled action backing is reduced from 95% to 90%, preserving all accent/role label contrast. Supporting text, body links and control boundaries use stronger colours within glass scopes; solid scopes restore the core palette. System preferences and unsupported-blur fallbacks remain opaque. Documentation and the showcase reflect the corrected defaults. Raster regression checks verify visible backdrop transmission and rendered blur; the reported animated-edge issue remains a separate next implementation.

Raster validation limitation: Firefox and WebKit headless captures currently omit the blur in both the framework sample and an independent plain CSS control. Pixel tests verify visible transmission in every engine, require matching native rendering, and enforce actual blur when the native control can paint it. Real-browser Firefox and Safari blur remain manual release checks; this is not counted as completed device validation.

Glass corner correction (2026-10-01): non-surface theme and tone wrappers inside supported glass scopes no longer paint an opaque rectangular background. Page roots, actual surfaces, solid resets and unsupported-blur fallbacks retain their existing paint. The local-reset documentation uses the inherited stack gap. Global/scoped raster tests check exposed rounded corners and gaps against the backdrop, plus solid resets and local glass re-entry; the documentation is checked at desktop and phone widths. Animated-edge investigation remains the next separate implementation.

Native navigation dismissal (2026-10-01): the documented top menu uses auto popovers and native popovertarget buttons for desktop dropdowns, nested submenus and the mobile menu. Outside clicks dismiss the affected popover branch; Escape closes one level. Panels include native hide buttons for Back/Close; desktop placement uses a unique navigation anchor with viewport fallbacks. A nested panel replaces its parent view to avoid overlapping hit targets at arbitrary depths. Legacy details styling remains for existing markup. Glass panels retain shared tokens and neutral navigation toggles. No browser JavaScript or npm publication. Regression coverage includes nested dismissal, keyboard focus, sibling stacks, layouts, viewport bounds, RTL, scoped styling, anchor-positioning fallback and accessibility checks.

Shared documentation menu (2026-10-01): all 26 documentation and preview page headers now render DocumentationHeader through the same configurable TopMenu and recursive TopMenuLinks component. One data source defines documentation destinations; component demos retain their own sample links in page content. The obsolete hard-coded DocumentationLinks component is removed. A single Theme popover offers native System/Light/Dark radio choices and applies color-scheme at html through CSS :has, keeping shared tokens, code highlighting and explicit local theme overrides. Choices are page-local and reset on navigation; no JavaScript or preference storage. Regression coverage checks every header, unique IDs/targets, theme behavior, native dismissal, local overrides, both layouts and accessibility.

Mobile panel placement now uses the navigation's anchor with a block-flip fallback instead of a fixed viewport offset. Centered panels remain the fallback without CSS anchor positioning. This keeps both the shared page header and lower component demos operable.

Component quality standard, step 1 (2026-10-01): added QUALITY_STANDARD.md, an explicit automated/manual release-blocker registry, mixed native HTML fixtures, and desired-behavior regressions for four long-content overflows and enlarged-root-text overflow on the buttons documentation. Known failures execute with Playwright expected-failure annotations; unexpected passes require review. The release-quality command remains nonzero until all blockers have evidence of resolution. Alpha documentation CI reports this status separately. Existing component CSS and designs remain unchanged. Actual zoom, real-device blur, screen-reader review and visual baselines are still open gates.


Quality CI installation correction (2026-10-01): a WebKit runner timed out before tests while downloading dependencies from azure.archive.ubuntu.com. Validation runners now use the official Ubuntu archive over HTTPS and bounded APT retry/network timeouts, preserving suites, components and signature settings. No framework dependencies or component styles changed.
