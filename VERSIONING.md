# Versioning

RevaCSS follows semantic versioning: `MAJOR.MINOR.PATCH`.

| Release | Changes |
| --- | --- |
| Patch, such as `1.0.1` | Bug fixes and small visual refinements that preserve the public API and existing behaviour. |
| Minor, such as `1.1.0` | Backward-compatible additions: components, classes, materials, configuration options or supported attribute values. |
| Major, such as `2.0.0` | Breaking changes that require users to change their existing HTML, attributes, configuration or integration. |

Use the highest required increment when a release includes several changes. A minor release resets the patch number to zero; a major release resets both minor and patch numbers to zero.

## Public compatibility

The public API includes documented native HTML structures, structural classes, data attributes and their values, public CSS custom properties, stylesheet paths and package exports. Removing or renaming supported API, changing a default in a way that breaks existing layouts, or raising required browser support incompatibly requires a major release. An additive component or material is a minor release even if its implementation is small. Internal refactoring without a public behaviour change does not by itself require a new release.

## Release process

1. Record each user-visible change under `Unreleased` in `CHANGELOG.md` and classify it as a fix, compatible addition or breaking change.
2. Choose the increment from the complete set of changes. Bump once per published release, not once per commit or individual edit.
3. During release preparation, update `package.json` and `package-lock.json` together. Documentation reads its version from `package.json`.
4. Move the unreleased entries into a dated version heading; keep earlier release entries intact. Update installation examples and release notes to match the version actually being published.
5. Complete applicable release validation and quality gates, then publish matching `vX.Y.Z` GitHub and npm versions. Do not reuse an existing published version for changed package contents.

Documentation and demo edits may be deployed between package releases. Their deployment does not imply a new npm package version. Record them in the changelog when they affect users.

## Current release

Version **1.1.0** adds backward-compatible Soft UI, scrolling and modern CSS components. GitHub and npm publication status is recorded separately; changing package metadata does not establish registry availability.

The independent button materials are a compatible addition planned for **1.2.0**. They are available in the documentation development preview. Published 1.1.0 archives remain unchanged; package metadata will advance during 1.2.0 release preparation.
