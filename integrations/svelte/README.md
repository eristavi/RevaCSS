# RevaCSS for Svelte and SvelteKit

Optional Svelte 5 components for the RevaCSS 2.0 source candidate. The proposed
`@revacss/svelte` package is unpublished and distributed separately from core CSS.
Svelte owns application rendering/state; RevaCSS core remains CSS-only. The same
adapter works in plain Svelte and the SvelteKit reference, with no Kit-specific
component package. Browser/hydration/interaction acceptance remains deferred.

## Install the source candidate

From the RevaCSS root:

```sh
npm ci
npm run build:css
npm pack --ignore-scripts
npm pack ./integrations/svelte --ignore-scripts
```

In a Svelte project configured with its normal compiler/plugin:

```sh
npm install /path/to/revacss-2.0.0.tgz /path/to/revacss-svelte-2.0.0-dev.0.tgz
```

The adapter ships typed `.svelte` source and requires Svelte 5.57.1 or newer within
major version 5. Source candidates are not published or accepted production
releases. The reference uses Svelte 5.57.2 and SvelteKit 3.0.1, with the current
Vite-based Kit configuration and adapter-node 6. No global component registration
or adapter appearance plugin is needed.

## Typed native components

```svelte
<script lang="ts">
  import 'revacss';
  import Card from '@revacss/svelte/Card.svelte';
  import Input from '@revacss/svelte/Input.svelte';
  import Button from '@revacss/svelte/Button.svelte';
  let email = $state('');
</script>
<Card>
  {#snippet header()}<h1>Contact us</h1>{/snippet}
  <form action="/contact" method="post">
    <Input bind:value={email} id="contact-email" name="email"
      label="Email" type="email" required />
    <Button type="submit">Send</Button>
  </form>
</Card>
```

Load core CSS once at the application entry/shared layout. Native markup is valid
inside every content snippet. The application provides endpoints, authorization,
server validation, CSRF protection and application state. Validation messages use
escaped Svelte interpolation. Never restore passwords from previous input.

## Components

| Component | Contract |
| --- | --- |
| Layout | Application div with header/footer/children snippets, skip link and container main. Required unique mainId; optional translated skipLabel. Does not manage document html/head/body. |
| Button | Native button; defaults to type=button. Native type/disabled/event props pass through. |
| Link | Native anchor with button class; required href. Ordinary native link semantics. |
| Card | Article with card class; header/footer/children snippets. Supply an appropriate heading level. |
| Alert | Div with alert class; use data-variant. Add role=status/alert only when dynamic announcements need it. |
| Disclosure | Native details/summary; required summary string; native open/name attributes pass through. |
| Input | Text-like native input; required unique id and label; bind:value or value; optional hint/error. |
| Select | Native select with option/optgroup children; required unique id/label/value; scalar single selection or array with multiple. |
| Textarea | Native textarea; required unique id and label; bind:value or value for text, not children. |
| Field | Low-level labelled form group for native application controls. Wire control IDs and descriptions/errors yourself. |

Attributes, native event props, class/style, ARIA and data attributes pass to each
component's actual native element. Input/Select/Textarea attributes reach the
control, not its outer form-group. They merge aria-describedby with generated
hint/error IDs and mark nonempty errors aria-invalid=true. IDs and generated
`-hint`/`-error` IDs must be unique per page.

Value bindings use Svelte's native form binding. Input covers text-like controls;
use native checkbox/radio/file/hidden controls with Field where appropriate.
Bindable `element` exposes the native DOM node on components other than Field.
Initialize the bound element variable to null; it remains null during SSR.
Initialize textarea values to strings and multiple-select values to arrays. DOM access and
model interactions need browser acceptance, which is deferred. Do not use
component bind:this as a substitute for the native element binding.

## Appearance and SvelteKit

Set document attributes on the application's html root; wrapper attributes only
affect their supported nested targets. SvelteKit loads CSS in its root layout.
The reference server hook derives auto/dark document theme from the request path.
Its theme-navigation links request full document reloads, so the server template
sets the root attributes without a client theme runtime. Client-only theme
persistence and navigation remain application responsibilities.

Load optional modules explicitly. For scoped CSS, import
`revacss/dist/reva.scoped.css` and put class=reva on the appropriate boundary.
Default font needs `revacss/dist/reva-fonts.css` plus data-font=manrope; System
needs no font asset. Use existing CSS tokens/custom palettes and import overrides
after framework CSS. No component stylesheet or scripted disclosure/effect is added.
Svelte/SvelteKit supply their normal application JavaScript when enabled.

## Maintainer checks

```sh
npm --prefix integrations/svelte ci --ignore-scripts --legacy-peer-deps
npm --prefix integrations/svelte run check
```

The isolated lockfile pins tooling. Legacy peer resolution allows development
before revacss@2 publication; actual consumers use both locally packed packages.
The checks cover component/consumer types, extracted tarball consumers, a plain
Svelte production build and SSR output, and a SvelteKit production Node server
with HTTP checks for document attributes, served CSS and form markup. Browser,
hydration, value/DOM interactions, physical devices and accessibility acceptance
remain deferred. The example form has no server submission endpoint.
