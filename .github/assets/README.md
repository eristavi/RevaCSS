# GitHub presentation assets

The README preview and social card render the same native project-card markup in Light, Dark, Glass, and Veil. Component colors and materials come from the current built RevaCSS stylesheets. The HTML source supplies the composition and typography for these images.

Regenerate from the repository root:

```sh
npm ci
npm run build:css
npx playwright install chromium
node .github/assets/generate-preview.mjs
```

- `revacss-preview.png`: 1200 × 1160, linked from the main README.
- `revacss-social.png`: 1200 × 630, ready for GitHub's repository social preview.
- `preview.html`: source for both renders; no browser JavaScript.

To install the social card, use **Settings → General → Social preview → Edit → Upload an image**. Committing an image does not configure GitHub's social-preview setting.

## Repository About settings

Use the gear beside **About** on the repository's main page:

- Description: **A CSS framework for native HTML. Shared design defaults, adaptive themes, and native components—with no framework JavaScript runtime.**
- Website: **https://eristavi.github.io/RevaCSS/**
- Topics: `css`, `css-framework`, `design-system`, `html`, `dark-mode`, `glassmorphism`.

These are repository settings. Committing this file does not apply them; a repository administrator can set them through GitHub.
