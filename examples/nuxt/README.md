# Nuxt reference application

RevaCSS 2.0 source candidate using Nuxt 4.6.1, Vue 3.5.44 and the existing
`@revacss/vue` adapter. No additional Nuxt component package or module is needed.
Core CSS and Vue components stay unchanged.

## Run from source

From the RevaCSS root, prepare matching CSS and package the source candidates:

```sh
npm ci
npm run build:css
npm pack --ignore-scripts
npm pack ./integrations/vue --ignore-scripts
```

Inside this directory:

```sh
npm ci --ignore-scripts
npm install /path/to/revacss-2.0.0.tgz /path/to/revacss-vue-2.0.0-dev.0.tgz
npm run dev
```

Both packages remain unpublished candidates. Use a Node version supported by the
pinned Nuxt release; the maintainer checks use Node 24.19.0.

## Nuxt configuration

`nuxt.config.ts` loads `revacss/dist/reva.css` globally, enables SSR and compiles the
Vue adapter source through Nuxt's normal build. `app/app.vue` uses `useHead` to set
`data-theme="auto"`, `data-font="system"` and document language on the html root.
The `/dark` page sets its own dark theme. Page settings are server-rendered;
application state and optional saved preferences belong to the application.

The home page demonstrates native component markup, initial Vue models,
associated labels/hints/errors, multiple selection and ordinary Nuxt navigation.
The form has no endpoint; submission is prevented and its send button is disabled.
Validation text is a deliberate escaped fixture, not real server validation.
The server-rendered dark page shows a per-page head override. No extra style
injection, theme scripts or scripted disclosure behaviour are added by RevaCSS.
Nuxt still ships its own application runtime for navigation/hydration.

## Verify the production application

From this directory after `npm ci --ignore-scripts`:

```sh
npm run check
```

The checker builds an isolated consumer from both actual tarballs, runs Nuxt type
checks and a production Node server build, starts the built server on localhost,
requests both pages, and checks root attributes, served core CSS and rendered form
associations/initial values/escaping. It then requests the default page again to
check that the dark page does not leak document theme state across requests.
Dependencies are reused from this example's locked install; framework packages
are extracted from real distribution tarballs. Temporary files and the server
are cleaned up afterward.

This is Nuxt build and server-rendering evidence. Browser hydration, interactive
model updates, native disclosure operation, client-navigation head updates,
physical-device and accessibility acceptance remain deferred until the 2.0 review.
