# Troubleshooting RevaCSS interfaces

Start with the symptom and inspect the actual page, loaded assets and installed
version. Use the matching attribute/component reference before changing markup.
The live documentation can describe a later source revision than a downloaded
package; follow the AI guide's version-selection procedure first.

## Find the symptom

| Symptom | Start here |
| --- | --- |
| Everything looks like unstyled HTML | [Page looks unstyled](#page-looks-unstyled) |
| A data attribute changes nothing | [Attribute has no visible effect](#attribute-has-no-visible-effect) |
| Glass is absent, opaque or has no blur | [Material looks different](#material-looks-different) |
| Scoped styling is missing or leaks | [Scoped boundaries behave unexpectedly](#scoped-boundaries-behave-unexpectedly) |
| Application CSS unexpectedly wins or loses | [Overrides have the wrong priority](#overrides-have-the-wrong-priority) |
| Manrope does not appear or code changes font | [Font selection looks wrong](#font-selection-looks-wrong) |
| Content overflows or columns do not collapse | [Layout overflows or will not adapt](#layout-overflows-or-will-not-adapt) |
| A menu opens the wrong panel or does not open | [Navigation or overlays fail](#navigation-or-overlays-fail) |
| A sticky header scrolls away | [Sticky positioning does not hold](#sticky-positioning-does-not-hold) |
| A field resets or its error is detached | [Adapter field state is wrong](#adapter-field-state-is-wrong) |
| A form looks correct but saves nothing | [Application behaviour is missing](#application-behaviour-is-missing) |
| Theme changes on hydration or navigation | [Theme changes unexpectedly](#theme-changes-unexpectedly) |
| Custom palette colours are inconsistent | [Custom palette is incomplete](#custom-palette-is-incomplete) |

## Page looks unstyled

**Inspect:** Confirm the actual `<link>` or CSS import in the rendered page.
Check its resolved URL, response status, CSS content type and response body.
A URL returning an HTML fallback page is not a loaded stylesheet, even if its
status is 200. Check that a bundler emitted the CSS into the served output.

**Fix:** Load one matching complete `reva.css`, `reva.min.css` or scoped build.
Copy all required assets to the path the application really serves. Installing
an adapter does not automatically load the core CSS. A modular build needs its
documented token/base, component and preference dependencies.

**Verify:** Inspect the computed styles of a native button and `.card`, and
confirm the loaded rules come from the intended distribution. Keep global and
scoped complete builds separate.

## Attribute has no visible effect

**Inspect:** Check the exact name/value against the installed reference and
`usage` rules. Confirm that the intended element is a supported target, required
styles are loaded and a nearer setting or component state is not taking priority.
An attribute on a parent does not make every descendant a supported component.

**Fix:** Use a supported value at the appropriate boundary. For example,
`data-width` affects containers, `data-fit` affects constrained media and
`data-appearance` affects badges/alerts. Button outline/ghost treatment uses its
documented classes. Prefer a documented local override to repeating settings.

**Verify:** Inspect the winning token/rule at the target and one affected
descendant. Removing a local attribute inherits the parent choice; it does not
reset to a universal default. Unsupported values are not reliable resets,
especially at material boundaries. `data-contrast="auto"` does not undo every
inherited increased-contrast token.

## Material looks different

**Inspect:** Check the matching extension after the core, the selected material
scope and the target hook such as `.card`. Inspect a nearer `data-material` or
independent `data-button-material`. Check preferences, print mode, browser
feature support and what is actually behind a translucent surface.

**Fix:** Load the appropriate global/scoped Glass or Soft UI extension and use
its documented targets. Independent action finishes need the button-material
extension. Use `data-material="solid"` for a supported local surface reset;
`data-button-material="default"` follows the general material rather than
forcing solid. An arbitrary custom div needs a supported hook or its own
application material implementation.

**Verify:** Review the actual background and computed paint/filter rules.
Increased contrast, reduced transparency, forced colours, print and unsupported
filtering can intentionally simplify or make a surface opaque. Preserve those
fallbacks. Headless blur captures alone do not establish real-browser rendering.

## Scoped boundaries behave unexpectedly

**Inspect:** Confirm the core is `reva.scoped.css`, extensions are their scoped
counterparts and content is inside `.reva`. Check whether an overlay was rendered
outside the boundary or a nested `.reva` initialized its own defaults.

**Fix:** Put appearance choices on the boundary itself or inside it. Keep
popover/dialog markup within that boundary and use matching extensions. Scope
application-owned selectors too if they must stay within the region.

**Verify:** Compare a supported component inside the boundary with an element
outside it. CSS scope is not Shadow DOM: inherited font/colour and application
selectors can cross boundaries. Inspect the actual winning rule before blaming
the scoped core for an inherited style.

## Overrides have the wrong priority

**Inspect:** In the cascade, check layers, specificity, source order, local
custom properties and state/preference rules. Normal unlayered application CSS
can outrank normal framework declarations in named layers. An earlier global
token override can therefore defeat a later layered preference rule.

**Fix:** Use the public token contract and the documented layer for exported
palette configuration. For a custom component, let an existing `.card` hook own
its surface; keep application rules focused on content/layout. Correct an
unnecessarily broad selector at its source.

**Verify:** Review the winning declaration in the affected state and relevant
preferences. Avoid escalating with blanket `!important`, private framework
variables or replacement focus/invalid-state paint just to make a screenshot
match. Application CSS can intentionally override the framework; document that
decision and its effects when it is required.

## Font selection looks wrong

**Inspect:** Check `data-font`, the computed family and whether the browser
successfully loaded `reva-fonts.css` and its referenced font files. A declared
family name does not prove that the font was downloaded or rendered.

**Fix:** For bundled Manrope, keep `fonts/` beside its stylesheet and use
`data-font="manrope"`. For device UI fonts use `data-font="system"`; it works
even with Manrope loaded. Check an application `--re-font-heading` override
when headings differ from body text.

**Verify:** Inspect rendered fonts where the browser exposes them. Missing
Manrope uses the system fallback. Code remains monospace by contract; remove
application rules that accidentally replace that if the change was unintended.
Selecting a preset does not require Google Fonts or any other font service.

## Layout overflows or will not adapt

**Inspect:** Find the first element wider than its available parent. Check fixed
widths/minimums, long content, grid/flex children, media dimensions and the
presence/placement of `.responsive`. Viewport width and available container
width are different measurements.

**Fix:** Put a full-width `.responsive` wrapper inside a sized parent, with the
grid/cards inside it. Keep containment off a subgrid card. Remove inappropriate
application minimum/fixed widths; use intrinsic sizing and wrapping where
appropriate. Use a labelled, keyboard-accessible `.table-scroll` region for
genuinely wide tables instead of shrinking their content beyond usefulness.

**Verify:** Check the actual component in a narrow parent and with long content,
as well as applicable viewport sizes. Fixed two/three-column grids have the
documented 40rem fallback; responsive wrappers also enable their container
rules. Print can disable containment. Avoid page-level overflow suppression as
a substitute for correcting the overflowing element.

## Navigation or overlays fail

**Inspect:** Check native popover support, a unique panel ID and every matching
`popovertarget`. Confirm the trigger is a native `button type="button"`, the
panel has `popover="auto"`, and the complete component structure/styles exist.
Check for duplicated IDs after combining desktop/mobile or repeated examples.

**Fix:** Copy the full matching navigation or dropdown structure. Give each
instance distinct IDs and update its open/close targets together. Preserve
native hide buttons and appropriate panel labels. A styled anchor/div does not
become a popover trigger merely through a class or ARIA role.

**Verify:** Open/close, Escape, outside dismissal and ordinary keyboard order
in the relevant browser. A native popover is non-modal; it supplies no universal
focus trap or body-scroll lock. Ordinary action/in-page links do not always
dismiss it. Do not claim ARIA menu arrow-key behaviour from `role="menu"`.

## Sticky positioning does not hold

**Inspect:** Check `data-navbar-position`, the documented wrapper and its
containing block/scroll container. Look for a short section ancestor and
application overflow rules that change which ancestor scrolls.

**Fix:** Put the outer header wrapper in the scrolling page with enough room
to remain sticky. Keep navbar layout, spacing and surface width as separate
choices. A full navbar fills its parent; it cannot escape a constrained parent
or an app-shell grid column.

**Verify:** Scroll the actual container and inspect computed position/offset.
Sticky is not fixed positioning. Retain safe-area and focus visibility behaviour
when changing application header layout.

## Adapter field state is wrong

**Inspect:** Read the matching adapter's focused AI reference. Check whether
attributes reached the actual control, unique IDs and generated hint/error IDs
still match, and the application's state agrees with the server response.

**Fix:** Follow the adapter's native model:

| Adapter | State rule to check |
| --- | --- |
| Astro | Use input value, selected options and textarea slot text; supply server errors explicitly. |
| React | Choose controlled value/onChange or uncontrolled defaultValue; do not mix them. Use React 19 refs on supported native controls. |
| Vue | Use plain v-model and an array for multiple Select. Do not assume a component ref exposes a native focus method. |
| Svelte | Use bind:value and supported bind:element; the element is null during SSR. Multiple Select uses an array. |
| Laravel | Check error bags, old-input precedence and use-old. Livewire-bound fields delegate state to Livewire; use stable IDs. |

**Verify:** Inspect value, name, native constraints, label association,
`aria-invalid` and `aria-describedby` on the rendered control. Preserve escaped
error text and avoid restoring passwords. An initial SSR snapshot does not
prove hydrated interactions.

## Application behaviour is missing

**Inspect:** Follow the form's actual action/method or the application's event
handler. Check the route response, validation errors, authorization and saved
record. A static documentation example may deliberately use a placeholder.

**Fix:** Connect a real route and the application's CSRF/session, validation and
storage facilities. For an example of the connection, use the complete project
workspace guide. RevaCSS supplies appearance and supported native interactions;
it does not implement authentication, search, payments or data persistence.

**Verify:** Confirm the actual request and resulting application state. Native
required/type validation may prevent an invalid request before it reaches the
server; it does not replace server validation. Report whether only the interface
or the full operation has been verified.

## Theme changes unexpectedly

**Inspect:** Compare document attributes in the server HTML and after hydration
or navigation. Check root attributes, wrapper-only settings, local overrides,
`data-theme="auto"` and the operating-system preference. Look for application
theme code or stale saved preferences.

**Fix:** Let the host application provide consistent initial server/client
settings. Astro/Laravel Layout render a document; React/Vue/Svelte Layout are
wrappers and do not replace the host's document configuration. Connect theme
persistence and client-navigation updates through the application when needed.

**Verify:** Review both the first response and relevant navigation path. The
documentation customizer is a separate helper; its persistence does not ship as
a RevaCSS runtime. System auto mode changing with the system is expected.

## Custom palette is incomplete

**Inspect:** Check the installed version's built-in values and the custom CSS
selector/name, stylesheet loading and light/dark token sets. Inspect foreground
and gradient endpoint pairs, semantic roles and the palette aliases needed by
material/preference rules.

**Fix:** Use the documented exporter or public custom-palette contract. Keep
the exported token layer and `--re-palette-muted`, `--re-palette-link` and
`--re-palette-control-line` aliases. A custom name is application CSS; it is not
added automatically to the core's built-in values. For Laravel, register its
local CSS path in the adapter palette map as documented.

**Verify:** Check the actual computed tokens and relevant colour pairs in both
modes and chosen materials. Success/warning/danger remain semantic; ordinary
accent selection is not a complete palette replacement. Review translucent
surfaces against their actual background.

## Record an unresolved issue

Capture the core/adapter versions and source revision when applicable, actual
stylesheet URLs, relevant markup and application overrides, expected/observed
result, browser/version and available container width. Include the relevant
preference/state and a small reproduction where possible. State which checks
were completed or deferred. This gives the next person or agent evidence to
continue without guessing or changing unrelated framework rules.
