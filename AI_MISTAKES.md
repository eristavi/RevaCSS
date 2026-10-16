# Common AI mistakes and corrected patterns

Use these examples when reviewing an interface generated with RevaCSS 2.0.
Every **Incorrect** snippet intentionally demonstrates a mistake; copy only the
**Correct** pattern. The corrected snippets are focused fragments, not complete
applications. Start from the AI guide's complete page, load matching styles and
connect application actions separately. Read the matching component reference
before extending a fragment.

## 1. Importing another framework's button vocabulary

RevaCSS styles native buttons. A class name from another framework does not
become a RevaCSS API merely because it describes the desired appearance.

**Incorrect**

```html
<button class="btn btn-primary rounded-lg" type="button">Save</button>
```

**Correct**

```html
<button type="button" data-shape="rounded">Save</button>
```

The application supplies the Save action. For a destination, use a real link
with `class="button"` and its actual destination instead of adding a click
handler to a non-interactive element.

## 2. Treating button appearance as badge/alert appearance

`data-appearance` applies to badges and alerts. `secondary` is a documented
action class, not a `data-variant` value.

**Incorrect**

```html
<button type="button" data-variant="secondary" data-appearance="outline">
  Cancel
</button>
```

**Correct**

```html
<button type="button" class="secondary outline">Cancel</button>
```

Use supported `data-variant` values for semantic action colours. The corrected
button still needs the application's cancellation behaviour.

## 3. Selecting Glass without its extension

A material attribute selects styling supplied by an extension. It does not
download that extension.

**Incorrect**

```html
<link rel="stylesheet" href="dist/reva.css">
<article class="card" data-material="glass">
  <h2>Project overview</h2>
</article>
```

**Correct**

```html
<link rel="stylesheet" href="dist/reva.css">
<link rel="stylesheet" href="dist/reva.glass.css">
<article class="card" data-material="glass">
  <h2>Project overview</h2>
</article>
```

The link elements belong in the document head. Keep both files from the same
distribution. Preference and browser fallbacks may intentionally make Glass
opaque even when its stylesheet is loaded.

## 4. Mixing a scoped core with a global extension

Use matching scoped files and keep the styled content inside a `.reva`
boundary. A global extension can apply outside that boundary.

**Incorrect**

```html
<link rel="stylesheet" href="dist/reva.scoped.css">
<link rel="stylesheet" href="dist/reva.glass.css">
<article class="card" data-material="glass">
  <h2>Project overview</h2>
</article>
```

**Correct**

```html
<link rel="stylesheet" href="dist/reva.scoped.css">
<link rel="stylesheet" href="dist/reva.glass.scoped.css">
<div class="reva" data-theme="auto">
  <article class="card" data-material="glass">
    <h2>Project overview</h2>
  </article>
</div>
```

Put the links in the head and the boundary in the body. Scope does not provide
Shadow DOM isolation. Keep overlay markup inside its boundary as well.

## 5. Assuming a material turns every element into a surface

Colour inheritance alone does not add card padding, borders or material paint
to an arbitrary element. This example assumes the Glass extension is loaded.

**Incorrect**

```html
<div class="project-summary" data-material="glass">
  <h2>Project summary</h2>
</div>
```

**Correct**

```html
<article class="card project-summary" data-material="glass">
  <h2>Project summary</h2>
</article>
```

Here `project-summary` remains an application class and `.card` supplies the
documented surface hook. For a different custom structure, follow the custom
component contract and consume public tokens explicitly.

## 6. Repeating shared settings until exceptions become inconsistent

Repeated attributes are valid HTML, but this example fails the intended shared
rule: both actions should inherit a large size and violet accent; only the
second action should have square corners.

**Incorrect**

```html
<div>
  <button type="button" data-size="large" data-accent="violet">Save</button>
  <button type="button" data-size="small" data-accent="blue"
          data-shape="square">Preview</button>
</div>
```

**Correct**

```html
<div data-size="large" data-accent="violet">
  <button type="button">Save</button>
  <button type="button" data-shape="square">Preview</button>
</div>
```

Place the shared decision on a parent and express only the intentional local
exception. Each application action still needs its own behaviour.

## 7. Inventing a universal reset value

Every attribute has its own supported values. To request medium controls inside
a large subtree, use `medium`; `default` is not a `data-size` value.

**Incorrect**

```html
<section data-size="large">
  <button type="button" data-size="default">Medium action</button>
</section>
```

**Correct**

```html
<section data-size="large">
  <button type="button" data-size="medium">Medium action</button>
</section>
```

Removing the local attribute would inherit large. Read the per-attribute usage
rules: `auto`, `none` and `default` are not interchangeable resets. In
particular, `data-contrast="auto"` does not clear every inherited increased
contrast token, and unsupported material values can stop parent material scopes.

## 8. Building a dropdown from unrecognised classes and ARIA claims

CSS classes and `role="menu"` alone do not create a native toggle or implement
ARIA menu keyboard behaviour.

**Incorrect**

```html
<div class="dropdown-toggle">Resources</div>
<div class="dropdown-menu" role="menu">
  <a role="menuitem" href="https://revacss.eristavi.org/guide/">Guide</a>
</div>
```

**Correct**

```html
<button type="button" popovertarget="ai-example-resources">Resources</button>
<ul class="dropdown" id="ai-example-resources" popover="auto"
    role="list" aria-label="Resources">
  <li><a href="https://revacss.eristavi.org/guide/">Guide</a></li>
  <li><button type="button" popovertarget="ai-example-resources"
              popovertargetaction="hide">Close resources</button></li>
</ul>
```

The complete core includes dropdown styling. Native popover support supplies
opening, light dismissal and Escape; navigation uses ordinary Tab behaviour.
This is a non-modal popover with no focus trap. When duplicating the pattern,
give each panel a new ID and update all of its `popovertarget` references. For
the full top menu, copy its complete documented structure rather than putting
these standalone dropdown classes into a partial navbar.

## 9. Relying on placeholders as field labels

CSS cannot add a persistent accessible label or a submitted field name.

**Incorrect**

```html
<input placeholder="Project name">
```

**Correct**

```html
<div class="form-group">
  <label for="ai-example-project-name">Project name</label>
  <input id="ai-example-project-name" name="project_name" type="text" required>
</div>
```

Place the field inside the application's real form. Supply its route, request
validation and authorization; `required` does not replace server validation.
Use a unique field ID if this form appears more than once.

## 10. Placing responsive containment on the card being sized

Use a separate full-width `.responsive` wrapper inside the sized parent. In
particular, do not put containment on a subgrid card.

**Incorrect**

```html
<div class="grid cols-2">
  <article class="card responsive"><h2>First project</h2></article>
  <article class="card responsive"><h2>Second project</h2></article>
</div>
```

**Correct**

```html
<div class="responsive">
  <div class="grid cols-2">
    <article class="card"><h2>First project</h2></article>
    <article class="card"><h2>Second project</h2></article>
  </div>
</div>
```

The grid can now respond to the wrapper's available width. Preserve documented
viewport/intrinsic fallbacks and check actual content reflow; adding a class is
not evidence that all widths or text sizes have been verified.
