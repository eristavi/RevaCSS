export const attributes = [
  {
    "id": "theme",
    "title": "data-theme",
    "description": "Light, dark and auto select colour schemes. Auto follows the device preference. Default: auto. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-theme=\"auto\"><article class=\"card\"><h3>Auto</h3><p>A local theme setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-theme=\"light\"><article class=\"card\"><h3>Light</h3><p>A local theme setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-theme=\"dark\"><article class=\"card\"><h3>Dark</h3><p>A local theme setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "accent",
    "title": "data-accent",
    "description": "Colours primary buttons and native checkbox/radio accents. Ordinary links and menu text keep their link/text tokens. Default: blue. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-accent=\"blue\"><button type=\"button\">blue</button></section>\n  <section data-accent=\"violet\"><button type=\"button\">violet</button></section>\n  <section data-accent=\"teal\"><button type=\"button\">teal</button></section>\n  <section data-accent=\"green\"><button type=\"button\">green</button></section>\n  <section data-accent=\"orange\"><button type=\"button\">orange</button></section>\n  <section data-accent=\"rose\"><button type=\"button\">rose</button></section>\n</div>",
    "glass": false
  },
  {
    "id": "shape",
    "title": "data-shape",
    "description": "Controls surface and button radii; pill gives buttons a fully rounded outline. Default: rounded. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-shape=\"square\"><article class=\"card\"><h3>Square</h3><p>A local shape setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-shape=\"subtle\"><article class=\"card\"><h3>Subtle</h3><p>A local shape setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-shape=\"rounded\"><article class=\"card\"><h3>Rounded</h3><p>A local shape setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-shape=\"pill\"><article class=\"card\"><h3>Pill</h3><p>A local shape setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "fill",
    "title": "data-fill",
    "description": "Changes button gradients and optional glass sheen. Solid fill does not make glass opaque; use material solid for that. Default: gradient. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-fill=\"gradient\"><button type=\"button\">gradient</button></section>\n  <section data-fill=\"solid\"><button type=\"button\">solid</button></section>\n</div>",
    "glass": false
  },
  {
    "id": "density",
    "title": "data-density",
    "description": "Changes component spacing and control padding. Text sizing is controlled separately by data-type. Default: comfortable. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-density=\"compact\"><article class=\"card\"><h3>Compact</h3><p>A local density setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-density=\"comfortable\"><article class=\"card\"><h3>Comfortable</h3><p>A local density setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-density=\"spacious\"><article class=\"card\"><h3>Spacious</h3><p>A local density setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "depth",
    "title": "data-depth",
    "description": "Controls token-based shadows on cards, buttons and dropdowns. Default: subtle. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-depth=\"flat\"><article class=\"card\"><h3>Flat</h3><p>A local depth setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-depth=\"subtle\"><article class=\"card\"><h3>Subtle</h3><p>A local depth setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-depth=\"pronounced\"><article class=\"card\"><h3>Pronounced</h3><p>A local depth setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "motion",
    "title": "data-motion",
    "description": "Controls press movement and transition duration. Hover or press the buttons to compare. System reduced motion takes priority. Default: subtle. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-motion=\"none\"><button type=\"button\">none</button></section>\n  <section data-motion=\"subtle\"><button type=\"button\">subtle</button></section>\n  <section data-motion=\"expressive\"><button type=\"button\">expressive</button></section>\n</div>",
    "glass": false
  },
  {
    "id": "type",
    "title": "data-type",
    "description": "Controls inherited text size, separately from spacing and individual control size. Default: standard. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-type=\"compact\"><article class=\"card\"><h3>Compact</h3><p>A local type setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-type=\"standard\"><article class=\"card\"><h3>Standard</h3><p>A local type setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-type=\"large\"><article class=\"card\"><h3>Large</h3><p>A local type setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "border",
    "title": "data-border",
    "description": "Controls decorative card/disclosure frames. Essential input boundaries stay visible. Core navigation dropdowns retain their own border; glass dropdowns use this setting. Default: subtle. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-border=\"subtle\"><article class=\"card\"><h3>Subtle</h3><p>A local border setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-border=\"defined\"><article class=\"card\"><h3>Defined</h3><p>A local border setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-border=\"none\"><article class=\"card\"><h3>None</h3><p>A local border setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "contrast",
    "title": "data-contrast",
    "description": "More strengthens text and boundaries; optional glass becomes opaque. System contrast preferences take priority. Default: auto. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-contrast=\"auto\"><article class=\"card\"><h3>Auto</h3><p>A local contrast setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-contrast=\"more\"><article class=\"card\"><h3>More</h3><p>A local contrast setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "tone",
    "title": "data-tone",
    "description": "Selects neutral, cool or warm surface palettes within the current theme. Default: neutral. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-tone=\"neutral\"><article class=\"card\"><h3>Neutral</h3><p>A local tone setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-tone=\"cool\"><article class=\"card\"><h3>Cool</h3><p>A local tone setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-tone=\"warm\"><article class=\"card\"><h3>Warm</h3><p>A local tone setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": false
  },
  {
    "id": "controls",
    "title": "data-controls",
    "description": "Changes styled or minimal field treatment. Filled buttons retain their normal appearance. Default: styled. Scope: Inherited.",
    "html": "<div class=\"grid\">\n  <section data-controls=\"styled\"><label for=\"attr-controls-styled\">styled field</label><input id=\"attr-controls-styled\" placeholder=\"Project name\"></section>\n  <section data-controls=\"minimal\"><label for=\"attr-controls-minimal\">minimal field</label><input id=\"attr-controls-minimal\" placeholder=\"Project name\"></section>\n</div>",
    "glass": false
  },
  {
    "id": "width",
    "title": "data-width",
    "description": "Place directly on .container. Width is a maximum; narrow viewports and parent containers still limit it. Default: standard. Scope: Container only.",
    "html": "<div class=\"stack\">\n  <section class=\"container\" data-width=\"narrow\"><article class=\"card\">narrow container</article></section>\n  <section class=\"container\" data-width=\"standard\"><article class=\"card\">standard container</article></section>\n  <section class=\"container\" data-width=\"wide\"><article class=\"card\">wide container</article></section>\n</div>",
    "glass": false
  },
  {
    "id": "table",
    "title": "data-table",
    "description": "Place directly on table to choose its row or cell treatment. Default: plain. Scope: Table only.",
    "html": "<div class=\"grid\">\n  <table data-table=\"plain\"><caption>plain</caption><thead><tr><th scope=\"col\">Item</th><th scope=\"col\">State</th></tr></thead><tbody><tr><th scope=\"row\">One</th><td>Ready</td></tr><tr><th scope=\"row\">Two</th><td>Review</td></tr></tbody></table>\n  <table data-table=\"striped\"><caption>striped</caption><thead><tr><th scope=\"col\">Item</th><th scope=\"col\">State</th></tr></thead><tbody><tr><th scope=\"row\">One</th><td>Ready</td></tr><tr><th scope=\"row\">Two</th><td>Review</td></tr></tbody></table>\n  <table data-table=\"bordered\"><caption>bordered</caption><thead><tr><th scope=\"col\">Item</th><th scope=\"col\">State</th></tr></thead><tbody><tr><th scope=\"row\">One</th><td>Ready</td></tr><tr><th scope=\"row\">Two</th><td>Review</td></tr></tbody></table>\n</div>",
    "glass": false
  },
  {
    "id": "size",
    "title": "data-size",
    "description": "Place directly on a button, input, select, textarea or .button link. It does not resize the navigation menu. Default: medium. Scope: Control only.",
    "html": "<div class=\"grid\">\n  <button type=\"button\" data-size=\"small\">small</button>\n  <button type=\"button\" data-size=\"medium\">medium</button>\n  <button type=\"button\" data-size=\"large\">large</button>\n</div>",
    "glass": false
  },
  {
    "id": "ratio",
    "title": "data-ratio",
    "description": "Place directly on img to select an aspect ratio. Auto leaves the natural image ratio. Default: auto. Scope: Image only.",
    "html": "<div class=\"grid\">\n  <figure><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" data-ratio=\"auto\" alt=\"Hills illustration, auto example\"><figcaption>auto</figcaption></figure>\n  <figure><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" data-ratio=\"square\" alt=\"Hills illustration, square example\"><figcaption>square</figcaption></figure>\n  <figure><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" data-ratio=\"landscape\" alt=\"Hills illustration, landscape example\"><figcaption>landscape</figcaption></figure>\n  <figure><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" data-ratio=\"portrait\" alt=\"Hills illustration, portrait example\"><figcaption>portrait</figcaption></figure>\n  <figure><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" data-ratio=\"wide\" alt=\"Hills illustration, wide example\"><figcaption>wide</figcaption></figure>\n</div>",
    "glass": false
  },
  {
    "id": "fit",
    "title": "data-fit",
    "description": "Place directly on a constrained img. Cover crops; contain keeps the whole image visible. Default: cover. Scope: Constrained image only.",
    "html": "<div class=\"grid\">\n  <figure><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" data-fit=\"cover\" data-ratio=\"square\" alt=\"Hills illustration, cover example\"><figcaption>cover</figcaption></figure>\n  <figure><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" data-fit=\"contain\" data-ratio=\"square\" alt=\"Hills illustration, contain example\"><figcaption>contain</figcaption></figure>\n</div>",
    "glass": false
  },
  {
    "id": "gap",
    "title": "data-gap",
    "description": "Place directly on .grid, .row or .stack; it does not apply to arbitrary elements. Default: medium. Scope: Layout only.",
    "html": "<div class=\"grid\">\n  <div class=\"stack\" data-gap=\"none\"><article class=\"card\">none gap</article><article class=\"card\">Second item</article></div>\n  <div class=\"stack\" data-gap=\"small\"><article class=\"card\">small gap</article><article class=\"card\">Second item</article></div>\n  <div class=\"stack\" data-gap=\"medium\"><article class=\"card\">medium gap</article><article class=\"card\">Second item</article></div>\n  <div class=\"stack\" data-gap=\"large\"><article class=\"card\">large gap</article><article class=\"card\">Second item</article></div>\n</div>",
    "glass": false
  },
  {
    "id": "material",
    "title": "data-material",
    "description": "Requires reva.glass.css after reva.css. Glass applies to supported surfaces; solid ends the material locally. Default: solid. Scope: Inherited material scope; optional glass stylesheet.",
    "html": "<div class=\"grid\">\n  <section data-material=\"solid\"><article class=\"card\"><h3>Solid</h3><p>A local material setting.</p><button type=\"button\">Action</button></article></section>\n  <section data-material=\"glass\"><article class=\"card\"><h3>Glass</h3><p>A local material setting.</p><button type=\"button\">Action</button></article></section>\n</div>",
    "glass": true
  }
];
