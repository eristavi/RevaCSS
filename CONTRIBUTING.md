# Contributing to RevaCSS

Use this workflow for changes to the framework, documentation, adapters and
examples. Follow the user's requested scope and project instructions. When work
is requested one step at a time, complete the current step and wait before
starting another. Check the working tree and preserve unrelated changes.

For interface usage, start with the [AI guide](https://github.com/eristavi/RevaCSS/blob/main/AI.md).
For acceptance and API changes, read the
[quality standard](https://github.com/eristavi/RevaCSS/blob/main/QUALITY_STANDARD.md),
[specification](https://github.com/eristavi/RevaCSS/blob/main/SPECIFICATION.md) and
[versioning policy](https://github.com/eristavi/RevaCSS/blob/main/VERSIONING.md).

## Identify the change before editing

Use [ARCHITECTURE.md](https://github.com/eristavi/RevaCSS/blob/main/ARCHITECTURE.md) as the architectural decision contract. The class and option catalogs generate the full public markup audit and inheritance matrix; keep their decisions aligned when changing hooks.


Record the relevant version/commit, intended behaviour and files involved.
Compare the reported result with the matching component contract and a small
reproduction. Current source, release archives and registry packages can have
different contents despite similar documentation or version labels.

| Change | Edit these sources | Keep these references aligned |
| --- | --- | --- |
| Core component styling or native states | `src/css/`; `scripts/build.mjs` when composition changes | Component contracts/examples, supported states and preference fallbacks. |
| Attribute values, defaults, targets or usage rules | `tokens/options.json` and implementing CSS/build rules | `docs/src/data/attributes.js`, `defaults.js`, `demo-settings.js` and applicable examples/customizer code. The option manifest documents the API; adding a value there alone does not implement it. |
| Foundation, palette or semantic colours | `tokens/foundation.tokens.json`, `palettes.json`, `roles.json` | Public tokens, light/dark documentation, contrast pairs and custom-palette guidance. |
| Public component structure | `docs/src/data/documentation.js`, `examples.js` and corresponding CSS | Full demos and adapters that render the structure; unique IDs and native semantics. |
| Stylesheet entry points or public tokens | `scripts/build.mjs`, `docs/src/data/stylesheets.js`, `public-tokens.js` | Package exports/types, file guidance and extension dependencies. |
| AI guidance | `AI.md`, `AI_MISTAKES.md`, `AI_TROUBLESHOOTING.md`, adapter READMEs and `scripts/generate-ai-docs.mjs` | Focused references, structured API, editor data, the index and corresponding human guide pages. |
| Human guides, navigation or demos | `docs/src/pages/`, `docs/src/components/`, `docs/src/data/` | Shared navigation data, copyable examples, local links and downloads. |
| Framework adapter | The relevant `integrations/<framework>/` directory | Its README/contracts, dependency requirements, packaging and matching `examples/` app. Reuse React for Next.js, Vue for Nuxt and Svelte for SvelteKit. |
| Application example | The relevant `examples/` source files | Run instructions, actual endpoints/state, published example downloads and evidence limits. |
| Distribution or publication tooling | `scripts/`, package manifests and `.github/workflows/` | Immutable artifact identity, package exports, checksums, registry checks and release gates. |

Update existing source locations rather than introducing a second source of
truth. For a changed public API, update its implementation, contract, working
example and usage documentation together. Add migration guidance for a breaking
change. Record user-visible work under `Unreleased` in `CHANGELOG.md`.

## Build from source

Use Node 22.12 or newer; Node 24 is recommended. Install locked dependencies with
`npm ci` when needed. Python 3 is used by browser-test serving and some packaging
tools; individual adapters have their own documented runtimes/tooling.

| Command | What it produces or does |
| --- | --- |
| `npm run build:css` | Compiled CSS in `dist/`, documentation copies under `docs/public/reva/`, and `docs/src/pages/generated-reference.json`. |
| `node scripts/generate-ai-docs.mjs` | Focused Markdown, downloadable AI application sources, structured API, editor data, `llms.txt` and `llms-full.txt`. It does not build the human site or run tests. |
| `npm run build:docs` | Regenerates AI resources and builds the Astro site. It needs the CSS build assets. |
| `npm run build` | Runs CSS generation followed by AI/site generation; use this from a checkout without generated CSS assets. |
| `npm run dev` | Builds CSS and starts the documentation development server. Rebuild/regenerate affected outputs after source changes as needed. |
| `npm run clean` | Removes generated CSS/site outputs and selected generated source data; inspect its script before using it and rebuild afterwards. |

`REVA_SITE` and `REVA_BASE` configure public URLs and deployment paths. Keep the
base consistent between the build and link checks. For example, when verifying
a GitHub project-path build:

```sh
REVA_SITE=https://eristavi.github.io REVA_BASE=/RevaCSS/ npm run build
REVA_BASE=/RevaCSS/ node --test tests/docs-links.test.mjs
```

Use the actual site's configured origin/path for another host. A generator run
without publication environment flags does not query registries or prove a
package is unpublished. CI's publication-status step supplies its recorded
availability independently.

## Keep generated output synchronized

Edit sources, then run the relevant generator. Direct edits to generated CSS,
`docs/public/ai/`, documentation asset copies, `generated-reference.json`,
`llms.txt`, `llms-full.txt` or `docs/dist/` will be overwritten. Some build
outputs are tracked and others are ignored; review the resulting diff instead
of blindly staging every generated file.

AI references draw from the same option manifest, component contracts, examples,
public token descriptions and adapter READMEs as the human documentation. Check
that changed guidance appears in the intended focused page and combined text,
and that index links still reach it. Attribute usage rules should remain
consistent in Markdown, `api.json`, editor descriptions and the human reference.
Downloaded application files should match their example sources byte for byte.

When adding a documentation page, update shared navigation where appropriate.
When adding a downloadable or package-facing file, check its served path and the
package's `files`/archive configuration. Existing published release archives
remain unchanged by a source documentation edit.

## Select verification for the actual change

Follow the user's testing instructions. The table identifies relevant checks;
it does not require every command for every edit. Check prerequisites and choose
the smallest set that addresses the changed behaviour. Do not repeatedly run an
unchanged full suite without a concrete reason.

| Change under review | Relevant verification when requested |
| --- | --- |
| Text, links or navigation only | Inspect changed links/examples; build the site when rendered structure or paths change. `node --test tests/docs-links.test.mjs` checks an already built site, not source Markdown alone. |
| AI generator or metadata | Regenerate AI resources; inspect changed fields, exact values, completeness, index links and source/download agreement. `node --check scripts/generate-ai-docs.mjs` checks syntax only. Build the human site for affected pages when available. |
| Tokens or core CSS | Build current outputs and select relevant source tests in `tests/`. `npm test` runs all root Node tests, some of which inspect built documentation, so prepare a full build first. |
| Layout, interaction, state or accessibility styling | Use applicable Playwright fixtures under `tests/browser/` after a build; include affected engines/preferences and states. Apply the quality standard's manual/device requirements where relevant. |
| Package files or exports | `npm run check:package` inspects prepared package inputs; `npm run test:package` checks installed package consumers. The package test lifecycle rebuilds CSS through `prepack`. |
| Installed-package browser behaviour | `npm run test:package:browser` after the required browser installation; inspect the script's engine configuration. This is distinct from the source browser suite. |
| Astro adapter | Follow its README; the root `npm run test:astro` exercises packed consumers. |
| React, Vue or Svelte adapter | Follow its README/tooling setup and `npm --prefix integrations/<framework> run check`. Browser checks are a separate opt-in phase described there. |
| Laravel adapter or Livewire example | Build/prepare matching assets, then follow the package/example Composer checks and the Laravel/Livewire matrix in `.github/workflows/laravel.yml`. |
| Runnable application example | Exercise its actual route, invalid/valid submission, saved state and output escaping; review rendered labels/IDs. Distinguish HTTP checks from browser interaction. |
| Release or publication tooling | Run applicable packaging/identity checks and the exact workflow's release gates; retain recorded revisions and artifact digests. |

For focused source/browser tests, select existing fixtures that cover the change.
For example, after preparing outputs and browser dependencies, a navigation
change can use the relevant fixture and engine:

```sh
npx playwright test tests/browser/navbar.spec.mjs --project=chromium
```

This is a focused check, not complete release acceptance. Read the current
workflow before requesting CI: documentation builds/deployment, opt-in browser
checks, adapter checks and publication jobs have different triggers. A successful
documentation deployment does not establish that the browser suite ran.

If a required dependency is unavailable, record the blocked command and reason.
Do not report reference generation as a successful Astro build, a source compile
as a hydrated interaction check, or headless WebKit as a physical Safari/iPhone
review. Preserve tests that exercise the intended contract; resolve unexpected
results rather than weakening assertions to preserve a green status.

## Preserve release and compatibility evidence

Use the quality standard and `quality/blockers.json` for applicable acceptance.
For release work, `npm run check:release-quality` checks recorded blockers; it
does not replace all automated/manual gates. Follow the matching workflow and
write evidence for the exact revision in `quality/releases/`.

Bump versions once per published release, following semantic compatibility
rules, and update the root manifest/lockfile together when doing so. Maintain
the truthful state of `docs/src/data/source-status.json`; a successful build
alone does not justify clearing deferred validation. Documentation may deploy
between releases. GitHub publication, npm/CDN availability and
Composer/Packagist availability remain separate facts.

## Hand off a reviewable result

Review the final diff for unintended source, output or dependency changes.
Summarize what changed and why, the checks actually completed, any blocked or
deferred checks, and remaining limitations. Include the relevant version/commit
and affected public API when applicable. Make publishing/merging claims only
after the action succeeds. When the requested step is complete, stop at that
boundary and let the user choose the next step.
