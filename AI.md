# Using RevaCSS with AI

RevaCSS is an HTML/CSS-first framework with a zero-JavaScript core. Use native HTML, a small set of documented component classes and inherited data attributes. Start with working markup and adapt it to the project.

This guide is for people building with an AI assistant and for agents given this file as project context. Follow the user's instructions and the project's existing workflow. This file describes RevaCSS usage; it does not authorize publishing, installing tools or running tests.

## Give your assistant the right context

Tell your assistant to use RevaCSS explicitly. Give it the current documentation index at `/llms.txt` under the documentation site's base path, then the relevant Markdown reference pages listed there. For GitHub Pages, that base path is `/RevaCSS/`.

The generated `/ai/api.json` contains the package version, exact supported attribute values, component contracts and HTML examples. `/ai/html-custom-data.json` provides attribute descriptions and value suggestions for compatible HTML editors. `/llms-full.txt` combines the guide and generated reference; it is large, so prefer individual pages when only one component is needed.

Use the version shown in the reference. Consult the getting-started guide for a published download or npm package. Do not assume the newest source version is already available on npm, invent a CDN URL or mix files from different releases.

## Start with a complete page

Download the compiled starter from the release linked in the getting-started guide. Put this document beside its `dist` directory. The generated global stylesheet works without a package manager or CSS build step.

```html
<!doctype html>
<html lang="en" data-theme="auto" data-palette="default">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My RevaCSS project</title>
    <link rel="stylesheet" href="dist/reva.css">
  </head>
  <body>
    <main class="container">
      <h1>Your projects</h1>
      <article class="card">
        <h2>First project</h2>
        <p>A clear starting point for your work.</p>
        <form action="/projects" method="post">
          <div class="form-group">
            <label for="project-name">Project name</label>
            <input id="project-name" name="name" required>
          </div>
          <button type="submit">Create project</button>
        </form>
      </article>
    </main>
  </body>
</html>
```

The form destination above is a placeholder: replace it with your application's real endpoint. RevaCSS styles the form; your application handles saving the project.

## Configure shared defaults

Put shared appearance settings on `html`, or on a documented local boundary when only one section should change. Add local overrides only for intentional exceptions.

```html
<html lang="en"
      data-theme="auto"
      data-palette="forest"
      data-shape="rounded"
      data-density="comfortable">
```

Use `data-theme="auto"` for the system preference. Use `data-shape` for corner shape. Read the generated attribute reference for the exact values and scope of each option; a setting affects its supported targets, not every HTML element.

Start with one complete global or scoped build. The scoped build uses a `.reva` boundary. Load matching optional extensions after that build. Glass, Veil, Soft UI and independent button materials require their respective extension files. Preserve reduced-motion, forced-colour and contrast fallbacks.

For colours, shapes and spacing, prefer existing attributes and documented public tokens. Use ordinary application CSS for page composition or custom styling beyond those options. Never promise an effect just because an attribute name sounds plausible.

## Preserve component contracts

- Use a native `button` for actions and `a.button` for destinations. Native controls do not need an invented button class.
- Use labelled native inputs, selects, textareas, fieldsets and legends. Keep names, values, validation and form destinations meaningful.
- Use `details` and `summary` for documented disclosures. Native popovers need unique IDs and matching `popovertarget` values.
- Copy the full documented structure for navigation, drawers and radio-selected panels. Do not replace it with markup from another framework.
- Radio-selected content is not an ARIA tabs widget. A native popover drawer is not a modal dialog or focus trap.
- Keep IDs and radio-group names unique when combining examples. Replace demonstration links and sample data with real project content.
- Follow the required styling dependencies listed in the component reference. Individual component files are not independent behaviour packages.

Read a component's Markdown page before generating its markup. The page includes its hook, states, styling module, behaviour limits and existing examples. For a complex navbar, consult the full top-menu documentation or a complete demo's source.

## Connect application behaviour

CSS supplies appearance and supported native interactions. Your application supplies data, search, sorting, authentication, form processing, payments, persistent state and real-time updates.

Add application JavaScript where the product requires it. Keep that code separate from the zero-JavaScript CSS core. The documentation's optional appearance customizer is a demo helper, not a runtime dependency for ordinary RevaCSS pages.

Use progressive enhancement for modern CSS. Follow the documented browser support and fallbacks. Do not claim accessibility certification or physical-device validation from generated markup alone.

## Prompts you can adapt

**Build a landing page:** “Use RevaCSS and its current AI reference to create a responsive HTML landing page. Use native HTML, shared appearance attributes and documented component structures. Include pricing, an FAQ and a labelled contact form. Identify the form endpoint I need to connect.”

**Adapt a demo:** “Start from the RevaCSS shop demo. Preserve its native navigation and component markup. Replace the fictional products with my catalogue, use the forest palette and keep system light/dark mode. Show where product data and checkout should connect.”

**Change the appearance:** “Update my RevaCSS page to use the ocean palette and a spacious density through shared settings. Preserve local semantic states and accessibility fallbacks. Use only values supported by the current reference.”

**Review generated code:** “Compare this page with the RevaCSS component contracts. Flag unsupported attributes, missing extensions, duplicate IDs, placeholder destinations and missing labels. Follow my project's instructions about when to run tests.”

## Workflow for agents

1. Read the installed package version and the matching RevaCSS reference.
2. Select the relevant component pages and existing demo sources.
3. Choose global or scoped CSS and the required extensions.
4. Generate meaningful HTML, then apply shared defaults and intentional local overrides.
5. Connect the application's behaviour without changing the framework's core contract.
6. Review the result and report its limitations. Run tests only when the user or project workflow authorizes them; when deferred, say they have not been run.

The text reference is generated from the documentation's component contracts, examples, public tokens and option manifest on each documentation build. It helps agents look up the supported API; it does not guarantee that an AI service will discover or read it automatically.

## Unreleased source additions

The current documentation preview includes additions not yet in the published 1.2.1 packages. Do not assume these classes exist in that npm/GitHub release. Tests for the additions are deferred.

- Put `.responsive` on a separate, full-width wrapper inside a sized parent. Descendant `.grid.cols-2`/`.grid.cols-3`, toolbars, card footer rows and navigation rails adapt to that wrapper. Do not put containment on a subgrid card. Viewport/intrinsic fallbacks remain.
- Use native `dir="rtl"` and `lang` for RTL pages, and `dir="auto"` or `bdi` for mixed user content. Do not reverse DOM order or mirror every icon.
- Use `.visually-hidden` for necessary accessible labels. Focusable content using it is revealed on keyboard focus. Decorative content still needs `aria-hidden` where appropriate.
- Print utilities: `.no-print` hides, `.print-only` reveals and `.print-links` appends HTTP(S) destinations on paper. These are opt-in; ordinary link styling does not append URLs.
- Required status and error explanations are visible HTML text. Applications supply validation messages and state; CSS does not compute range outputs or replace native pickers.
