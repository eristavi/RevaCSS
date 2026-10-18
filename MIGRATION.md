# Migrating to RevaCSS 2.0

Version 2.0 keeps the HTML/CSS-first API, native browser behaviour, zero JavaScript core, shared appearance attributes and existing stylesheet paths. It is a major release because twelve previously shipped palette values are removed from the built-in palette set.

## Palette changes

Default and Mono remain built in. The removed values are `sand`, `ocean`, `cobalt`, `citrus`, `violet`, `forest`, `terracotta`, `burgundy`, `copper`, `rose`, `aubergine` and `slate`.

For each removed `data-palette` value, either select `default` or `mono`, or supply a named custom palette in an application stylesheet. An unknown palette value has no built-in effect; it may therefore leave an inherited palette active rather than preserve the old colours. Review nested palette boundaries as well as the page root.

To preserve a 1.2.1 palette exactly, take its light/dark values from the [1.2.1 palette manifest](https://github.com/eristavi/RevaCSS/blob/v1.2.1/tokens/palettes.json). Define the same token keys with `light-dark()` inside `@layer re.tokens`, using your named `data-palette` selector. Keep `--re-palette-muted`, `--re-palette-link` and `--re-palette-control-line` aliases alongside their corresponding tokens so optional materials can reset correctly. Load this stylesheet after RevaCSS. The customizer's palette export provides the supported structure; replace its values and name as needed.

Palette migration does not remove `data-accent` choices. For example, `data-accent="violet"` remains an action-colour preset even though `data-palette="violet"` is no longer a built-in complete palette.

## Compatible additions

### Unreleased source distributions

Existing `reva.css` / `reva.scoped.css` consumers do not need to migrate. To opt into the new global semantic foundation, load `reva.semantic.css` and your own CSS. To retain the complete core class vocabulary, add `reva.patterns.css` after it; do not also load `reva.css`. Use matching semantic optional extensions for a classless installation, or existing complete extensions when using patterns. The split scoped path uses `data-reva`, `reva.semantic.scoped.css` and optional `reva.patterns.scoped.css`; each nested boundary starts fresh.

The customizer's project starter captures shared presets and custom values without its scripts. Its stylesheet paths expect a matching local `dist/` folder. Source outputs remain unavailable in published 2.0.0. This addition does not rename or remove any released class or attribute.

- Default (Manrope) and System font presets are available through `data-font="manrope|system"`; self-hosted fonts remain optional.
- Custom palette editing exports ordinary CSS; palettes remain an application stylesheet rather than a core JavaScript runtime.
- Custom shape separates surface, field and action radiuses.
- Custom density separates surface padding, control-padding scale and content spacing.
- Full and Custom page widths retain independent navbar width.
- Responsive wrappers, RTL refinements, native-input corrections and print/accessibility utilities are additive.

Plain disclosures and exclusive `details` groups now share accordion content motion where the required CSS features are available. Use inherited `data-motion="none"` for immediate toggling; reduced-motion preferences also disable transitions. An `.accordion` wrapper supplies group layout and the rotating chevron; plain summaries retain their native marker.

Optional Laravel, Astro, Vue/Nuxt, React/Next.js and Svelte/SvelteKit adapters/reference apps are separate from the core CSS package. Stable `2.0.0` adapter tarballs and the Laravel Composer ZIP are prepared. Install from the local artifacts before publication; npm/Packagist availability is not implied by stable metadata.

Existing shape, density and width presets remain available and reset their own setting locally. Veil is deprecated, with its attributes and stylesheets retained for existing integrations.

## Distribution and backgrounds

Use matching core and optional extension files from the same release. Framework pages retain plain light/dark backgrounds through `--re-bg`; decorative documentation and demo backgrounds stay in their own stylesheets. The optional customizer remains separate from the framework runtime. Downloaded demo HTML requires the linked composition CSS; production application behaviour remains application-owned.

Check your native controls, local overrides, colour contrast and supported browsers before upgrading. Published 1.2.1 archives remain available and unchanged.

## Unreleased architectural additions

Current source adds local data-layout=container/grid/row/stack, data-surface=card and data-reva presence boundaries. They are not available in published 2.0.0. No existing class is removed or deprecated by this addition, and native structural elements remain neutral. A compatible future release can adopt these hooks incrementally; use matching rebuilt core and scoped material extensions. Choose a single layout hook per element, and put layout/surface targets below the scoped boundary. See [ARCHITECTURE.md](ARCHITECTURE.md) for separation of width, surface, scope and semantics.

Every generated CSS entry point now declares the established layer order, including re.buttons before re.utilities. This fixes load-order-dependent precedence for modular/extension consumers; review applications that relied on the previous accidental first-appearance order. The supported installation still loads core before extensions. Unlayered ordinary application overrides remain stronger than normal layered framework rules. Existing invalid material-boundary behaviour remains documented; invalid values are not reset APIs.
