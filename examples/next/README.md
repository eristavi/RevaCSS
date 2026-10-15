# Next.js server reference

Install the local revacss and @revacss/react tarballs described in the
[adapter guide](https://github.com/eristavi/RevaCSS/tree/main/integrations/react),
then run npm install and npm run dev here. Next.js 16.4 needs its supported Node
runtime. This static-export App Router example imports CSS in the root layout and
renders the adapter directly in a Server Component. It has no form endpoint.
The Server Component build and rendered markup are checked; React browser fixtures are reviewed separately. No Next-specific hydration acceptance is claimed. Application interactivity belongs inside an application use-client boundary.

Release scope and evidence: [2.0.0 validation record](https://github.com/eristavi/RevaCSS/blob/main/quality/releases/v2.0.0.md).
