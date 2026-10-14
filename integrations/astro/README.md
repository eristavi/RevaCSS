# RevaCSS for Astro

Optional Astro 7 components for the RevaCSS 2.0 source candidate. The proposed
`@revacss/astro` package is not published. It is distributed separately from the
CSS package; it does not change core CSS or add browser JavaScript. Automated native browser checks are recorded below; physical-device and visual
acceptance remain required for the 2.0 release review.

The RevaCSS documentation site already uses Astro. This adapter makes reusable
components available to consuming projects; existing native markup remains valid.

## Install from source

From a RevaCSS checkout:

```sh
npm ci
npm run build:css
npm pack --ignore-scripts
npm pack ./integrations/astro --ignore-scripts
```

Install the two generated tarballs in an Astro 7 application:

```sh
npm install /path/to/revacss-2.0.0.tgz /path/to/revacss-astro-2.0.0-dev.0.tgz
```

The CSS package version is still a candidate. Do not interpret its version as a
published or accepted release. No `astro.config` integration is required.

## Create a page

```astro
---
import 'revacss';
import Layout from '@revacss/astro/Layout.astro';
import Card from '@revacss/astro/Card.astro';
import Input from '@revacss/astro/Input.astro';
import Button from '@revacss/astro/Button.astro';
---
<Layout title="Contact" data-theme="auto" data-font="system">
  <Card>
    <h1 slot="header">Contact us</h1>
    <form action="/contact" method="post">
      <Input id="contact-email" name="email" label="Email" type="email" required />
      <Button type="submit">Send</Button>
    </form>
  </Card>
</Layout>
```

Implement the POST endpoint, validation, authorization and any CSRF protection in
your application. A static build cannot process that form on its own. Pass safe
server validation messages through `error` and safe prior values through `value`.
Never repopulate passwords with previous values.

## Components

| Component | Contract |
| --- | --- |
| Layout | Full document; required `title`; optional description, mainId and translated skipLabel; head/header/footer slots. HTML attributes reach the root. |
| Button | Native button; defaults to type=button. Set type=submit for forms. |
| Link | Native anchor with the button class; required href. No artificial disabled-link behaviour. |
| Card | Article with card class; optional header/footer slots. Supply your own heading level. |
| Alert | Div with alert class; supply data-variant. Add role=status or role=alert only when appropriate for dynamic announcements. |
| Disclosure | Native details/summary; required summary; supports open and name. |
| Input | Text-like native input; required unique id and label; optional hint/error. Native attributes pass through. |
| Select | Native select; required unique id and label; option/optgroup children. Mark the appropriate option selected. |
| Textarea | Native textarea; required unique id and label; text content belongs in the default slot. |
| Field | Low-level labelled form group for application controls. Wire their IDs and description/error associations yourself. |

Input, Select and Textarea merge caller aria-describedby with generated hint/error
IDs and set aria-invalid=true when error is nonempty. Caller classes, data attributes,
ARIA attributes and native constraints pass through. IDs must be unique per page,
including generated `-hint` and `-error` IDs. Render server error summaries in the
application when needed. Use native checkbox/radio markup inside Field; Input is
intentionally restricted to text-like controls.

## Styles and customization

Load global CSS once in your application layout or page frontmatter. Layout does
not import CSS or fonts, so you can choose global, scoped or modular builds.
For scoped CSS, import `revacss/dist/reva.scoped.css` and put `class="reva"` on
Layout. Load each optional extension explicitly (for example
`revacss/dist/reva.glass.css` for Glass). For Default font, import
`revacss/dist/reva-fonts.css` and select `data-font="manrope"`; System needs no font
asset. Put application overrides after framework imports.

Use the existing data attributes and CSS tokens. There is no second appearance
engine, theme script, automatic stylesheet injection or hydration directive.
Do not add client:* to these server-rendered Astro components. JavaScript islands
remain an independent application choice. Astro scoped styles require :global()
when targeting markup rendered inside a child component.


## Automated browser review

The requested 14 October 2026 review checks this candidate in Chromium, Firefox
and WebKit. It covers native control activation, applicable hydrated value changes,
DOM focus through applicable ref/element bindings, disclosure toggles, disabled
controls, axe assertions and page reflow at 320/375/768/1280px. These checks are
limited to the reference fixtures, not all possible application combinations.
Physical devices, screen readers, actual zoom/print and visual approval remain
manual release requirements. Set `REVA_BROWSER_CHECKS=1` and optionally
`REVA_TEST_ENGINE=chromium|firefox|webkit` when running the maintainer check.
Without the flag, checks remain compilation/SSR only.

## Maintainer checks

Run `npm run test:astro` from the repository root. The test packs and installs both
packages into an isolated fixture, builds it with Astro, and inspects rendered
HTML, assets, form associations, escaping, scoped styling and script absence.
Default checks provide build/markup evidence; the opt-in browser phase provides
the limited automated coverage described above, without manual acceptance.
