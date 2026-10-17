# Changelog

## Unreleased

### Architectural foundations (compatible additions)

- Add local data-layout=container/grid/row/stack and data-surface=card hooks, equivalent to existing presentation classes across core, patterns and matching material extensions. Add data-reva presence boundaries to every scoped build; preserve existing classes and neutral structural elements.
- Declare the same ordered re.tokens/re.base/re.components/re.buttons/re.utilities layers in every generated entry point, including modular and optional files.
- Align package validation with the already selected documentation and optional server-side example files; continue rejecting browser runtime files.
- Establish ARCHITECTURE.md as the architectural decision contract. Generate complete public markup and inheritance audits for human and AI references, with explicit reset, dependency, compatibility and scope limits.


- Add a complete Classes API with all 72 framework class names, markup contracts, stylesheet dependencies, core/optional availability and compatibility notes. Share one catalog across the searchable human reference, generated AI Markdown and structured API; preserve a complete no-JavaScript reference.

- Exclude the navbar brand/home link from menu-item hover backgrounds, including the highlight shown during pointer presses. Preserve its native link and visible keyboard focus.

### Colorful backgrounds

- Add six customizer colour pickers shared by both colorful modes, saved preferences, background-only reset, CSS export/copy and script-free starting HTML. Expose --re-background-color-1 through -6 with accent fallbacks; preserve the 80% theme treatment and main palette independence.

- Add optional global/scoped background modules and data-background=default/colorful/colorful-animated for page or section paint. Blend all built-in accent start colours, mixed with 80% white in light mode or 80% black in dark mode; animated uses the same gradient and inherited motion. Keep theme, component surfaces and accepted hero gradients independent. Include customizer, native pause demo, preference fallbacks and documentation; browser acceptance remains pending.

### Hero and gradient effects

- Add optional semantic hero layouts and material/background gradients, with global and scoped modules. Text gradient effects and animations have been removed at the maintainer’s request; ordinary text follows theme colours.
- Animate the existing Glass sheen in place, preserving transparency, blur and the stationary backdrop. Other surfaces animate between 25% darker and 25% lighter primary shades in both themes, with adaptive on-primary text and optional background strength.
- Subtle/default motion takes 12 seconds per direction; expressive takes 6 seconds; none/reduced motion stays static. Provide native pause, contrast/transparency/print fallbacks and material/motion/fill demos following the customizer. Browser acceptance and full-cycle foreground contrast review remain pending.

### Native scrollbars

- Theme native scrollbar thumb/track colours at normal width by default. The thumb follows palette/data-accent primary colour exactly, matching the main button; the track uses the local surface. Add inherited data-scrollbar=auto/thin/native with local resets, nested-theme colour resolution and scoped defaults. Standard CSS only; preserve native high-contrast/print appearance, platform overlay behaviour and existing gutters. Add demos, documentation and customizer choices; browser acceptance for scrollbars is pending.

### Reading progress

- Add optional global/scoped reading-progress CSS extensions and local data-reading-progress=page/none. A decorative empty element tracks root page scroll with native timelines, inherited colour/motion, RTL fill and safe-area offset. Unsupported browsers, reduced motion, forced colours and print omit the bar. Add component/API guidance and a full-page demo; core size is unchanged and browser acceptance is deferred.

### Native forms

- Style native browser-autofilled fields by default with a theme-aware border using standard and WebKit autofill selectors. Preserve native background/text colours, suggestion UI, validation, focus and disabled/read-only states; add a saved-profile forms demo. Browser acceptance remains deferred.

- Make native textareas auto-grow by default using support-gated content sizing, the existing 7rem minimum and a 24rem maximum. No class is required. Application CSS can restore `field-sizing: fixed`; unsupported browsers keep normal manual resizing. Browser/device validation is deferred to the next release review.

### Tables

- Highlight native tbody rows by default; add local data-table-hover=row/cell/column/none. Retain stripes and sticky cell backgrounds beneath a theme-aware inset tint, real-control keyboard feedback and native focus. Column mode supports unmerged tables up to 32 columns, otherwise cell feedback; nested tables remain independent. Forced colours and print remove decoration. Browser validation is deferred.

- Add local data-table-sticky=none/header/column/both on a wrapper with a direct native table; no wrapper class is required. Preserve .table-scroll, native semantics, multi-row header groups, RTL-aware first-column pinning, opaque striped surfaces and print reset. Merged cells disable column pinning while retaining header mode. Browser validation is deferred.

### Scrollable panels

- Reserve stable classic-scrollbar space inside dialogs, popovers and the desktop app-shell sidebar, without adding global page gutters or changing overlay-scrollbar geometry. Preserve native fallback and application CSS opt-out; overlay gutters reset in print. The scrollable-panel demo uses an accessible, visually bare SVG X close control. Browser/device validation is deferred.

### Documentation

- Add native anchored help-panel examples with accessible SVG question-mark controls with visually bare surfaces across materials, ID-targeted application CSS, logical anchor positioning, edge-flip candidates, centred fallback, persistent essential hints and inherited effects. Preserve example CSS ID selectors in namespaced manual fixtures; browser acceptance remains deferred.

- Add native image-lightbox compositions using existing dialog/figure markup, responsive contained images, caption labels, accessible SVG X close controls with visually bare surfaces aligned to the logical end, image-file alternatives and inherited material/motion effects. No new CSS class or data attribute; browser acceptance remains deferred.

- Complete native modal invocation examples using commandfor/command, platform and light dismissal, form closing, inherited material/motion effects and local appearance resets. Prepare no-script browser coverage; acceptance remains deferred.

- Complete the human and generated AI stylesheet inventories with the existing card-grid, gallery, scrolling, scroll-top, scroll-motion and document-transition entry points, including their dependencies and scope limits.

- Record a repeatable AI guidance baseline with five generated interface scenarios, fourteen negative controls, prompts, fixture hashes and explicit evidence limits; expose the dated report in the human/AI guides.

- Add contributor instructions mapping changes to sources, generation steps, focused checks and release evidence; connect AGENTS.md, README, the human guide and AI references.

- Add a symptom-based troubleshooting guide for 13 interface issues, with inspection, fixes and verification steps in the human site, focused AI reference and offline package.

- Standardize seven-decision AI workflows across all five adapters; generate per-adapter references and structured package requirements, and add the Laravel human guide.

- Add a runnable project workspace connecting a dashboard, server-validated form, responsive native navigation and custom card to SQLite data, with complete source downloads and AI reference.

- Add ten incorrect/corrected AI examples with a dedicated guide page, focused generated Markdown reference and offline package documentation.
- Expand all 29 attribute contracts with supported targets, inheritance, local resets, dependencies and limitations. Generate the same guidance in AI Markdown, the structured API, HTML editor descriptions and the human reference.

Experimental demo work remains outside the 2.0 public CSS API:

- Effects Lab explores Aura, Spring lift and Layered depth, including a CSS/SVG mobile-tap prototype. Draft classes and separate demo stylesheets have no release commitment; prototype device acceptance is not inferred from core sign-off.
- Living Blueprint explores scroll-driven composition, intensity, zoom, direction, rotation and fade, with static and preference fallbacks. Its demo composition styles remain separate from the core.

## 2.0.0 — Erisian · 15 October 2026

Published on GitHub with verified core and separate adapter archives. npm and Packagist availability remain separate from GitHub publication. See [RELEASE_NOTES.md](RELEASE_NOTES.md), [MIGRATION.md](MIGRATION.md) and the [validation record](quality/releases/v2.0.0.md).

### Breaking change

- Keep Default and Mono as the built-in palettes. Remove twelve values shipped in 1.2.1; migrate existing palette selections to Default/Mono or a named custom CSS palette. Existing 1.2.1 distributions remain immutable.

### Appearance and native components

- Add Default (Manrope) and System font presets through inherited `data-font="manrope|system"`; retain optional self-hosted font assets, local resets and monospace code.
- Add custom light/dark palette editing and CSS export, with shared colour tokens and contrast feedback.
- Add custom shape settings for surface, field and action radiuses; custom density settings for surface padding, controls and content spacing; and Full/Custom page widths with independent navbar width.
- Add opt-in responsive wrappers, RTL refinements, native date/time/range/file/colour sizing, read-only/invalid/disabled states, focus-revealing visually hidden content and print utilities.
- Vertically centre plain disclosure labels and native markers within their existing minimum touch target. Share accordion content motion with plain disclosures and exclusive groups, using native HTML, feature-gated animation and preference fallbacks.
- Deprecate Veil while retaining its attributes and stylesheet exports for compatibility. Solid, Glass and Soft remain available.

### Optional integrations

- Add a Laravel 12/13 adapter and reference app: native Blade components, validation/previous-input handling, versioned assets, appearance settings, pagination, Livewire 3/4 examples and Boost guidance.
- Add typed native Astro components and global/scoped reference pages.
- Add typed Vue components with model bindings, control-attribute forwarding and associated form messages; reuse them in a Nuxt production/SSR reference app.
- Add typed React components with native ref props and form associations, plus React and Next.js reference apps.
- Add typed Svelte components with native value/element bindings and snippets, plus plain Svelte and SvelteKit production/SSR reference apps.
- Keep wrappers separate from core CSS. Prepare stable `2.0.0` JavaScript adapter tarballs and a `2.0.0` Composer ZIP, with export/content checks, byte-identical Laravel assets and checksums. Composer/npm adapter publication remains separate.

### Documentation and distribution

- Add a complete manual-test page with 39 component families, 139 live examples, native navigation, comprehensive fields/states, long/multilingual/RTL content, icons and appearance comparisons. Namespace fixture IDs, control targets and group names.
- Document custom-component contracts, palette migration, integration setup and application-owned behaviour. Keep copyable examples, generated references, starter files and download paths aligned.
- Use consistent accordion presentation in documentation/demo panels and customizers. Preserve shared appearance settings and correct documentation/starter links.
- Derive immutable release tags, filenames, archives and checksums from matching package metadata; track GitHub/npm availability separately.

### Acceptance and remaining release steps

- Record the combined three-engine automated review and Laravel/Livewire matrix with exact candidate SHAs; record the manual-test page's 21 targeted passes separately.
- Record Revaz Eristavi's 14 October manual acceptance: desktop Chrome/Safari/Firefox, iPhone Chrome/Safari and Android Chrome/Mozilla, with no known issues reported. Evidence limits remain explicit in the validation record.
- Complete the Nuxt-only dependency review. Two upstream build/dev advisories remain unpatched; the reviewed production output excludes their packages and named tooling references. Add a deployment-output assertion and default loopback development binding without changing dependency versions.
- All recorded quality blockers are resolved. The publication workflow passed the complete browser suites (544 Chromium, 543 Firefox plus one documented unsupported-feature skip, 544 WebKit), unit/package checks and stable adapter/Composer installation gates at the release commit.

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
