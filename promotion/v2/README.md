# RevaCSS 2.0 launch kit

Prepared on 2026-10-15. This kit promotes the released 2.0.0 CSS core and keeps optional integrations separate.

## Assets

- `dev-community.md`: article ready for DEV; front matter deliberately leaves `published: false` until a confirmed publishing action.
- `submissions.md`: Show HN title/link/comment, CSS Weekly suggestion, and Product Hunt listing copy.
- `codepen-*.json`: complete CodePen prefill data with the release-pinned core stylesheet and an empty JavaScript panel.
- `codepen-*.html`: HTML panel contents for manual copying.
- `../../docs/public/launch/`: three standalone HTML/CSS demos and an index with CodePen export forms. The deployed URL is https://eristavi.github.io/RevaCSS/launch/index.html.

The demos pin the stylesheet to the v2.0.0 Git tag via jsDelivr's GitHub CDN. They do not assume npm 2.0 publication. The launch page's CodePen buttons open an editable copy; a saved public Pen URL still requires CodePen publication.

## Publication status

- Launch hub: deployed successfully by workflow 38691280879. Verified public URL: https://revacss.eristavi.org/launch/index.html.
- Awesome CSS Frameworks: entry committed to eristavi/awesome-css-frameworks branch `add-revacss`; opening the upstream PR through the GitHub integration returned HTTP 403, Resource not accessible by integration. Not submitted upstream yet.
- DEV: signed in and saved as an unpublished draft with showdev, css, html and opensource tags. Editor: https://dev.to/eristavi/revacss-20-start-with-html-set-your-defaults-once-4lk7-temp-slug-9968932/edit. Automatic approval review rejected selecting the Fully Autonomous AI Generated disclosure pending user approval; no disclosure was selected and the article was not published.
- CodePen: three prefills prepared; the browser is anonymous and no public Pens are saved yet.
- Show HN: copy prepared; the submission page requires sign-in. Not submitted.
- CSS Weekly: suggestion prepared; not sent.
- Product Hunt: copy prepared; not published.

Directory contribution follows https://github.com/troxler/awesome-css-frameworks/blob/master/.github/CONTRIBUTING.md: General Purpose category, entry template, star badge, demo/docs/repo links, CSS marker, and a maintainer disclosure in the proposed PR. Inclusion remains at the directory maintainer's discretion.
