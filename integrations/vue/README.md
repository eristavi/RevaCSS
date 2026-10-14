# RevaCSS for Vue

Optional Vue 3.5 components for the RevaCSS 2.0 release preparation. The stable-version
`@revacss/vue` package is not published. It is distributed separately from the CSS
package and does not modify core styles or inject stylesheets. Vue provides the
application runtime; RevaCSS core remains CSS-only. Automated fixture coverage is recorded below; the core release record gives
manual acceptance and remaining publication steps.

## Install from source

From a matching RevaCSS checkout:

```sh
npm ci
npm run build:css
npm pack --ignore-scripts
npm pack ./integrations/vue --ignore-scripts
```

Inside a Vue 3.5 project configured to compile Vue single-file components:

```sh
npm install /path/to/revacss-2.0.0.tgz /path/to/revacss-vue-2.0.0.tgz
```

The version numbers describe source candidates, not published or accepted releases.
The package ships typed `.vue` source. Vite applications need their ordinary Vue
plugin; Nuxt supplies Vue compilation. No adapter registration plugin is needed.

## Create a component

```vue
<script setup lang="ts">
import { ref } from 'vue';
import 'revacss';
import Card from '@revacss/vue/Card.vue';
import Input from '@revacss/vue/Input.vue';
import Button from '@revacss/vue/Button.vue';
const email = ref('');
</script>

<template>
  <Card>
    <template #header><h1>Contact us</h1></template>
    <form action="/contact" method="post">
      <Input v-model="email" id="contact-email" name="email"
        label="Email" type="email" required />
      <Button type="submit">Send</Button>
    </form>
  </Card>
</template>
```

Load CSS once at the application entry or shared layout. Native HTML can be used
in every slot. Implement the form endpoint, server validation, authorization and
CSRF protection in the application. Vue models are application state, not server
validation. Pass safe validation text through `error`; never restore passwords
from prior input. Text is rendered through escaped Vue interpolation.

## Components

| Component | Contract |
| --- | --- |
| Layout | Application wrapper with header/footer slots, skip link and container main. Optional mainId and translated skipLabel. Generated main IDs use Vue useId. It does not render html/head/body or manage document metadata. |
| Button | Native button; defaults to type=button. Native type, disabled, events and attributes pass through. |
| Link | Native anchor with button class; required href. Use native links for navigation; use NuxtLink/RouterLink with class=button when client routing is needed. |
| Card | Article with card class; optional header/footer slots. Supply a heading of the appropriate level. |
| Alert | Div with alert class; use data-variant. Add role=status/alert only when appropriate for dynamic announcements. |
| Disclosure | Native details/summary; required summary; native open/name attributes pass through. |
| Input | Text-like native input; required v-model, unique id and label; optional hint/error. |
| Select | Native select; required v-model, unique id and label; option/optgroup slots. Use an array model with multiple and scalar models otherwise. |
| Textarea | Native textarea; required string v-model, unique id and label; optional hint/error. |
| Field | Low-level labelled form group for application controls. Wire control IDs and hint/error associations yourself. |

Input, Select and Textarea merge aria-describedby with generated hint/error IDs and
set aria-invalid=true when an error is present. Attributes, native event listeners,
class/style bindings and data attributes reach the actual control, rather than its
form-group wrapper. IDs and their generated `-hint`/`-error` IDs must be unique per
page. Model changes use Vue's native form directives. Use plain v-model; component
model modifiers are not part of this candidate API. Use native checkbox/radio/file
controls with Field instead of Input. For read-only static forms, native HTML is
also available without component model bindings.

## Appearance and rendering

Set page attributes such as `data-theme="auto"` and `data-font="system"` on the
application's document root. In Nuxt, manage those attributes through application
head configuration. Layout attributes reach its div wrapper and affect supported
nested targets; they do not set the document/body background.

For scoped CSS, import `revacss/dist/reva.scoped.css` instead of the global build and
put `class="reva"` on the application wrapper. Load optional modules explicitly,
for example `revacss/dist/reva.glass.css` for Glass. Default font needs
`revacss/dist/reva-fonts.css` and `data-font="manrope"`; System needs no font asset.
Load application override CSS after framework CSS. Vue scoped overrides that target
child internals may require :deep().

No browser globals, theme persistence, automatic CSS injection, component effects
or scripted disclosure handling are added. Server rendering emits native HTML;
client hydration and reactivity belong to the consuming Vue application. Nuxt build and server-rendering coverage is recorded in the
[Nuxt reference](https://github.com/eristavi/RevaCSS/tree/main/examples/nuxt).
Laravel/Inertia remains an integration route without dedicated platform checks.
Hydrated value changes are covered by the opt-in browser checks; client-navigation
head updates and manual acceptance remain unverified.


## Automated browser review

The requested 14 October 2026 review checks this candidate in Chromium, Firefox
and WebKit. It covers native control activation, applicable hydrated value changes,
DOM focus through applicable ref/element bindings, disclosure toggles, disabled
controls, axe assertions and page reflow at 320/375/768/1280px. These checks are
limited to the reference fixtures, not all possible application combinations.
Physical devices, screen readers, actual zoom/print and visual approval remain
manual release requirements. Set `REVA_BROWSER_CHECKS=1` and optionally
`REVA_TEST_ENGINE=chromium|firefox|webkit` when running the maintainer check.
Without the flag, checks remain compilation/SSR only.

## Maintainer checks

```sh
npm --prefix integrations/vue ci --ignore-scripts --legacy-peer-deps
npm --prefix integrations/vue run check
```

The isolated tooling manifest/lockfile pins the Vue compiler, type checker and
build tools. `--legacy-peer-deps` allows source development before revacss@2 is
published; actual consumers install both local tarballs. The check validates strict
component types, compiles a packed Vue application and inspects server-rendered
markup, field associations, initial models, escaping and missing-ID failures.
The opt-in flag adds the browser checks described above. Neither phase certifies
manual interaction/accessibility acceptance.
