# Building custom components

RevaCSS supplies shared appearance settings. Your application can add its own components using native HTML, documented theme tokens and existing component hooks. A custom component is application code; it does not need to become a framework module.

This contract describes how to extend the current API. The starter is a documentation example, not a new core component or a completed accessibility acceptance record. Browser and device checks for this addition remain deferred.

## The extension contract

1. **Use native structure and behaviour.** Choose headings, lists, links, forms, buttons and details/summary according to their purpose. A class supplies styling, not keyboard behaviour or an accessible name.
2. **Inherit appearance.** Put shared settings on `html` or a parent section. Do not install a new palette or repeat the theme on every instance unless that instance needs an explicit exception.
3. **Consume documented tokens.** Use text tokens for text, surface tokens for surfaces and matching foreground tokens for filled actions. Avoid hardcoded light/dark colours in reusable component CSS.
4. **Reuse a surface hook when it fits.** Extend `.card` for a card-like component. Keep its surface, border, radius and shadow rules intact to retain supported materials and preference fallbacks.
5. **Keep extensions local.** Name application classes and custom properties for their purpose, such as `.project-summary` and `--project-summary-title-size`. Do not add undocumented `data-*` options or redefine the framework's API for one component.
6. **Preserve usability.** Let content wrap and controls remain native. Keep visible focus, meaningful labels and state text. Document application-owned behaviour and validate applicable acceptance gates before claiming production readiness.

## Tokens to use

| Purpose | Tokens | Usage |
| --- | --- | --- |
| Page and surfaces | `--re-bg`, `--re-surface`, `--re-surface-alt` | Choose by semantic purpose. Reuse `.card` when you need material support. |
| Text and links | `--re-text`, `--re-muted`, `--re-link` | Supporting text uses muted; links use link. Let native links retain their focus styling. |
| Boundaries | `--re-line`, `--re-control-line` | Surface separation and interactive-control boundaries are different roles. |
| Primary action | `--re-primary`, `--re-primary-end`, `--re-on-primary` | Replace the two fill stops and readable foreground together. Prefer the existing native button styling. |
| Status fills | `--re-success`, `--re-warning`, `--re-danger` | Pair each fill with its matching `--re-on-*` foreground; add visible status text. These are not general text colours. |
| Geometry | `--re-space`, `--re-radius`, `--re-button-radius` | Consume only what the component needs; keep content height intrinsic. |
| Typography | `--re-font`, `--re-font-heading` | Native text already inherits the framework fonts. Heading font falls back to the body font. |

The [public token reference](https://eristavi.github.io/RevaCSS/reference/tokens/) lists the full documented set. Tokens such as `--re-action-start` used inside the framework's action rules are implementation details, not extension hooks.

## Start with an existing surface

The starter extends `.card` with `.project-summary`. The card owns background, border, shape, elevation and material. The application stylesheet adds a small content layout and supporting text.

```html
<article class="card stack project-summary" aria-labelledby="project-title">
  <p class="project-summary-label">Website project</p>
  <h3 id="project-title" class="project-summary-title">Your next interface</h3>
  <p>Build a custom component once and inherit its appearance.</p>
  <dl class="project-summary-meta">
    <div><dt>Status</dt><dd>Ready for review</dd></div>
    <div><dt>Owner</dt><dd>Design team</dd></div>
  </dl>
  <a href="/projects/interface/">Open project</a>
</article>
```

Replace the example destination with your real route. Make `project-title` unique for each instance and choose the heading level appropriate to the document. If the component includes form fields, also make label/control IDs unique; use a separate radio-group name for each independent group.

```css
.project-summary > .project-summary-label {
  color: var(--re-muted);
  font-size: .875em;
}

.project-summary > .project-summary-title {
  font-size: var(--project-summary-title-size, 1.4em);
}
```

Load application CSS after the matching framework files. The complete stylesheet and HTML starter are in `examples/custom-components.css` and `examples/custom-components.html`. From a source checkout, run the documented CSS build and open the example. For a downloaded starter, put the HTML and extension CSS beside your `dist/` directory as described on the online guide.

## Appearance and local overrides

The exact colour-mode values are `data-theme="light"`, `data-theme="dark"` and `data-theme="auto"`. Auto follows the operating-system preference. `data-palette` selects the colour family; `data-accent` changes the primary action colours, not the complete palette. Shape, density and materials are separate settings.

```html
<section data-theme="dark" data-palette="ocean" data-shape="rounded">
  <article class="card stack project-summary">
    <h3 class="project-summary-title">Inherited dark Ocean</h3>
    <p>Shared settings reach the existing surface and native content.</p>
  </article>
  <section data-theme="light">
    <article class="card stack project-summary">
      <h3 class="project-summary-title">Local light Ocean</h3>
      <p>Only the colour mode changes. The palette and shape still inherit.</p>
    </article>
  </section>
</section>
```

Override an application property on the instance when needed, for example `style="--project-summary-title-size: 1.6em"`. A local custom property inherits into descendants; choose a distinct component name or explicitly reset it if nested instances should use different values.

For an existing site, use `reva.scoped.css` instead of the global build and keep the component inside `.reva`. Put shared configuration and token overrides on that boundary or inside it; the boundary installs its own defaults. Application selectors still need their own boundary if they must not affect matching classes elsewhere. CSS scoping is not Shadow DOM isolation.

## Custom palettes and materials

Use **Customize → Colours → Palette → Custom** to define a palette with separate light and dark colours. Export its CSS and load it after RevaCSS. Use the exported `data-palette="custom"` name, or rename both the stylesheet selector and the HTML value to your brand name.

Keep the exported `@layer re.tokens` wrapper and the three `--re-palette-*` aliases for muted text, links and control borders. They allow material and accessibility rules to take priority. An unlayered colour override can outrank those rules. Define both modes and check all relevant foreground/background pairs, including both gradient endpoints. Contrast feedback is guidance; translucent surfaces still need review in their actual surroundings.

`data-material` styles documented targets. An arbitrary `.project-summary` element does **not** automatically acquire Glass, Veil or Soft UI just because it consumes colour tokens. The starter also uses `.card`, so it receives that hook's supported surface treatments. Load the corresponding optional stylesheet after the core. Use `data-material="solid"` for a local reset of an inherited material.

If you design a new surface without an existing hook, you own its material styling and its reduced-transparency, forced-colours, increased-contrast and print fallbacks. Do not copy private material variables into an extension and treat them as a stable API.

## Behaviour, preferences and compatibility

Use native controls for disabled, checked, required and disclosure states. Keep state text alongside colour. `aria-disabled="true"` alone does not stop an action; an application must implement the corresponding behaviour. CSS does not save preferences, add components, fetch records or provide an ARIA widget's keyboard contract.

The starter adds no animations. If an extension adds motion, respect `data-motion="none"` and reduced-motion preferences, using the documented motion guidance. If it adds advanced CSS, start with a usable layout and gate optional enhancements with `@supports`; feature detection does not replace browser verification. RevaCSS's modern core has its own support boundary, so this is not a promise to support legacy browsers.

Before accepting an extension, review long and translated content, narrow parent containers, RTL, text enlargement, unique IDs across multiple instances, keyboard/focus behaviour and applicable states. Review both modes, chosen palettes/materials and accessibility preferences in the actual application. Follow [QUALITY_STANDARD.md](https://github.com/eristavi/RevaCSS/blob/main/QUALITY_STANDARD.md) and record deferred or unverified checks explicitly.

## Application responsibilities

An application can render or insert a component using this markup and preserve the same appearance contract. It owns component selection, data, permissions, destinations, form submissions and storage of user choices. It can update documented parent attributes when users change settings. Server-rendered preferences can also supply those attributes without browser JavaScript.

The RevaCSS core and this starter remain HTML/CSS-only. The documentation customizer is an optional site tool with its own JavaScript; it is not a runtime dependency for the exported component.
