# Instructions for coding agents

These instructions apply throughout this repository. Follow the user's current
request and any more specific instructions in the area you are changing. Keep
work within the requested scope; when the user asks for one step at a time,
finish that step and wait before starting the next.

## Start here

- Read [AI.md](AI.md) for RevaCSS usage, component contracts and application
  responsibilities before generating or changing interface markup.
- Read [README.md](README.md) for setup and the repository's build commands.
- Read [CONTRIBUTING.md](CONTRIBUTING.md) for the change-to-source map,
  generated-file workflow and verification choices before modifying the framework.
- For framework changes, consult [SPECIFICATION.md](SPECIFICATION.md) and
  [QUALITY_STANDARD.md](QUALITY_STANDARD.md). Use
  [VERSIONING.md](VERSIONING.md) and [MIGRATION.md](MIGRATION.md) when changing
  the public API.
- For an adapter, read its `integrations/<framework>/README.md` and the matching
  application under `examples/`. Next.js uses the React adapter, Nuxt uses Vue,
  and SvelteKit uses Svelte. Laravel also has
  [AI guidance](integrations/laravel/docs/ai.md) and a
  [Boost skill](integrations/laravel/resources/boost/skills/revacss-development/SKILL.md).
- For application-defined components, follow
  [CUSTOM_COMPONENTS.md](CUSTOM_COMPONENTS.md).

## Find the source of truth

| Concern | Source |
| --- | --- |
| Core version and commands | `package.json` |
| Attribute values, defaults and scope | `tokens/options.json` |
| Foundation, palette and semantic role tokens | `tokens/foundation.tokens.json`, `tokens/palettes.json`, `tokens/roles.json` |
| CSS rules and build composition | `src/css/`, `scripts/build.mjs` |
| Component contracts and examples | `docs/src/data/documentation.js`, `docs/src/data/examples.js` |
| Public token descriptions and stylesheet inventory | `docs/src/data/public-tokens.js`, `docs/src/data/stylesheets.js` |
| Human documentation and demos | `docs/src/pages/`, `docs/src/components/` |
| AI usage guide and reference generation | `AI.md`, `scripts/generate-ai-docs.mjs` |
| Source availability and release evidence | `docs/src/data/source-status.json`, `quality/releases/`, `NPM.md` |

Use the installed package's version and matching reference for consuming
applications. Current source, GitHub releases, npm and Composer/Packagist can
have different availability. Read the relevant release record; a version in a
manifest alone does not establish publication or validation of later changes.

## Preserve the framework contract

- Keep the CSS core free of a browser JavaScript runtime. Application behaviour
  and the optional documentation customizer have separate responsibilities.
- Use documented native markup, supported attributes and public tokens. Preserve
  labels, unique IDs, native state, keyboard operation and preference fallbacks.
- Keep adapters consistent with the core contract. Check their own manifests
  and documentation for framework versions, bindings and asset installation.
- When an API changes, update its source manifest, implementation, examples and
  relevant documentation together. Record user-visible changes in
  [CHANGELOG.md](CHANGELOG.md); follow the versioning policy for release bumps.
- Preserve unrelated work in the working tree and review the final diff.

## Generated files and build commands

Use Node 22.12 or newer; Node 24 is recommended. Install locked dependencies with
`npm ci` when needed.

| Command | Purpose |
| --- | --- |
| `npm run build:css` | Rebuild `dist/`, documentation CSS copies and `docs/src/pages/generated-reference.json` from CSS/token sources. |
| `npm run build:docs` | Generate AI references, then build the Astro documentation; requires the CSS build assets. |
| `npm run build` | Build CSS and documentation together. |
| `npm run dev` | Build CSS and start the documentation development server. |

Edit the sources above and regenerate their outputs. Direct edits to generated
`dist/` CSS, `docs/public/reva/`, `docs/src/pages/generated-reference.json`,
`docs/public/ai/`, `docs/public/llms.txt`, `docs/public/llms-full.txt` or
`docs/dist/` will be overwritten by their build steps. Some outputs are tracked;
check the diff after rebuilding. Never hand-edit a published release archive.

## Choose checks appropriate to the change

Follow the user's and project's testing instructions. A documentation edit does
not automatically require the full browser or release suite. Inspect links and
examples; build documentation when generated output or rendering needs checking.

When validation is requested, choose applicable commands from `package.json`:
`npm test` checks source/build contracts, `npm run test:browser` checks browser
behaviour, and `npm run test:package` and `npm run test:package:browser` check
the installed CSS package. Adapter checks are defined in their manifests and
the matching workflows under `.github/workflows/`. Build required outputs first;
browser checks require their documented browser/runtime dependencies.

For release work, follow [QUALITY_STANDARD.md](QUALITY_STANDARD.md),
`quality/blockers.json` and the relevant release workflow, including
`npm run check:release-quality`. Keep existing publication gates in place.
Automated checks do not establish manual screen-reader or real-device results.

Report what changed, the checks actually completed, deferred checks and any
remaining limitations. Do not claim a build, test, publication or device review
passed without evidence for the revision being discussed.
