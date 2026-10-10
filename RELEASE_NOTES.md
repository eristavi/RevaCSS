# RevaCSS 1.2.1 — Erisian

Native HTML, inherited design settings and a CSS-only framework core.

## What changed

- Six new palettes: Terracotta, Burgundy, Copper, Rose, Aubergine and Slate, bringing the total to 14 with complete light/dark tokens.
- Independent button materials: default, solid, glass, veil, soft and transparent neutral liquid, in optional global/scoped modules. Navigation controls retain their normal appearance.
- Independent navbar layout, static/sticky position, flush/spaced spacing and contained/full width.
- Flush navigation removes top borders and decorative shadows/highlights. Mobile Flush and desktop Full width use square corners.
- Compact mobile demo headers; mobile documentation access is inside Customize, with contact/journal actions available in the native Menu.
- One persistent customizer profile shared by documentation and demo pages, with a dedicated Navbar category and migration of older saved settings.
- Corrected live Firefox material updates and isolated documentation preview defaults.
- Script-free standalone preview customization, a scrollable navbar sizing reference and patched transitive build dependencies.

The framework has no JavaScript runtime or consumer build requirement. The optional documentation settings helper remains separate.

## Downloads

- `revacss-1.2.1-erisian.zip` and `revacss-1.2.1-erisian.tar.gz`: compiled global/scoped/modular CSS, optional materials, tokens, icons, fonts, licenses and starter HTML.
- `reva-1.2.1.min.css`: complete standalone minified core.
- `revacss-1.2.1.tgz`: prepared npm package for a local tarball install.
- `SHA256SUMS.txt`: checksums for the downloads.

Extract an archive and open `starter.html` or the identical `index.html`. Optional extensions and fonts load separately.

## Validation

Publication is gated on the full Chromium, Firefox and WebKit suite, unit/token/contrast/size checks, root and GitHub Pages documentation paths, installed-package tests in all three engines, and ordinary/npm release-quality gates. See the [validation record](https://github.com/eristavi/RevaCSS/blob/v1.2.1/quality/releases/v1.2.1.md) and the linked release workflow for exact results.

Revaz Eristavi reported the visual tests completed without issues on 10 October 2026 and authorized this release. Earlier manual acceptance is retained in the quality registry. Headless WebKit supplements real Safari/device review.

GitHub distribution publication does not publish to npm. Registry publication of 1.2.1 requires npm authentication; versioned CDN availability follows verified registry publication.

[Documentation](https://eristavi.github.io/RevaCSS/) · [Changelog](https://github.com/eristavi/RevaCSS/blob/v1.2.1/CHANGELOG.md)
