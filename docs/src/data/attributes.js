export const attributes = [
  {
    "id": "theme",
    "title": "data-theme",
    "description": "Page, text, links, surfaces and native controls; auto follows device colours. Default: auto. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-theme=\"auto\"><article class=\"card\"><h3>Auto</h3><p>A local theme setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-theme=\"light\"><article class=\"card\"><h3>Light</h3><p>A local theme setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-theme=\"dark\"><article class=\"card\"><h3>Dark</h3><p>A local theme setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "accent",
    "title": "data-accent",
    "description": "Primary buttons and native checkbox, radio, range, progress and meter accents; links retain their readable theme colour. Default: blue. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-accent=\"blue\"><button type=\"button\">blue</button></section>\n  <section data-accent=\"violet\"><button type=\"button\">violet</button></section>\n  <section data-accent=\"teal\"><button type=\"button\">teal</button></section>\n  <section data-accent=\"green\"><button type=\"button\">green</button></section>\n  <section data-accent=\"orange\"><button type=\"button\">orange</button></section>\n  <section data-accent=\"rose\"><button type=\"button\">rose</button></section>\n</div>",
    "glass": false
  },
  {
    "id": "shape",
    "title": "data-shape",
    "description": "Buttons, text controls, cards, menus, disclosures, fieldsets, dialogs, popovers, tables, images, videos and code. Default: rounded. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-shape=\"square\"><article class=\"card\"><h3>Square</h3><p>A local shape setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-shape=\"subtle\"><article class=\"card\"><h3>Subtle</h3><p>A local shape setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-shape=\"rounded\"><article class=\"card\"><h3>Rounded</h3><p>A local shape setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-shape=\"pill\"><article class=\"card\"><h3>Pill</h3><p>A local shape setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "fill",
    "title": "data-fill",
    "description": "Button gradients and optional glass sheen. Default: gradient. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-fill=\"gradient\"><button type=\"button\">gradient</button></section>\n  <section data-fill=\"solid\"><button type=\"button\">solid</button></section>\n</div>",
    "glass": false
  },
  {
    "id": "density",
    "title": "data-density",
    "description": "Surface padding, control padding, table cells and layout spacing. Default: comfortable. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-density=\"compact\"><article class=\"card\"><h3>Compact</h3><p>A local density setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-density=\"comfortable\"><article class=\"card\"><h3>Comfortable</h3><p>A local density setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-density=\"spacious\"><article class=\"card\"><h3>Spacious</h3><p>A local density setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "depth",
    "title": "data-depth",
    "description": "Buttons, cards, fieldsets, disclosures, dialogs, popovers, menus and desktop panels; control inset shadows use data-controls. Default: subtle. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-depth=\"flat\"><article class=\"card\"><h3>Flat</h3><p>A local depth setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-depth=\"subtle\"><article class=\"card\"><h3>Subtle</h3><p>A local depth setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-depth=\"pronounced\"><article class=\"card\"><h3>Pronounced</h3><p>A local depth setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "motion",
    "title": "data-motion",
    "description": "Button transitions and press movement; reduced-motion preference wins. Default: subtle. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-motion=\"none\"><button type=\"button\">none</button></section>\n  <section data-motion=\"subtle\"><button type=\"button\">subtle</button></section>\n  <section data-motion=\"expressive\"><button type=\"button\">expressive</button></section>\n</div>",
    "glass": false
  },
  {
    "id": "type",
    "title": "data-type",
    "description": "Page and subtree typography. Default: standard. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-type=\"compact\"><article class=\"card\"><h3>Compact</h3><p>A local type setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-type=\"standard\"><article class=\"card\"><h3>Standard</h3><p>A local type setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-type=\"large\"><article class=\"card\"><h3>Large</h3><p>A local type setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "border",
    "title": "data-border",
    "description": "Styled control and surface borders, table rules and menu panel separators; invalid and forced-colour boundaries win. Default: subtle. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-border=\"subtle\"><article class=\"card\"><h3>Subtle</h3><p>A local border setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-border=\"defined\"><article class=\"card\"><h3>Defined</h3><p>A local border setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-border=\"none\"><article class=\"card\"><h3>None</h3><p>A local border setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "contrast",
    "title": "data-contrast",
    "description": "Readable text and boundary colours; optional glass becomes opaque; device high-contrast preference wins. Default: auto. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-contrast=\"auto\"><article class=\"card\"><h3>Auto</h3><p>A local contrast setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-contrast=\"more\"><article class=\"card\"><h3>More</h3><p>A local contrast setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "tone",
    "title": "data-tone",
    "description": "Neutral, cool or warm page and surface backgrounds. Default: neutral. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-tone=\"neutral\"><article class=\"card\"><h3>Neutral</h3><p>A local tone setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-tone=\"cool\"><article class=\"card\"><h3>Cool</h3><p>A local tone setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-tone=\"warm\"><article class=\"card\"><h3>Warm</h3><p>A local tone setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "controls",
    "title": "data-controls",
    "description": "Text input, select and textarea fill and inset shadow. Default: styled. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-controls=\"styled\"><label for=\"attr-controls-styled\">styled field</label><input id=\"attr-controls-styled\" placeholder=\"Project name\"></section>\n  <section data-controls=\"minimal\"><label for=\"attr-controls-minimal\">minimal field</label><input id=\"attr-controls-minimal\" placeholder=\"Project name\"></section>\n</div>",
    "glass": false
  },
  {
    "id": "width",
    "title": "data-width",
    "description": "Content width of .container. Default: standard. Scope: Inherited; affects .container.",
    "html": "<div class=\"stack\">\n  <section data-width=\"narrow\"><div class=\"container\"><article class=\"card\">narrow container</article></div></section>\n  <section data-width=\"standard\"><div class=\"container\"><article class=\"card\">standard container</article></div></section>\n  <section data-width=\"wide\"><div class=\"container\"><article class=\"card\">wide container</article></div></section>\n</div>",
    "glass": false
  },
  {
    "id": "table",
    "title": "data-table",
    "description": "Table stripes and grid lines; grid thickness follows data-border. Default: plain. Scope: Inherited; affects tables.",
    "html": "<div class=\"grid\">\n  <section data-table=\"plain\"><table><caption>plain</caption><thead><tr><th scope=\"col\">Item</th><th scope=\"col\">State</th></tr></thead><tbody><tr><th scope=\"row\">One</th><td>Ready</td></tr><tr><th scope=\"row\">Two</th><td>Review</td></tr></tbody></table></section>\n  <section data-table=\"striped\"><table><caption>striped</caption><thead><tr><th scope=\"col\">Item</th><th scope=\"col\">State</th></tr></thead><tbody><tr><th scope=\"row\">One</th><td>Ready</td></tr><tr><th scope=\"row\">Two</th><td>Review</td></tr></tbody></table></section>\n  <section data-table=\"bordered\"><table><caption>bordered</caption><thead><tr><th scope=\"col\">Item</th><th scope=\"col\">State</th></tr></thead><tbody><tr><th scope=\"row\">One</th><td>Ready</td></tr><tr><th scope=\"row\">Two</th><td>Review</td></tr></tbody></table></section>\n</div>",
    "glass": false
  },
  {
    "id": "size",
    "title": "data-size",
    "description": "Buttons, inputs, selects, textareas, .button links and menu actions; native touch target minimums remain. Default: medium. Scope: Inherited; affects controls and menu actions.",
    "html": "<div class=\"row\">\n  <section data-size=\"small\"><button type=\"button\">small</button></section>\n  <section data-size=\"medium\"><button type=\"button\">medium</button></section>\n  <section data-size=\"large\"><button type=\"button\">large</button></section>\n</div>",
    "glass": false
  },
  {
    "id": "ratio",
    "title": "data-ratio",
    "description": "Image and video aspect ratio; auto retains natural proportions. Default: auto. Scope: Inherited; affects images and videos.",
    "html": "<div class=\"grid\">\n  <figure data-ratio=\"auto\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" alt=\"Hills illustration, auto example\"><figcaption>auto</figcaption></figure>\n  <figure data-ratio=\"square\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" alt=\"Hills illustration, square example\"><figcaption>square</figcaption></figure>\n  <figure data-ratio=\"landscape\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" alt=\"Hills illustration, landscape example\"><figcaption>landscape</figcaption></figure>\n  <figure data-ratio=\"portrait\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" alt=\"Hills illustration, portrait example\"><figcaption>portrait</figcaption></figure>\n  <figure data-ratio=\"wide\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" alt=\"Hills illustration, wide example\"><figcaption>wide</figcaption></figure>\n</div>",
    "glass": false
  },
  {
    "id": "fit",
    "title": "data-fit",
    "description": "Image and video content within constrained dimensions. Default: cover. Scope: Inherited; affects constrained images and videos.",
    "html": "<div class=\"grid\">\n  <figure data-fit=\"cover\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" data-ratio=\"square\" alt=\"Hills illustration, cover example\"><figcaption>cover</figcaption></figure>\n  <figure data-fit=\"contain\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" data-ratio=\"square\" alt=\"Hills illustration, contain example\"><figcaption>contain</figcaption></figure>\n</div>",
    "glass": false
  },
  {
    "id": "gap",
    "title": "data-gap",
    "description": "Spacing in .grid, .row and .stack; combines with density. Default: medium. Scope: Inherited; affects .grid, .row and .stack.",
    "html": "<div class=\"grid\">\n  <section data-gap=\"none\"><div class=\"stack\"><article class=\"card\">none gap</article><article class=\"card\">Second item</article></div></section>\n  <section data-gap=\"small\"><div class=\"stack\"><article class=\"card\">small gap</article><article class=\"card\">Second item</article></div></section>\n  <section data-gap=\"medium\"><div class=\"stack\"><article class=\"card\">medium gap</article><article class=\"card\">Second item</article></div></section>\n  <section data-gap=\"large\"><div class=\"stack\"><article class=\"card\">large gap</article><article class=\"card\">Second item</article></div></section>\n</div>",
    "glass": false
  },
  {
    "id": "material",
    "title": "data-material",
    "description": "Buttons, button links, native action inputs and supported surfaces; glass requires the optional stylesheet; solid stops inherited glass. Default: solid. Scope: Inherited material scope; optional glass stylesheet.",
    "html": "<div class=\"grid\">\n  <section data-material=\"solid\"><article class=\"card\"><h3>Solid</h3><p>A local material setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-material=\"glass\"><article class=\"card\"><h3>Glass</h3><p>A local material setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": true
  }
];
