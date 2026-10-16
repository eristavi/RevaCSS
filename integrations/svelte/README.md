# RevaCSS for Svelte and SvelteKit

Optional Svelte 5 components for RevaCSS 2.0. The stable `@revacss/svelte` archive is available in the [2.0.0 GitHub release](https://github.com/eristavi/RevaCSS/releases/tag/v2.0.0). The same adapter serves plain Svelte and SvelteKit, with no Kit-specific package. Svelte owns application rendering/state; RevaCSS core remains CSS-only. Registry availability is separate from GitHub downloads.

Automated fixture checks and the core manual attestation are recorded in the [release validation record](https://github.com/eristavi/RevaCSS/blob/main/quality/releases/v2.0.0.md). Application-specific device, screen-reader and accessibility acceptance is not inferred from core sign-off.

## Install from source

Download the matching core and adapter tarballs from the GitHub release, or prepare them from the matching repository root:

```sh
npm ci
npm run build:css
npm pack --ignore-scripts
npm pack ./integrations/svelte --ignore-scripts
```

In a Svelte project configured with its normal compiler/plugin:

```sh
npm install /path/to/revacss-2.0.0.tgz /path/to/revacss-svelte-2.0.0.tgz
```

The adapter ships typed `.svelte` source and requires Svelte 5.57.1 or newer within
major version 5. Stable 2.0.0 archives are published on GitHub; registry availability is separate. The reference uses Svelte 5.57.2 and SvelteKit 3.0.1, with the current
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
model interactions are checked in the opt-in browser phase. Manual device
acceptance remains required. Do not use
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


## Automated browser review

The requested 14 October 2026 review passed the reference fixtures in Chromium, Firefox
and WebKit. It covers native control activation, applicable hydrated value changes,
DOM focus through applicable ref/element bindings, disclosure toggles, disabled
controls, axe assertions and page reflow at 320/375/768/1280px. These checks are
limited to the reference fixtures, not all possible application combinations.
The core maintainer manual attestation is recorded separately; it does not establish itemised physical-device, screen-reader, actual zoom/print or visual acceptance for every adapter fixture. Set `REVA_BROWSER_CHECKS=1` and optionally
`REVA_TEST_ENGINE=chromium|firefox|webkit` when running the maintainer check.
Without the flag, checks remain compilation/SSR only.

## Maintainer checks

```sh
npm --prefix integrations/svelte ci --ignore-scripts --legacy-peer-deps
npm --prefix integrations/svelte run check
```

The isolated lockfile pins tooling. Legacy peer resolution allows development
before revacss@2 npm publication; actual consumers use both locally packed packages.
The checks cover component/consumer types, extracted tarball consumers, a plain
Svelte production build and SSR output, and a SvelteKit production Node server
with HTTP checks for document attributes, served CSS and form markup. The opt-in browser phase verifies reference value/element interactions. Full
hydration combinations, physical devices and manual accessibility acceptance
remain unverified. The example form has no server submission endpoint.

## AI implementation workflow

Follow these decisions in order when generating or reviewing an interface with this adapter. Native HTML remains a supported choice.

| Decision | Rule for this adapter |
| --- | --- |
| 1. Version and reference | Confirm installed core/@revacss/svelte versions and its Svelte peer range. Plain Svelte and SvelteKit use the same adapter; the consuming app supplies its normal compiler and runtime. |
| 2. Assets and appearance | Load one core build in the application entry or SvelteKit root layout. Layout is a div wrapper; document attributes belong to the application document/template. Scoped content needs class=reva and matching scoped extensions; fonts remain optional. |
| 3. Native attributes | Forward native attributes/events, class/style, data/ARIA props to the identifying element; field attributes go on the control. Use the documented snippets for component content and header/footer composition. |
| 4. Field values and errors | Use bind:value or an appropriate initial value; Textarea values are strings and multiple Select values are arrays. Use bind:element for supported native DOM nodes, initialize it to null and access it only on the client. Component bind:this is not the native element API. |
| 5. SSR and application state | Svelte/SvelteKit owns SSR, hydration and reactivity. Preserve server/client initial values and keep DOM access out of server rendering. The reference's full-reload theme links do not establish client-side theme navigation or persistence. |
| 6. Application responsibilities | Provide real endpoints/actions, authorization, CSRF and server validation in the host app. Unique IDs/labels and hint/error text remain required; use native choice/file/hidden controls with Field where appropriate. |
| 7. Review and evidence | Inspect control bindings, IDs/error descriptions, native states and CSS imports. Use examples/svelte and examples/sveltekit. Follow project check instructions; reference SSR/build checks do not establish every hydration path or manual acceptance. |

Focused AI reference: [svelte adapter Markdown](https://revacss.eristavi.org/ai/adapters/svelte.md). Read the root AI guide for shared attribute rules and version selection, then this adapter's components and examples. Preserve the user's workflow about tests and publication.
