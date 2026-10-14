# Next.js server reference

Install the local revacss and @revacss/react tarballs described in the
[adapter guide](https://github.com/eristavi/RevaCSS/tree/main/integrations/react),
then run npm install and npm run dev here. Next.js 16.4 needs its supported Node
runtime. This static-export App Router example imports CSS in the root layout and
renders the adapter directly in a Server Component. It has no form endpoint.
Browser/hydration acceptance remains deferred; application interactivity belongs
inside an application use-client boundary.
