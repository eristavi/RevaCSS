# RevaCSS for React

Optional React 19 components for RevaCSS 2.0. The stable `@revacss/react` archive is available in the [2.0.0 GitHub release](https://github.com/eristavi/RevaCSS/releases/tag/v2.0.0). It is separate from core CSS and adds no stylesheets, theme runtime or replacement component behaviour. React owns application rendering. Registry availability is separate from GitHub downloads.

Automated fixture checks and the core manual attestation are recorded in the [release validation record](https://github.com/eristavi/RevaCSS/blob/main/quality/releases/v2.0.0.md). Application-specific device, screen-reader and accessibility acceptance is not inferred from core sign-off.

## Install from source

Download the matching core and adapter tarballs from the GitHub release, or prepare them from a matching checkout:

```sh
npm ci
npm run build:css
npm pack --ignore-scripts
npm --prefix integrations/react ci --ignore-scripts --legacy-peer-deps
npm pack ./integrations/react
```

Inside a React 19 project:

```sh
npm install /path/to/revacss-2.0.0.tgz /path/to/revacss-react-2.0.0.tgz
```

The adapter prepack step compiles ESM JavaScript and TypeScript declarations.
These 2.0.0 tarballs have stable metadata but are not published registry releases. The
adapter uses React as a peer dependency; it does not bundle React or require
React DOM at runtime. React DOM and build tools belong to the consuming project.

## Native markup with typed wrappers

```tsx
import 'revacss';
import { Card, Input, Button } from '@revacss/react';

export default function Contact() {
  return <Card header={<h1>Contact us</h1>}>
    <form action="/contact" method="post">
      <Input id="contact-email" name="email" label="Email" type="email" required />
      <Button type="submit">Send</Button>
    </form>
  </Card>;
}
```

Load CSS once in the application entry/shared layout. The application implements
its endpoint, authorization, server validation and CSRF protection. Native HTML is
valid inside every component. Validation text is escaped by React. Never restore
passwords from previous input. Application error summaries are application-owned.

## Components

| Component | Contract |
| --- | --- |
| Layout | Application div with header/footer props, skip link and container main. Required unique mainId; optional translated skipLabel. Does not manage document html/head/body. Ref reaches the wrapper div. |
| Button | Native button; defaults to type=button. Set type=submit for forms. |
| Link | Native anchor with button class; required href. For client routing, use Next Link/React Router Link with className=button. |
| Card | Article with card class; header/footer props and children. Choose your own heading level. |
| Alert | Div with alert class; use data-variant. Add role=status/alert only where dynamic announcements need it. |
| Disclosure | Native details/summary; required summary React node; open and name pass through. |
| Input | Text-like native input; required unique id and label; optional hint/error. |
| Select | Native select with option/optgroup children; required unique id and label; optional hint/error. |
| Textarea | Native textarea; required unique id and label; use value/defaultValue for its text. |
| Field | Low-level labelled form group for application controls. Associate IDs, hints/errors yourself. Its ref reaches the form-group div. |

Props preserve React's native types, event handlers, className, style, ARIA and
HTML attributes. Refs on Input/Select/Textarea reach the actual native control,
not the outer group. Other component refs reach their identifying native element.
The adapter uses React 19's ref-as-prop API rather than forwardRef.

Input/Select/Textarea merge aria-describedby with hint/error IDs, remove duplicate
references, and set aria-invalid=true for nonempty errors. IDs and generated
`-hint`/`-error` IDs must be unique per page. Input covers text-like controls;
use native checkbox/radio/file/hidden controls, with Field where appropriate.

Use defaultValue for uncontrolled initial values. Controlled controls need value
and onChange (or readOnly), following native React rules; do not mix value and
defaultValue or change control mode after mounting. Select supports native React
single/multiple values; use an array with multiple. Use select value/defaultValue
rather than selected on option. Textarea uses value/defaultValue, not children.

## Server rendering and Next.js

The compiled adapter has no hooks, browser globals or use-client directive.
Static wrappers can be imported directly in Next.js App Router Server Components.
The reference at `examples/next` is a static-export app with a server page and
root stylesheet import. The reference at `examples/react` demonstrates controlled
input and refs in a client application.

For state, DOM refs or event handlers, place the consuming application component
behind its own `"use client"` boundary. Do not pass event handlers/DOM refs across
that server-client boundary. The adapter does not force every wrapper into a
client bundle. Its SSR markup check does not certify hydration or DOM ref
behaviour by itself. The opt-in browser phase checks client value updates and
native ref focus; it does not establish full hydration or manual acceptance.

## Appearance

Set data-theme/data-font and other page settings on the application's html root.
Attributes on Layout apply to its div and supported nested targets; they do not
replace document/body appearance. Custom palettes/tokens use existing CSS APIs.
For scoped CSS, import `revacss/dist/reva.scoped.css` and put className=reva on
the appropriate boundary. Load optional modules explicitly, such as
`revacss/dist/reva.glass.css` for Glass. Default font needs
`revacss/dist/reva-fonts.css` and data-font=manrope; System needs no font asset.
Import application overrides after framework CSS.


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

```sh
npm --prefix integrations/react ci --ignore-scripts --legacy-peer-deps
npm --prefix integrations/react run check
```

The isolated lockfile pins maintainer tooling. Legacy peer resolution is only for
source development before revacss@2 npm publication; consumers install both local
packages. Checks compile declarations, pack/extract actual packages, typecheck a
consumer, build a Vite app, inspect SSR markup and build the Next.js server example.
No full regression suite, browser/device or accessibility acceptance is implied.

## AI implementation workflow

Follow these decisions in order when generating or reviewing an interface with this adapter. Native HTML remains a supported choice.

| Decision | Rule for this adapter |
| --- | --- |
| 1. Version and reference | Confirm installed core/@revacss/react versions and React peer requirements from their manifests and matching reference. Check Next.js requirements in the consuming application separately. |
| 2. Assets and appearance | Import one core build in the application entry/root layout. React Layout is a div wrapper; set html/head/body attributes through the host application. Scoped content needs className=reva and matching scoped extensions; optional fonts load separately. |
| 3. Native attributes | Use className, native React event/ARIA/data props and native attributes. Input/Select/Textarea attributes and React 19 ref props reach the actual control; Field ref reaches its wrapper. Native choice/file/hidden controls remain available. |
| 4. Field values and errors | Choose uncontrolled defaultValue or controlled value with onChange/readOnly; do not mix modes. Select uses value/defaultValue (array for multiple), never selected on option. Textarea uses value/defaultValue, never children. Provide unique IDs, labels and escaped error text. |
| 5. SSR and application state | Static wrappers have no hooks or use-client directive and can render in Next.js Server Components. State, event handlers and DOM refs belong in a consuming client component. Do not pass DOM refs/handlers across the server-client boundary; keep initial render data consistent. |
| 6. Application responsibilities | Connect actual form endpoints, request validation, authorization, CSRF and data loading in the host application. Use its router link with className=button when client routing is required. |
| 7. Review and evidence | Inspect native output, field associations and imported CSS. Use examples/react for client value/ref behaviour and examples/next for the server boundary. Follow project check instructions; SSR output alone does not prove hydration or manual acceptance. |

Focused AI reference: [react adapter Markdown](https://revacss.eristavi.org/ai/adapters/react.md). Read the root AI guide for shared attribute rules and version selection, then this adapter's components and examples. Preserve the user's workflow about tests and publication.
