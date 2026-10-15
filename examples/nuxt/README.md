# Nuxt reference application

RevaCSS 2.0 reference application using Nuxt 4.6.1, Vue 3.5.44 and the existing
`@revacss/vue` adapter. No additional Nuxt component package or module is needed.
Core CSS and Vue components stay unchanged.

## Run from source

From the RevaCSS root, prepare matching CSS and package matching stable archives:

```sh
npm ci
npm run build:css
npm pack --ignore-scripts
npm pack ./integrations/vue --ignore-scripts
```

Inside this directory:

```sh
npm ci --ignore-scripts
npm install /path/to/revacss-2.0.0.tgz /path/to/revacss-vue-2.0.0.tgz
npm run dev
```

Both stable 2.0.0 archives are available in the GitHub release; npm availability is separate. Use a Node version supported by the
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

The default check provides Nuxt build/server-rendering evidence. With
`REVA_BROWSER_CHECKS=1`, the requested three-engine review also checks hydrated
model updates, native disclosure operation, reflow and axe assertions.
Client-navigation head updates, physical devices and manual accessibility
acceptance remain unverified.

## Dependency review and deployment

The Nuxt-only review on 14 October 2026 is complete; see
[DEPENDENCY_REVIEW.md](DEPENDENCY_REVIEW.md) for the locked dependency paths,
upstream advisories, input assessment, production inventory and residual risks.
At that review, the installed build/dev tree had 11 high audit entries from two
unpatched upstream advisories. This is a scoped review, not a clean-audit claim.

The production `.output` inventory contains neither affected package nor their
named tooling references. `npm run check` now checks that boundary before starting
the built server. Deploy only the self-contained `.output` artifact and start it
with `node .output/server/index.mjs`; do not deploy the installed development tree
or use `nuxt dev` in production. The default dev command binds to `127.0.0.1`.
Build only trusted project/configuration/module inputs and review dependencies
again after changes or when upstream fixes become available.

Release scope and evidence: [2.0.0 validation record](https://github.com/eristavi/RevaCSS/blob/main/quality/releases/v2.0.0.md).
