# RevaCSS 1.1.0 — Erisian

Native HTML, inherited design settings and a CSS-only framework core.

## What changed

- Optional Soft UI material with global/scoped styles, raised surfaces, inset fields and pressed actions.
- Motion-aware native anchor scrolling, expressive target emphasis and a labelled `.scroll-top` anchor.
- Native scroll-snap galleries, three-region subgrid cards and container-responsive card actions.
- Safe-area spacing, optional dialog/drawer entrance and discrete exit motion, RTL support and preference fallbacks.
- Optional scroll-driven card entrances and same-origin document transitions.
- Updated shop, marketing, dashboard and blog examples; motion/state-feedback guides and an expanded starter page.
- Shared documentation customizer, immediate Firefox material updates and smaller documentation/font assets.

The complete core remains below its 15 KiB gzip budget. Materials, overlay motion, scroll-driven entrances, document transitions and fonts load separately. No framework JavaScript runtime or consumer build step is required.

## Downloads

- `revacss-1.1.0-erisian.zip` and `revacss-1.1.0-erisian.tar.gz`: compiled CSS, tokens, icons, optional font, licenses and documentation.
- `reva-1.1.0.min.css`: standalone complete minified core.
- `SHA256SUMS.txt`: download checksums.

Extract an archive and open `starter.html` or the identical `index.html`. Instructions cover installation, inherited configuration and native component examples. Optional extensions and fonts are separate assets.

## Validation and limits

See the [validation record](https://github.com/eristavi/RevaCSS/blob/v1.1.0/quality/releases/v1.1.0.md) for automated results and maintainer manual sign-off. The six manual gates are closed on the maintainer's report; exact device/browser versions and captured manual evidence were not supplied. This release does not claim accessibility certification.

Native browsers control scrolling duration, focus restoration and overlay behavior. Unsupported enhancements fall back to static content or ordinary navigation. Applications own dialog invocation, routing, forms, data and business behavior. Fixed headers and floating controls must reserve space so they do not cover focused content.

npm version 1.1.0 is prepared but publication requires an authenticated npm account. Until registry publication is verified, use these GitHub downloads; pinned 1.1.0 CDN URLs are not yet confirmed available.

[Documentation](https://eristavi.github.io/RevaCSS/) · [Changelog](https://github.com/eristavi/RevaCSS/blob/v1.1.0/CHANGELOG.md)
