# RevaCSS component quality standard

Status: acceptance contract for the existing foundation alpha. This document does not certify accessibility or release readiness. No component redesign is included in this step.

## Required acceptance gates

Every shipped component needs recorded evidence for applicable gates; mark a gate not applicable with a reason, never silently omit it.

| Gate | Required result |
| --- | --- |
| HTML and behavior | Appropriate native semantics, names, labels and documented behavior. No browser JavaScript. Essential content stays in HTML. Test native activation with scripts disabled. |
| Shared appearance | Supported top-level settings reach documented targets; section/component overrides and neutral resets affect only their own setting. Test nested light/dark, tones and solid/glass re-entry. |
| Reflow and content | No unintended page overflow at 320 CSS pixels. Test 320/375/768/1280 widths, narrow parent containers, long unbroken labels, empty/full content, localization, and nested layouts. Tables/code may scroll in labelled keyboard-accessible regions. Do not hide broken content with page-level overflow suppression. |
| Text adaptability | No content/function loss at 200% text enlargement or actual browser zoom. Review reflow equivalent to 400% zoom on a 1280px viewport. Text-spacing overrides: line-height 1.5, paragraph spacing 2em, letter spacing .12em and word spacing .16em. Root-font enlargement is a diagnostic probe, not proof of browser zoom. |
| Keyboard and focus | Tab/Shift+Tab order matches meaningful source order; Enter/Space operate appropriate controls; focus remains visible and usable; closed panels leave keyboard/accessibility navigation. Test opening, closing, Back, Escape and resizing. Native navigation does not promise application-menubar arrow keys. |
| Accessibility | WCAG 2.2 A/AA target for shipped defaults/examples. Normal text 4.5:1, qualifying large text 3:1, applicable controls/states 3:1. Automated axe checks plus manual screen-reader review; no blanket conformance claim for consuming sites. |
| Targets | Product goal: 44 by 44 CSS pixels for standalone touch controls/labels. Verify applicable WCAG 2.2 minimum 24px or an allowed exception. Inline links/native controls require contextual review, not indiscriminate forced dimensions. |
| Visual precision | Approve state screenshots per browser and platform: default/hover/focus/active/disabled/invalid/selected/open where applicable. Use shared tokens and stable fixture fonts/viewports. Check border joins, corners, clipping, alignment and layouts. OS-native controls need functional equivalence, not identical pixels across systems. |
| Preferences | Verify reduced motion, forced colours, increased contrast, reduced transparency where supported, and print. Accessibility paint/focus wins over decoration. Custom alpha and motion settings must not defeat preferences. |
| Compatibility | Record tested stable browser versions for Chrome, Edge, Firefox, Safari and iOS Safari. CI Chromium/Firefox/WebKit supplements real-browser/device checks. Optional enhancements have usable fallbacks; the modern core's required CSS features have a documented support boundary. |
| Builds and overrides | Applicable global, minified, modular and scoped builds agree. Outside scoped boundaries remains unstyled subject to documented inheritance limits. Ordinary custom CSS can override without unnecessary specificity or important. |
| Performance | Core minified gzip remains under 15 KiB; optional fonts/modules are separate. Check blur/animation on real devices and scroll performance; do not claim a measured performance budget without measurements. |
| Documentation and API | Copyable HTML matches demos; unique IDs work with multiple instances; defaults/targets/reset values/limitations are documented. Public classes, attributes and tokens receive migration notes for breaking changes. |

Reference guidance: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [Text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), [Target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## Current component acceptance inventory

These are coverage notes and next checks, not declarations that every component passes all gates.

| Implemented area | Existing evidence | Acceptance work still needed |
| --- | --- | --- |
| Themes, tones, accents, inherited attributes | Nested defaults/resets, contrast pairs and build checks | Pairwise setting combinations, custom-palette guidance, visual baselines |
| Headings, paragraphs, lists, inline text, quotations | Native styling, documentation accessibility/reflow | Languages, fallback fonts, actual zoom and screen readers |
| Code, kbd, samp, pre | Native styling and scrolling | Long content, keyboard scrolling, text enlargement |
| Buttons, action links, native action inputs | Variants, themes, accents, disabled/focus, shared settings | Q-BUTTON-LABEL and Q-BUTTON-TEXT-SCALE; native input label limits |
| Badges | Global/minified/modular/scoped inheritance, local resets, rendered palette contrast, narrow LTR/RTL labels, glass fallback/preferences, documentation | Real-device, screen-reader, actual zoom/print and approved visual baselines remain shared release checks |
| Text/email/etc inputs, select, textarea | Labels, validation, read-only/disabled appearance | Native picker/autofill/device states, long labels, error announcements |
| Checkbox/radio, fieldset/legend | Native groups and labelled targets | Long labels, selected/disabled/invalid states and assistive technology |
| Range/file/colour/date controls | Basic native styles/examples | Real device/platform interactions and localization |
| Progress/meter/output | Native styling | Dedicated labelled state examples and accessibility checks |
| Cards | Shared appearance and glass raster tests | Mixed content and approved visual states |
| Grid/row/stack | Intrinsic grid, wrapping and inherited gap | Q-GRID-CONTENT, Q-ROW-CONTENT; narrow nested containers |
| Container/prose/alignment helpers | Width/default geometry checks | Nested gutters, typography and RTL stress review |
| Tables and table-scroll | Semantics, styles, borders, corners | Wide/complex data, keyboard scrolling, print/header association |
| Images/video | Ratios, fit and shared shape checks | Broken media, intrinsic sizing and native video interaction |
| Audio/canvas/svg/iframe/object/embed | Basic sizing rules | Dedicated examples and contextual semantics/interaction checks |
| Details/summary and exclusive groups | Native toggles and closed-state tests | Q-SUMMARY-LABEL, long content and grouped keyboard checks |
| Standalone popovers | Native toggles/dismissal examples | Edge placement and focus recovery across engines/devices |
| Dialog appearance | Non-modal static example only | Full modal behavior is not implemented or claimed |
| Top navigation and nested panels | Desktop/mobile, RTL, dismissal, no-script tests | Q-NAV-FOCUS and real device/screen-reader checks |
| Glass surfaces/actions | Transmission, corners, contrast and reset checks | Real Firefox/Safari blur, busy backgrounds and device performance |
| Decorative edges | CSS-state, inheritance and preference tests | Q-EDGE-DEVICE; visible temporal rendering across engines |
| Skip link | Native focus styling | Manual keyboard and zoom/focus-obscuration review |
| Documentation/code viewer/theme switch | Shared header, no scripts, literal code, page-local theme | Enlarged text/visual baselines; preserve documented page-local choice |

## Known failures and reporting

`quality/blockers.json` is the explicit release-blocker registry. Automated entries map to assertions in `tests/browser/quality.spec.mjs`; manual entries need reproducible evidence. The audit on main `92c9607` found four long-content overflows and buttons-documentation overflow at 320px with 200% root font size.

Known automated failures use Playwright `test.fail` with their blocker ID. They still execute the desired acceptance assertion; they are not skipped or counted as acceptance passes. Setup occurs before the expected-failure marker. An unexpected pass fails the alpha suite and requires reviewing the blocker. When a fix is validated across the supported engines, mark its entry resolved and record evidence; the same assertion then becomes a normal regression test. Do not change assertions merely to preserve a green result.

```sh
npm run build
npm test
npm run test:browser
npm run test:quality -- --project=chromium
npm run check:release-quality
```

`check:release-quality` deliberately exits nonzero while any registry item remains open. Alpha documentation CI reports that status without blocking documentation deployment. A green alpha CI run does not make a blocked release ready. Publication stays prohibited: keep `private: true`, complete this gate plus the agreed component scope and all existing release requirements in SPECIFICATION.md. No publishing workflow is introduced.

Record browser/device versions, fixture, result, reviewer/date and evidence when resolving manual gates. Root-font scaling and viewport checks do not replace actual zoom; axe does not replace screen readers; headless WebKit does not replace Safari/iPhone; native blur capture omissions remain unverified device behavior.

This first implementation establishes the standard and fixtures. Overflow corrections, navigation changes, edge diagnosis and expanded layout APIs are separate choices.
