# Accordion motion — development record

Native `.accordion > details` now follows inherited `data-motion`.

- None: immediate disclosure and chevron state.
- Subtle: 140ms intrinsic block-size transition and chevron rotation.
- Expressive: 240ms, with a content fade.
- Content transitions are gated on `::details-content`, intrinsic-size interpolation and discrete transitions. Unsupported browsers retain native instant disclosure; no fixed content height or JavaScript.
- Reduced motion, forced colours and print disable transitions.
- Ordinary details, including the demo customiser disclosures, are outside this enhancement.
- The demo customiser reuses the canonical motion tokens, so its Motion option also controls FAQ accordions.

Implementation reference: https://developer.chrome.com/blog/styling-details

## Validation status

CSS and documentation compilation only. Automated tests, browser checks and actual-device checks have not been run for this change, per the user's instruction. Previous iPhone checks do not cover this addition.

When requested, check expansion/collapse, quick repeated toggles, exclusive groups, long content and links/controls, keyboard focus outlines, local overrides, reduced motion, forced colours, print, supported intrinsic-size transitions and the unsupported-browser fallback.
