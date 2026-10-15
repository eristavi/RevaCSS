# RevaCSS 2.0.0 — Erisian

GitHub release: 15 October 2026. npm and Packagist availability are separate from these GitHub downloads.

RevaCSS 2.0 combines native HTML components, inherited appearance settings and
optional framework integrations around a CSS-only core. Compiled CSS needs no
build step; application behaviour belongs to the consuming application.

## Breaking change: built-in palettes

**Default and Mono are the built-in palettes.** Twelve palette values shipped
in 1.2.1 are removed. Select Default/Mono or preserve those colours in a named
custom CSS palette using [MIGRATION.md](MIGRATION.md). Action accent presets
remain available. Existing 1.2.1 packages and downloads are unchanged.

## Appearance and native components

- Default (Manrope) and System font presets through `data-font="manrope|system"`, with local resets, optional self-hosted fonts and monospace code.
- Custom light/dark palettes with shared colour tokens and CSS export.
- Custom surface/field/action radiuses, surface/control/content density and Full/Custom page widths; local presets retain their reset behaviour.
- Responsive wrappers, RTL refinements, native input sizing/states, focus-revealing visually hidden content and print utilities.
- Balanced native disclosure label/marker spacing and shared accordion content motion for plain disclosures and exclusive groups. Native open state, keyboard behaviour, usable unsupported-browser fallbacks and reduced-motion handling are retained without JavaScript.

Veil is deprecated but retained for compatibility. Decorative page gradients and
experimental Effects Lab/Living Blueprint compositions remain separate from the
core; draft demo effects are not a new 2.0 public component API.

## Optional framework integrations

| Framework | Integration included in the repository |
| --- | --- |
| Laravel 12/13 | Blade components, validation/previous-input handling, versioned CSS assets, appearance settings, pagination, Livewire 3/4 examples and Boost guidance |
| Astro | Typed native components and global/scoped reference pages |
| Vue / Nuxt | Typed native Vue components and model bindings; Nuxt production/SSR reference using the same adapter |
| React / Next.js | Typed native React components, native ref props and form associations; React and Next.js references |
| Svelte / SvelteKit | Typed native Svelte components, value/element bindings and snippets; plain Svelte and SvelteKit production/SSR references |

Wrappers are optional and distributed separately from the core CSS package.
Nuxt, Next.js and SvelteKit use the corresponding existing adapters rather than
additional RevaCSS runtime layers. Nuxt/Svelte/React/Vue applications retain their
framework's normal JavaScript runtime; the RevaCSS core remains CSS-only.

All four JavaScript adapter manifests now use stable `2.0.0` metadata. The
Laravel Composer ZIP also declares `2.0.0` and supports artifact-repository
installation. Registry/Packagist publication has not occurred. The final release
workflow prepares and verifies separate adapter archives and checksums; stable
version metadata does not imply registry availability.

## Documentation and review

The complete manual-test page includes 39 component families and 139 live
examples, comprehensive forms, long/multilingual/RTL content, icons, appearance
comparisons and a review template. Fixture IDs and control/group references are
independent. Guides cover migration, custom components and all integrations.

The [validation record](quality/releases/v2.0.0.md) contains exact revisions,
results and evidence limits:

- Complete publication browser sweep: 544 Chromium passes, 543 Firefox passes with one unsupported-instrumentation skip, and 544 WebKit passes. All build, unit, installed-package, adapter archive and fresh Composer installation gates passed.
- Requested Astro/Vue/React/Svelte/SvelteKit/Nuxt browser fixtures passed in all three engines; all four Laravel/Livewire combinations passed.
- Complete manual-test page: 21 targeted passes, with no skips.
- Revaz Eristavi reported all manual tests passed on 14 October: desktop Chrome/Safari/Firefox, iPhone Chrome/Safari and Android Chrome/Mozilla, with no known issues. Exact versions and per-check evidence limits are recorded; this is maintainer attestation rather than accessibility certification.
- Nuxt-only type/build/live-server checks and production-output review passed. Two upstream build/dev advisories were unpatched at the recorded 14 October review; the reviewed `.output` contains neither affected package nor named references to their tooling chains. This is a scoped review, not a clean-audit claim; see [the Nuxt dependency review](https://github.com/eristavi/RevaCSS/blob/main/examples/nuxt/DEPENDENCY_REVIEW.md).

All recorded quality blockers are resolved. The complete publication workflow
passed at `6c686709f2c21f415c5ac9bb760643f68172ad11`, including the latest native
disclosure changes and stable adapter archives. The validation record retains
earlier results with their exact tested revisions and evidence limits.

## Publication and distributions

GitHub distributions contain matching 2.0.0 stylesheets/extensions,
optional fonts, migration guidance, starters and checksums. The publication
workflow verified generated bytes, installed packages, browser behaviour and
archives before creating the immutable tag and downloads. GitHub downloads, npm
packages and versioned CDN availability are verified and recorded separately.

Automated validation: https://github.com/eristavi/RevaCSS/actions/runs/38686955484
