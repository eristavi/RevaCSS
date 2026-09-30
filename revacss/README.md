# RevaCSS

A new default for the web. Native HTML and CSS, token-driven design, easy overrides.

**Foundation alpha:** not a complete component library or a WCAG certification.

```html
<link rel="stylesheet" href="reva.css">
<button>Get started</button>
```

`npm ci` then `npm run build`. `npm run dev` previews the Astro docs.
`npm test` validates tokens, contrast pairs and size budgets.
`npm run test:browser` runs Chromium checks (install it with `npx playwright install chromium`).

Built files: `dist/reva.css`, `dist/reva.min.css`, `dist/reva.scoped.css`, module files, and opt-in `dist/reva-fonts.css`. Font loading is separate to avoid mandatory downloads.

Complete release decisions live in SPECIFICATION.md. Read IMPLEMENTATION.md for what is implemented and deferred. Core is MIT; fonts retain their own licence. Package publication, repository creation and deployment have not occurred.
