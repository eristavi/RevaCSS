# Astro reference application

Install the two locally packed packages described in the
[adapter guide](https://github.com/eristavi/RevaCSS/tree/main/integrations/astro),
then run `npm install` and `npm run dev` from this directory. Astro 7 requires its
supported Node runtime. The root maintainer test uses the repository's locked
Astro version.

The pages demonstrate global and scoped CSS, native component slots, field
associations and escaped server validation messages. The form has no backend;
its send button is disabled. No browser JavaScript is shipped. Browser/device
acceptance is deferred until the version 2 release review.
