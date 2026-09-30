---
layout: ../layouts/Layout.astro
title: Get started
---
# Get started

Link `reva.css`. Native HTML receives defaults automatically. Font loading is optional: link `reva-fonts.css` before it to load the bundled Manrope variable font.

```html
<link rel="stylesheet" href="reva-fonts.css">
<link rel="stylesheet" href="reva.css">
<button>Save changes</button>
```

## Choose only what you need

```html
<html data-theme="dark" data-accent="violet" data-shape="subtle">
```

Leaving settings out uses defaults. The nearest section setting wins. The scoped build uses `.reva` as its boundary, not a Shadow DOM isolation boundary. Overlay content must remain inside that boundary. Third-party class names inside it can still collide.

## Components

Use `.card`, `.grid`, `.row`, `.stack`, `.container`, `.prose`, `.table-scroll` and `.button` for links styled as actions. Keep `<button>` for actions and `<a>` for navigation. `.danger`, `.warning`, `.secondary`, `.outline` and `.ghost` provide button variants.

A scrollable table wrapper needs a label and keyboard focusability when necessary:

```html
<div class="table-scroll" role="region" aria-label="Bookings" tabindex="0">
  <table>...</table>
</div>
```

## Customise with ordinary CSS

```css
:root {
  --re-primary: #7041cf;
  --re-primary-end: #5228a4;
  --re-on-primary: #fff;
}
.product { padding: 2rem; }
```

Override both gradient stops and verify contrast. Local density affects spacing; local type affects typography; control size affects only the selected element. Font-heading defaults to the body font unless explicitly overridden.

## Accessibility responsibilities

Supply labels, meaningful link text, alternative text and explanatory errors in HTML. Native validation styling appears after interaction. The CSS does not invent error messages or announce application updates. Reduced-motion and forced-colour settings take priority over decorative presets.

Automatic checks support testing but do not certify WCAG 2.2 AA. Manual keyboard, screen-reader, text-spacing, zoom and current-browser verification are release requirements.

## Status

Foundation alpha. Full component set, glass extension, font packs and icon set are deferred. Docs contain no browser JavaScript. Use the API reference and browser Find for searching.
