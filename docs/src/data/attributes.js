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
    "description": "Sets maximum widths for descendant .container elements. Viewports and parent containers still limit the actual width. Set it on html, a section, or the target element. Default: standard. Scope: Inherited; affects .container.",
    "html": "<div class=\"stack\">\n  <section data-width=\"narrow\"><div class=\"container\"><article class=\"card\">narrow container</article></div></section>\n  <section data-width=\"standard\"><div class=\"container\"><article class=\"card\">standard container</article></div></section>\n  <section data-width=\"wide\"><div class=\"container\"><article class=\"card\">wide container</article></div></section>\n</div>",
    "glass": false
  },
  {
    "id": "table",
    "title": "data-table",
    "description": "Sets row or cell treatment on descendant tables. A local plain value removes inherited stripes or full-cell borders. Set it on html, a section, or the target element. Default: plain. Scope: Inherited; affects tables.",
    "html": "<div class=\"grid\">\n  <section data-table=\"plain\"><table><caption>plain</caption><thead><tr><th scope=\"col\">Item</th><th scope=\"col\">State</th></tr></thead><tbody><tr><th scope=\"row\">One</th><td>Ready</td></tr><tr><th scope=\"row\">Two</th><td>Review</td></tr></tbody></table></section>\n  <section data-table=\"striped\"><table><caption>striped</caption><thead><tr><th scope=\"col\">Item</th><th scope=\"col\">State</th></tr></thead><tbody><tr><th scope=\"row\">One</th><td>Ready</td></tr><tr><th scope=\"row\">Two</th><td>Review</td></tr></tbody></table></section>\n  <section data-table=\"bordered\"><table><caption>bordered</caption><thead><tr><th scope=\"col\">Item</th><th scope=\"col\">State</th></tr></thead><tbody><tr><th scope=\"row\">One</th><td>Ready</td></tr><tr><th scope=\"row\">Two</th><td>Review</td></tr></tbody></table></section>\n</div>",
    "glass": false
  },
  {
    "id": "size",
    "title": "data-size",
    "description": "Sets sizes on descendant buttons, inputs, selects, textareas and .button links. It does not resize ordinary text or menu links. Set it on html, a section, or the target element. Default: medium. Scope: Inherited; affects buttons, inputs, selects, textareas and .button links.",
    "html": "<div class=\"row\">\n  <section data-size=\"small\"><button type=\"button\">small</button></section>\n  <section data-size=\"medium\"><button type=\"button\">medium</button></section>\n  <section data-size=\"large\"><button type=\"button\">large</button></section>\n</div>",
    "glass": false
  },
  {
    "id": "ratio",
    "title": "data-ratio",
    "description": "Sets aspect ratios on descendant images. A local auto value restores the natural image ratio. Set it on html, a section, or the target element. Default: auto. Scope: Inherited; affects images.",
    "html": "<div class=\"grid\">\n  <figure data-ratio=\"auto\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" alt=\"Hills illustration, auto example\"><figcaption>auto</figcaption></figure>\n  <figure data-ratio=\"square\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" alt=\"Hills illustration, square example\"><figcaption>square</figcaption></figure>\n  <figure data-ratio=\"landscape\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" alt=\"Hills illustration, landscape example\"><figcaption>landscape</figcaption></figure>\n  <figure data-ratio=\"portrait\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" alt=\"Hills illustration, portrait example\"><figcaption>portrait</figcaption></figure>\n  <figure data-ratio=\"wide\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" alt=\"Hills illustration, wide example\"><figcaption>wide</figcaption></figure>\n</div>",
    "glass": false
  },
  {
    "id": "fit",
    "title": "data-fit",
    "description": "Sets image fitting for descendant constrained images. Cover crops; contain keeps the whole image visible. Set it on html, a section, or the target element. Default: cover. Scope: Inherited; affects constrained images.",
    "html": "<div class=\"grid\">\n  <figure data-fit=\"cover\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" data-ratio=\"square\" alt=\"Hills illustration, cover example\"><figcaption>cover</figcaption></figure>\n  <figure data-fit=\"contain\"><img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" data-ratio=\"square\" alt=\"Hills illustration, contain example\"><figcaption>contain</figcaption></figure>\n</div>",
    "glass": false
  },
  {
    "id": "gap",
    "title": "data-gap",
    "description": "Sets gaps on descendant .grid, .row and .stack layouts. The multiplier follows local density; arbitrary elements do not become layouts. Set it on html, a section, or the target element. Default: medium. Scope: Inherited; affects .grid, .row and .stack.",
    "html": "<div class=\"grid\">\n  <section data-gap=\"none\"><div class=\"stack\"><article class=\"card\">none gap</article><article class=\"card\">Second item</article></div></section>\n  <section data-gap=\"small\"><div class=\"stack\"><article class=\"card\">small gap</article><article class=\"card\">Second item</article></div></section>\n  <section data-gap=\"medium\"><div class=\"stack\"><article class=\"card\">medium gap</article><article class=\"card\">Second item</article></div></section>\n  <section data-gap=\"large\"><div class=\"stack\"><article class=\"card\">large gap</article><article class=\"card\">Second item</article></div></section>\n</div>",
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
