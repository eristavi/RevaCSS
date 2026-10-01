# Foundation alpha status

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
