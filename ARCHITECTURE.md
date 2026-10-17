# RevaCSS architecture

This is the architectural decision contract. Exact supported values and targets live in `tokens/options.json`; component structures live in the documentation manifest; public class hooks live in the class catalog. The historical foundation specification is design history where it differs from those current contracts.

The class-free foundation hooks described here are additive, unreleased source features. Published 2.0.0 retains its original API. Existing classes remain supported; removing them or changing neutral native-element defaults requires a separately versioned migration.

## Semantic HTML first

HTML supplies meaning, content, relationships and native state. CSS supplies presentation. Use main for primary content, nav for navigation, article for independently meaningful content, section for a thematic grouping, and div when no semantic element fits. A presentation attribute does not create semantics.

Native buttons, fields, tables, details/summary, dialogs and popovers retain their native behaviour. Native attributes own browser state; ARIA describes accessibility semantics where required; data-reva-* is reserved for Reva-owned optional behaviour/state. Applications own data, routing, validation messages and business logic. Adapters preserve these contracts through their host framework's lifecycle.

Never select an element merely to obtain its visual treatment. Do not add ARIA roles to obtain CSS. No required structural classes for ordinary native content. A reusable pattern without a native equivalent can have one documented presentation hook and necessary contextual parts; every hook and wrapper needs a reason in the markup audit.

## Structure, layout, surface and scope

These are independent responsibilities. Native structural elements remain neutral: main is not automatically a width container; article is not automatically a card; footer is not automatically a site-wide navigation panel.

| Responsibility | Source-preview hook | Existing equivalent | Behaviour |
| --- | --- | --- | --- |
| Width boundary | data-layout="container" | .container | Consume shared data-width; no painted panel. |
| Intrinsic grid | data-layout="grid" | .grid | Auto-fitting columns; consume shared gap. |
| Wrapping row | data-layout="row" | .row | Horizontal wrapping flex layout. |
| Vertical stack | data-layout="stack" | .stack | Vertical flex layout with shared spacing. |
| Painted panel | data-surface="card" | .card | Shared surface, material support and native header/footer/figure patterns. |
| Scoped island | data-reva | .reva | Presence marker on an existing element; matching scoped stylesheets initialize defaults. |

These hooks select presentation, not new semantic components. Layout and surface can coexist on one element. One data-layout value is supported per element; nest layouts when composing a width container and a grid. Do not mix conflicting class/attribute layouts. Classes for remaining patterns and presentation modifiers stay supported for their documented purpose; merely renaming every class into an attribute is not a semantic improvement.

A scoped boundary limits selector matching, not inheritance or Shadow DOM. Configure its defaults on the boundary or within it; html settings outside an island do not override its initialized defaults. As with .reva, ordinary descendant-only component selectors need a descendant: put the surface/layout below the boundary. Keep popovers and dialogs within its DOM subtree even when they render in the top layer. Nested boundaries initialize fresh defaults. Global pages require no scope marker.

```html
<main data-layout="container">
  <h1>Projects</h1>
  <div data-layout="grid">
    <article data-surface="card">
      <header><h2>Project Aurora</h2></header>
      <p>A self-contained project summary.</p>
      <footer><a href="/projects/aurora">View project</a></footer>
    </article>
  </div>
</main>
<footer data-layout="container"><p>Project service</p></footer>
```

A generic dashboard panel can use div[data-surface="card"] with an appropriate heading; it need not become an article. A native footer inside a surface receives the contextual divider/spacing. A page footer uses its meaningful native children and an optional layout choice; it receives no forced columns, surface or application behaviour.

## Shared decisions and local exceptions

Set page defaults once on html in global builds, or on a scoped boundary. Custom properties and scoped selectors carry settings to documented consumers; HTML attributes themselves do not inherit. Separate primitive colours, semantic roles, shared appearance settings and component overrides. Components should consume shared tokens rather than duplicate palettes or defaults.

For every option, its manifest must specify targets, omission/inheritance, local override/reset, dependencies and limitations. The generated inheritance matrix publishes all of these fields, including local-only settings. New options must classify whether they configure descendants or select a local hook.

There is no universal reset keyword. Theme auto follows the device; button-material default returns to the general material; material solid ends a decorative material scope; width standard selects a width preset. Omission normally continues the inherited choice, while a fresh scoped boundary installs defaults. Existing material scopes have a compatibility exception: unsupported material/button-material values can stop a parent scope without supplying a replacement. Never recommend invalid values as resets. This exception is documented rather than silently changing released behaviour.

A local override changes only its concern. Theme/palette changes must not reset geometry. Width must not create a surface. Material must not change layout. A general material and an independent action material remain distinct. Explicit custom tokens and preset boundaries must resolve as documented; derived custom-property values can resolve at their definition site, so nested custom settings need computed-style checks rather than assumptions.

## Cascade and extension contract

Every generated component/core/extension entry point declares the same layer order before its rules:

```css
@layer re.tokens, re.base, re.components, re.buttons, re.utilities;
```

Tokens establish defaults, base styles native elements, components arrange reusable patterns, buttons supplies optional independent action materials, and utilities handles intentional overrides and system preferences. Namespaced layers compose across global/scoped builds. Keep ordinary selectors low-specificity with :where(); :scope may be needed inside scope rules. Do not solve extension conflicts by adding selector specificity or broad important declarations.

A layer-order statement only fixes order when those layers are first introduced; it cannot undo a host application's previously declared layer order. Load a complete core before matching extensions as the supported installation convention. Modular consumers include tokens/base and documented module dependencies; individual modules are not self-contained frameworks.

Unlayered application declarations override normal layered declarations. Applications may also declare a later custom layer. Important declarations reverse layer precedence, so reserve them for documented invariant/accessibility cases and test them. Application overrides can defeat preference rules; preserve focus, contrast and reduced-motion requirements when customizing. Accessibility preferences constrain decoration, not the semantic content or native state.

## Standards and optional behaviour

The CSS core has no browser JavaScript runtime. Optional enhancements and adapters do not redefine its markup/state contracts. Prefer intrinsic layouts, logical properties, custom properties and explicit containment. Use newer CSS when it solves a concrete problem, with a documented browser boundary and usable fallbacks where applicable. Experimental effects remain opt-in; browser requirements must not rise silently in a compatible release.

## Contribution acceptance checklist

1. Does the HTML express the content's real meaning, with native state and accessible relationships?
2. Does every required hook/wrapper have a documented presentation or behaviour purpose?
3. Are structure, layout, surface, scope and appearance independent?
4. Do shared defaults, nested exceptions and reset/re-entry preserve unrelated settings?
5. Does the change respect layers, low specificity and ordinary application overrides?
6. Does it work without core JavaScript and preserve native keyboard/focus behaviour?
7. Are manifests, working examples, adapters and human/AI references aligned with availability?
8. Are compatibility, browser requirements and focused verification recorded accurately?
