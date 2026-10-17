# P0 architectural foundations

Base: 29cc07cee48bfe9b1536008f7bb06ee9da531de5. These are additive source changes for a future compatible release, not a replacement 2.0.0 publication.

| P0 item | Result |
| --- | --- |
| Authoritative architectural contract | ARCHITECTURE.md; linked from specification, agent/contributor guides, AI guidance and all five adapter READMEs. |
| Public markup audit | All 72 class hooks and every documented component accounted for through shared source catalogs; human and AI references publish rationale, preferred hooks and structural requirements. |
| Semantic structure/layout contract | Explicit local data-layout and data-surface hooks plus data-reva scoped boundaries. Native elements stay neutral; published class hooks remain supported. Native card header/footer patterns work with both surface hooks. |
| Inheritance contract | Full option-derived target/default/omission/reset/dependency/limitation matrix. Existing material-boundary exceptions are explicit; invalid values are not reset APIs. Nested scope/default and derived-token resolution limits are documented. |
| Cascade contract | Every generated CSS entry point declares the same existing layer order globally, before scopes; action materials precede utilities. Host layer ordering, important reversal and application overrides are documented. |

## Implementation boundaries

Layout/surface hooks are local, not inherited. Shared appearance remains inherited to documented consumers. Native article/main/footer meanings are preserved. One layout value per element; conflicting class/attribute layouts are unsupported. Surface/layout targets belong below a scoped boundary, matching existing descendant selector behaviour. No new browser runtime, new adapter props, class removals or automatic structural-element styling.

Selector aliases are present throughout source component patterns, surface materials, decorative edges, responsive rules, print and preference handling. Existing pattern classes remain justified presentation hooks; a mechanical class-to-attribute rewrite of the entire API is not claimed as semantic progress.

The package checker also needed an explicit allowlist for documentation and the optional server-side example already selected in package.json. It retains the browser-runtime prohibition and allows Python only at that exact documented example path. ARCHITECTURE.md is selected in npm and release archives.

## Verification

- CSS build and full Astro documentation build passed (253 pages).
- npm test: 50 passed, zero failed.
- npm run check:package passed: 138 packaged files inspected.
- Installed-package consumer suite: 5 passed, zero failed (offline assets, packaged documentation links, exports, Vite assets and strict TypeScript imports). The CI-discovered stale Python-example assertion and README link to an unshipped AGENTS.md were corrected before merge.
- git diff --check passed.
- Core minified gzip: 17,400 bytes, below the unchanged 17 KiB (17,408-byte) budget. Headroom is small; further size work belongs in P2.
- New Node checks verify complete catalog coverage, generated architectural records, every module's layer prelude/scoped boundary and attribute/class selector pairing across all CSS sources.
- Six browser regression cases were added for global/minified/modular/scoped equivalence, nested resets, application overrides and global/scoped material reset/re-entry with forced colours. They were not run locally: browser/device and manual acceptance remain deferred to the consolidated release review. Source/AST checks do not prove rendered behaviour.
- No publication, version bump or merge performed. Final release/manual acceptance remains pending in source-status.json.
