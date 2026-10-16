# RevaCSS for Astro

Optional Astro 7 components for RevaCSS 2.0. The stable `@revacss/astro` archive is available in the [2.0.0 GitHub release](https://github.com/eristavi/RevaCSS/releases/tag/v2.0.0). It is separate from core CSS and adds no browser JavaScript. Existing native markup remains valid. Registry availability is separate from GitHub downloads.

Automated fixture checks and the core manual attestation are recorded in the [release validation record](https://github.com/eristavi/RevaCSS/blob/main/quality/releases/v2.0.0.md). Application-specific device, screen-reader and accessibility acceptance is not inferred from core sign-off.

## Install from source

Download the matching core and adapter tarballs from the GitHub release, or prepare them from a matching checkout:

```sh
npm ci
npm run build:css
npm pack --ignore-scripts
npm pack ./integrations/astro --ignore-scripts
```

Install the two generated tarballs in an Astro 7 application:

```sh
npm install /path/to/revacss-2.0.0.tgz /path/to/revacss-astro-2.0.0.tgz
```

Stable package metadata does not establish registry publication or replace the
recorded release validation. No `astro.config` integration is required.

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

The requested 14 October 2026 review passed the reference fixtures in Chromium, Firefox
and WebKit. It covers native control activation, applicable hydrated value changes,
DOM focus through applicable ref/element bindings, disclosure toggles, disabled
controls, axe assertions and page reflow at 320/375/768/1280px. These checks are
limited to the reference fixtures, not all possible application combinations.
The core maintainer manual attestation is recorded separately; it does not establish itemised physical-device, screen-reader, actual zoom/print or visual acceptance for every adapter fixture. Set `REVA_BROWSER_CHECKS=1` and optionally
`REVA_TEST_ENGINE=chromium|firefox|webkit` when running the maintainer check.
Without the flag, checks remain compilation/SSR only.

## Maintainer checks

Run `npm run test:astro` from the repository root. The test packs and installs both
packages into an isolated fixture, builds it with Astro, and inspects rendered
HTML, assets, form associations, escaping, scoped styling and script absence.
Default checks provide build/markup evidence; the opt-in browser phase provides
the limited automated coverage described above, without manual acceptance.

## AI implementation workflow

Follow these decisions in order when generating or reviewing an interface with this adapter. Native HTML remains a supported choice.

| Decision | Rule for this adapter |
| --- | --- |
| 1. Version and reference | Confirm the installed core and @revacss/astro versions, Astro peer requirement and matching component contracts. Stable manifests do not establish registry availability. |
| 2. Assets and appearance | Import one core build in shared frontmatter/layout. This Layout renders html/head/body and forwards document attributes to html; scoped mode uses class=reva there. Load matching scoped/global extensions explicitly; font files remain optional. |
| 3. Native attributes | Native attributes, ARIA and data attributes pass through. Input/Select/Textarea forward control attributes to the native control, not the outer Field. Use native checkbox/radio/file controls with Field as appropriate. |
| 4. Field values and errors | Provide unique IDs and labels; hint/error descriptions are associated by the adapter. Use input value, selected on native options and the Textarea default slot. Escape prior values and never restore passwords. Supply any error summary in the application. |
| 5. SSR and application state | These .astro components render on the server or at build time; do not add client:* to them. A static output cannot implement POST processing; use an actual server endpoint or the application's form service. |
| 6. Application responsibilities | Connect real routes, authorization, CSRF and server validation through the consuming application. Native HTML may be used alongside wrappers; the adapter adds no routing or data service. |
| 7. Review and evidence | Inspect rendered IDs, label/error references, native states, stylesheet imports and full component structure. Use examples/astro as the reference. Follow project instructions for checks and report what was actually verified. |

Focused AI reference: [astro adapter Markdown](https://revacss.eristavi.org/ai/adapters/astro.md). Read the root AI guide for shared attribute rules and version selection, then this adapter's components and examples. Preserve the user's workflow about tests and publication.
