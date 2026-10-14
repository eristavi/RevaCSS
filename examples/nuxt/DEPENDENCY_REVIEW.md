# Nuxt reference dependency review — 14 October 2026

Decision: **retain the optional Nuxt example with a scoped dependency review**.
The installed development/build tree is not audit-clean. The reviewed production
output does not contain the affected packages or named import references. This
completes `Q-NUXT-DEPENDENCY-REVIEW`; it does not declare the upstream issues fixed
or certify arbitrary Nuxt applications.

## Locked scope and audit

Reviewed from repository candidate `ada5fcc285027d12cb74da69c4b0bbdbab79de99` with
Node 24.19.0, Nuxt 4.6.1, Vue 3.5.44 and Nitro 2.13.4. The dependency versions and
lockfile were kept unchanged. Lockfile SHA-256:
`8da87c8eb48aef426ffa85d9affa2dd56a55e66122d94f16301b7d210758e92b`.

Fresh `npm audit --json` reports **11 high entries from two advisories**, zero
critical/moderate/low findings. The remaining entries are propagated dependency
findings, not nine additional independent vulnerabilities.

| Affected dependency | Locked version | Path from Nuxt | Affected operation |
| --- | --- | --- | --- |
| braces | 3.0.3 | Nuxt → @nuxt/nitro-server → nitropack → globby → micromatch → braces (also via fast-glob) | Recursive processing of deeply nested brace patterns can exhaust the stack |
| node-forge | 1.4.0 | Nuxt → @nuxt/nitro-server → nitropack → listhen → node-forge | RSA PKCS#1 v1.5 signature verification can accept malformed nested DigestAlgorithm elements with low-exponent keys |

Primary advisory records:
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) and
[GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv).
Both list no patched version on the review date. Registry queries return Nuxt
4.6.1, braces 3.0.3 and node-forge 1.4.0 as latest. Non-forced
`npm audit fix --dry-run --ignore-scripts --json` leaves all 11 high findings;
its proposed additions do not change the affected versions. The suggested forced
Nuxt 4.1.3 downgrade is not adopted. No third-party forks or blanket audit
suppression are introduced.

## Phase and input assessment

In the installed Nitro source, `dist/core/index.mjs` and `dist/rollup/index.mjs`
use globby to scan project/configured directories and asset patterns during
preparation and bundling. The example has fixed project configuration and no
request handler that accepts user-provided glob patterns. Treat repository,
configuration, modules and build inputs as trusted: a malicious contributor can
still supply problematic inputs to this unpatched build dependency.

`listhen/dist/shared/listhen.tqe5I1Rl.mjs` imports node-forge for local HTTPS
certificate/key generation and optional certificate/PFX handling. Its reviewed
source generates and signs certificates; no direct call to the advisory's RSA
signature-verification operation was found there. Importing a vulnerable library
is not proof of invoking the affected operation. This is bounded source inspection,
not an exhaustive call-graph proof for every optional HTTPS configuration.

The reference uses Nitro's `node-server` output and starts production with
`node .output/server/index.mjs`, rather than the development listener. The default
`npm run dev` now explicitly binds to `127.0.0.1`. Do not expose development
servers or feed untrusted build/glob/certificate inputs into this example.

## Production artifact and verification

`npm run check` built an isolated Nuxt consumer from the actual core/Vue tarballs,
passed strict Nuxt type checking and the production build, and inspected all
**145 files** in `.output`. Its package inventory has 22 named manifests,
including the generated production app manifest. It found:

- No braces or node-forge package manifests.
- No micromatch, fast-glob, globby or listhen package manifests.
- No named references to those dependencies in emitted JS or JSON metadata.
- No filesystem symlinks that would pull development packages into deployment.

The built Node server then passed the existing live HTTP checks for both pages,
request-local theme attributes, served core CSS, labels/messages, initial form
models, selected options and escaping. Browser checks were not requested, and no
other integration tests were rerun.

`scripts/dependency-review.mjs` now performs the artifact inventory and reference
assertions on every Nuxt `npm run check`. This detects a change in the reviewed
deployment boundary; it does not replace future audits or establish universal
non-reachability of renamed/inlined code or newly added routes/modules. No
production-audit-zero claim is made from a text scan alone.

Deploy the self-contained `.output` artifact; do not deploy the example's installed
Nuxt development tree or use `nuxt dev` as a production server. Reassess after any
Nuxt/module/dependency/configuration change, if production begins shipping one of
the flagged packages, or when upstream fixes become available. The residual
build/dev findings remain visible in the normal audit and this record.
