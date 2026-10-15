---
title: "RevaCSS 2.0: start with HTML, set your defaults once"
published: false
tags: showdev, css, html, opensource
---

I built RevaCSS around a question: how much of an interface can we leave to HTML and CSS, while still giving it a consistent design?

Version 2.0 is now available on GitHub. Its core is CSS, with no JavaScript runtime and no required build step for using the compiled stylesheet.

[Try three small examples](https://eristavi.github.io/RevaCSS/launch/index.html) · [Documentation](https://eristavi.github.io/RevaCSS/) · [Source and downloads](https://github.com/eristavi/RevaCSS/releases/tag/v2.0.0)

## Set the defaults on a parent

RevaCSS uses data attributes to choose shared appearance settings. A page or section can set its theme, palette, shape and sizing. Components inside it pick up those choices through the framework's CSS rules and custom properties.

```html
<section data-theme="dark" data-palette="default" data-shape="rounded">
  <article class="card">
    <h2>A small project</h2>
    <p>Shared defaults, with room for local changes.</p>
    <a class="button" href="/projects">Browse projects</a>
    <a class="button secondary" data-shape="pill" href="/about">About us</a>
  </article>
</section>
```

The second link overrides its shape locally. The other shared appearance choices still come from the section.

The attributes themselves do not inherit: CSS implements the behaviour. A small set of classes identifies structures such as cards, containers, grids and stacks.

[See the same interface in two treatments](https://eristavi.github.io/RevaCSS/launch/defaults.html).

## Keep browser behaviour in HTML

A disclosure is still a `details` element with a `summary`. An exclusive group uses matching `name` values in supporting browsers:

```html
<details name="project-faq">
  <summary>Does this need JavaScript?</summary>
  <p>The browser handles this disclosure.</p>
</details>
<details name="project-faq">
  <summary>Can I customise the design?</summary>
  <p>Use appearance attributes and ordinary CSS tokens.</p>
</details>
```

Native popovers use `popover` and `popovertarget`. Forms keep their labels, field types and browser validation. CSS motion enhances disclosures where the browser supports the necessary features; native interaction remains available without those enhancements.

[Try the disclosures and popover](https://eristavi.github.io/RevaCSS/launch/native.html), or [inspect a small form](https://eristavi.github.io/RevaCSS/launch/forms.html). These examples contain no JavaScript.

## Use ordinary CSS for your own design

Version 2.0 includes Default and Mono palettes, light/dark/system themes, shared geometry and spacing, and a system font option. Custom properties let you supply your own colours and design decisions.

The compiled core stylesheet is about 104 KiB minified, or about 16 KiB gzipped. Optional extensions are separate; those figures describe the core rather than every possible material or effect.

You can use RevaCSS in static HTML or server-rendered templates. Separate integrations are provided for Astro, Vue/Nuxt, React/Next.js, Svelte/SvelteKit and Laravel. They sit outside the CSS core; the application frameworks still have their own normal runtimes and responsibilities.

## Try it without a build step

Download `reva-2.0.0.min.css` from the [GitHub release](https://github.com/eristavi/RevaCSS/releases/tag/v2.0.0), save it beside your page, and link it:

```html
<link rel="stylesheet" href="reva-2.0.0.min.css">
```

Then write your HTML. The demo hub also has an **Open in CodePen** button for each example so you can change the markup and styling yourself.

RevaCSS is MIT-licensed. It is a young project, and I would especially welcome feedback on the shared-defaults approach: does it make your markup easier to work with, and where would you want more control?

[Documentation](https://eristavi.github.io/RevaCSS/) · [GitHub](https://github.com/eristavi/RevaCSS)
