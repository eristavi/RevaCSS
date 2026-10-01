export const topics = [
  {
    "slug": "typography",
    "title": "Typography",
    "intro": "Native text elements receive styles automatically. Choose HTML for its meaning; no typography classes are required.",
    "examples": [
      {
        "id": "headings",
        "title": "Headings and paragraphs",
        "description": "Use one page heading, then a logical heading hierarchy. These examples start at h3 to sit beneath the documentation section heading.",
        "html": "<div class=\"prose\">\n  <h3>A clear heading</h3>\n  <h4>A supporting heading</h4>\n  <p>Readable text with <strong>emphasis</strong>, <em>expression</em> and <a href=\"#main\">a meaningful link</a>.</p>\n  <p><small>Supporting information.</small></p>\n</div>"
      },
      {
        "id": "inline",
        "title": "Inline text",
        "description": "Use semantic elements for highlights, abbreviations and keyboard instructions.",
        "html": "<p><mark>Highlighted information</mark> and <abbr title=\"Cascading Style Sheets\">CSS</abbr>.</p>\n<p>Use <kbd>Tab</kbd> to move focus. Write <code>data-theme=\"dark\"</code> in HTML.</p>"
      },
      {
        "id": "lists",
        "title": "Lists and definitions",
        "description": "Lists preserve their native structure and spacing.",
        "html": "<ul>\n  <li>First item</li>\n  <li>Second item</li>\n</ul>\n<ol>\n  <li>Choose a theme</li>\n  <li>Add your content</li>\n</ol>\n<dl>\n  <dt>Material</dt>\n  <dd>The treatment applied to a surface.</dd>\n</dl>"
      },
      {
        "id": "quote",
        "title": "Quotes and code blocks",
        "description": "Use blockquote for a quotation and pre/code to preserve code formatting.",
        "html": "<blockquote>\n  <p>Good defaults leave room for your own decisions.</p>\n</blockquote>\n<pre tabindex=\"0\" aria-label=\"Example code\"><code>&lt;button type=\"button\"&gt;Save&lt;/button&gt;</code></pre>"
      }
    ]
  },
  {
    "slug": "buttons",
    "title": "Buttons",
    "intro": "Native buttons receive a restrained accent fill, subtle edge highlight and gentle press feedback automatically. Secondary actions use an accent tint that follows light and dark themes. Keep buttons for actions and anchors for navigation.",
    "examples": [
      {
        "id": "variants",
        "title": "Button variants",
        "description": "The default is primary. Add a semantic or visual variant class where needed. These demo actions do not submit anything.",
        "html": "<div class=\"row\">\n  <button type=\"button\">Primary</button>\n  <button type=\"button\" class=\"secondary\">Secondary</button>\n  <button type=\"button\" class=\"danger\">Delete</button>\n  <button type=\"button\" class=\"warning\">Review warning</button>\n  <button type=\"button\" class=\"outline\">Outline</button>\n  <button type=\"button\" class=\"ghost\">Ghost</button>\n</div>"
      },
      {
        "id": "theme-actions",
        "title": "Actions in light and dark",
        "description": "Primary and secondary actions inherit the same accent. Theme changes their palette; shape, size, borders, depth and motion remain independently configurable. These examples use solid buttons; the optional glass stylesheet enables translucent button material.",
        "html": "<div class=\"grid\" data-accent=\"violet\" data-shape=\"pill\">\n  <section class=\"card\" data-theme=\"light\">\n    <h3>Light</h3>\n    <div class=\"row\">\n      <button type=\"button\">Continue</button>\n      <button type=\"button\" class=\"secondary\">Go back</button>\n    </div>\n  </section>\n  <section class=\"card\" data-theme=\"dark\">\n    <h3>Dark</h3>\n    <div class=\"row\">\n      <button type=\"button\">Continue</button>\n      <button type=\"button\" class=\"secondary\">Go back</button>\n    </div>\n  </section>\n</div>"
      },
      {
        "id": "sizes",
        "title": "Sizes and disabled state",
        "description": "data-size can set inherited control sizes on html or a section; a value on a control overrides them. Native disabled prevents activation.",
        "html": "<div class=\"row\">\n  <button type=\"button\" data-size=\"small\">Small</button>\n  <button type=\"button\" data-size=\"medium\">Medium</button>\n  <button type=\"button\" data-size=\"large\">Large</button>\n  <button type=\"button\" disabled>Unavailable</button>\n</div>"
      },
      {
        "id": "link-action",
        "title": "Links styled as actions",
        "description": "Use .button on a real destination link. Anchors do not support the disabled attribute.",
        "html": "<a class=\"button\" href=\"#main\">Back to page content</a>"
      },
      {
        "id": "local-style",
        "title": "Local button configuration",
        "description": "Shared attributes can be placed directly on a button or inherited from a surrounding section.",
        "html": "<button type=\"button\" data-accent=\"violet\" data-shape=\"pill\" data-fill=\"solid\" data-motion=\"none\">Violet action</button>"
      },
      {
        "id": "gradient-edges",
        "title": "Gradient edges and motion",
        "description": "Plain is the default. Gradient is stationary; shine makes one 800ms sweep on hover or keyboard focus; animated turns slowly. Use continuous animation sparingly for a selected main action. Edges follow the action colour and shape, independently of fill. Native input buttons retain regular borders.",
        "html": "<div class=\"row\">\n  <button type=\"button\" data-edge=\"plain\">Plain</button>\n  <button type=\"button\" data-edge=\"gradient\">Gradient</button>\n  <button type=\"button\" data-edge=\"shine\">Shine</button>\n  <button type=\"button\" data-edge=\"animated\">Animated</button>\n</div>"
      },
      {
        "id": "inherited-edges",
        "title": "A shared edge with local exceptions",
        "description": "Set data-edge on html or a section to configure buttons, .button links and cards. A nearer plain value removes decoration. data-border none removes the gradient ring; data-motion none pauses it. Reduced motion keeps a static ring; higher contrast, forced colours and print remove decoration.",
        "html": "<section data-edge=\"animated\" data-shape=\"pill\" data-accent=\"violet\" data-motion=\"none\">\n  <article class=\"card\">\n    <h3>Shared stationary edge</h3>\n    <div class=\"row\">\n      <button type=\"button\">Inherited edge</button>\n      <a class=\"button secondary\" href=\"#main\" data-edge=\"shine\" data-motion=\"subtle\">Focused shine</a>\n      <button type=\"button\" data-edge=\"plain\">Plain exception</button>\n      <button type=\"button\" disabled>Unavailable</button>\n    </div>\n  </article>\n</section>"
      }
    ]
  },
  {
    "slug": "forms",
    "title": "Forms",
    "intro": "Native controls need explicit labels. RevaCSS supplies appearance; your HTML supplies names, hints, errors and form behavior.",
    "examples": [
      {
        "id": "fields",
        "title": "Text fields, select and textarea",
        "description": "Associate labels with unique input IDs. Set appropriate input types and autocomplete tokens.",
        "html": "<div class=\"stack\">\n  <div><label for=\"demo-email\">Email</label>\n    <input id=\"demo-email\" name=\"email\" type=\"email\" autocomplete=\"email\" placeholder=\"you@example.com\"></div>\n  <div><label for=\"demo-role\">Role</label>\n    <select id=\"demo-role\" name=\"role\"><option>Designer</option><option>Developer</option></select></div>\n  <div><label for=\"demo-message\">Message</label>\n    <textarea id=\"demo-message\" name=\"message\" rows=\"3\"></textarea></div>\n</div>"
      },
      {
        "id": "choices",
        "title": "Checkboxes and radios",
        "description": "Wrap each choice in its label. A shared radio name creates one native selection group.",
        "html": "<fieldset>\n  <legend>Preferences</legend>\n  <label><input type=\"checkbox\" name=\"updates\"> Receive updates</label>\n  <label><input type=\"radio\" name=\"demo-plan\" value=\"personal\" checked> Personal</label>\n  <label><input type=\"radio\" name=\"demo-plan\" value=\"team\"> Team</label>\n</fieldset>"
      },
      {
        "id": "states",
        "title": "Hints, errors and read-only fields",
        "description": "Connect explanatory text with aria-describedby. aria-invalid styles a supplied error state; CSS does not create or announce errors.",
        "html": "<label for=\"demo-error\">Email</label>\n<input id=\"demo-error\" type=\"email\" value=\"invalid-address\" aria-invalid=\"true\" aria-describedby=\"demo-error-text\">\n<p id=\"demo-error-text\">Enter an email address containing @.</p>\n<label for=\"demo-readonly\">Account ID</label>\n<input id=\"demo-readonly\" value=\"REVA-001\" readonly>\n<label for=\"demo-disabled\">Unavailable field</label>\n<input id=\"demo-disabled\" value=\"Unavailable\" disabled>"
      },
      {
        "id": "native-controls",
        "title": "Other native controls",
        "description": "Range, file, colour, date, progress and meter retain native behavior. No output calculation is performed by CSS.",
        "html": "<div class=\"stack\">\n  <div><label for=\"demo-range\">Volume</label><input id=\"demo-range\" type=\"range\" min=\"0\" max=\"100\" value=\"40\"></div>\n  <div><label for=\"demo-file\">Attachment</label><input id=\"demo-file\" type=\"file\"></div>\n  <div><label for=\"demo-colour\">Colour</label><input id=\"demo-colour\" type=\"color\" value=\"#245dcc\"></div>\n  <div><label for=\"demo-date\">Date</label><input id=\"demo-date\" type=\"date\"></div>\n  <div><label for=\"demo-progress\">Upload progress</label><progress id=\"demo-progress\" value=\"60\" max=\"100\">60%</progress></div>\n  <div><label for=\"demo-meter\">Storage used</label><meter id=\"demo-meter\" value=\"0.4\">40%</meter></div>\n</div>"
      },
      {
        "id": "minimal",
        "title": "Minimal controls",
        "description": "data-controls changes input treatment. It does not remove required labels or control boundaries.",
        "html": "<section data-controls=\"minimal\" data-density=\"compact\">\n  <label for=\"demo-minimal\">Project name</label>\n  <input id=\"demo-minimal\" placeholder=\"Your project\">\n</section>"
      }
    ]
  },
  {
    "slug": "layouts",
    "title": "Cards and layouts",
    "intro": "Use a small set of layout classes. Grids adapt intrinsically; rows wrap; stacks arrange content vertically.",
    "examples": [
      {
        "id": "card",
        "title": "Cards",
        "description": "Apply .card to an article or section. Shared shape, density, depth and border attributes control its treatment.",
        "html": "<article class=\"card\" data-shape=\"rounded\" data-depth=\"subtle\">\n  <h3>Your next project</h3>\n  <p>A surface for related content.</p>\n  <a href=\"#main\">Read more</a>\n</article>"
      },
      {
        "id": "grid",
        "title": "Responsive grids",
        "description": "The default grid fits as many columns as space permits. cols-2 and cols-3 switch to one column below 40rem.",
        "html": "<div class=\"grid cols-2\" data-gap=\"large\">\n  <article class=\"card\"><h3>First card</h3><p>First column.</p></article>\n  <article class=\"card\"><h3>Second card</h3><p>Second column.</p></article>\n</div>"
      },
      {
        "id": "row-stack",
        "title": "Rows and stacks",
        "description": "Combine .row, .stack and alignment utilities. data-gap can be inherited from html or a section, or overridden on a layout.",
        "html": "<div class=\"stack\" data-gap=\"large\">\n  <p>A vertical stack.</p>\n  <div class=\"row justify-between\" data-gap=\"small\">\n    <span>Actions wrap when space runs out.</span>\n    <button type=\"button\">Continue</button>\n  </div>\n</div>"
      },
      {
        "id": "container",
        "title": "Containers and prose",
        "description": "data-width can set inherited container defaults or be overridden on .container. .prose limits text measure independently of the page width.",
        "html": "<section class=\"container\" data-width=\"narrow\">\n  <div class=\"prose\">\n    <h3>Comfortable reading</h3>\n    <p>A narrow container with a readable text measure.</p>\n  </div>\n</section>"
      }
    ]
  },
  {
    "slug": "tables",
    "title": "Tables",
    "intro": "Use real table semantics, captions and header scopes. Wrap wide tables in a labelled, focusable scroll region.",
    "examples": [
      {
        "id": "plain",
        "title": "Plain table",
        "description": "Set data-table on html or a section for shared defaults, or on the table for a local override. The wrapper contains horizontal overflow.",
        "html": "<div class=\"table-scroll\" role=\"region\" aria-label=\"Project status, plain table\" tabindex=\"0\">\n  <table data-table=\"plain\">\n    <caption>Project status</caption>\n    <thead><tr><th scope=\"col\">Project</th><th scope=\"col\">Status</th></tr></thead>\n    <tbody>\n      <tr><th scope=\"row\">Website</th><td>In review</td></tr>\n      <tr><th scope=\"row\">Documentation</th><td>In progress</td></tr>\n    </tbody>\n  </table>\n</div>"
      },
      {
        "id": "striped",
        "title": "Striped table",
        "description": "Set data-table on html or a section for shared defaults, or on the table for a local override. The wrapper contains horizontal overflow.",
        "html": "<div class=\"table-scroll\" role=\"region\" aria-label=\"Project status, striped table\" tabindex=\"0\">\n  <table data-table=\"striped\">\n    <caption>Project status</caption>\n    <thead><tr><th scope=\"col\">Project</th><th scope=\"col\">Status</th></tr></thead>\n    <tbody>\n      <tr><th scope=\"row\">Website</th><td>In review</td></tr>\n      <tr><th scope=\"row\">Documentation</th><td>In progress</td></tr>\n    </tbody>\n  </table>\n</div>"
      },
      {
        "id": "bordered",
        "title": "Bordered table",
        "description": "Set data-table on html or a section for shared defaults, or on the table for a local override. The wrapper contains horizontal overflow.",
        "html": "<div class=\"table-scroll\" role=\"region\" aria-label=\"Project status, bordered table\" tabindex=\"0\">\n  <table data-table=\"bordered\">\n    <caption>Project status</caption>\n    <thead><tr><th scope=\"col\">Project</th><th scope=\"col\">Status</th></tr></thead>\n    <tbody>\n      <tr><th scope=\"row\">Website</th><td>In review</td></tr>\n      <tr><th scope=\"row\">Documentation</th><td>In progress</td></tr>\n    </tbody>\n  </table>\n</div>"
      }
    ]
  },
  {
    "slug": "media",
    "title": "Images and media",
    "intro": "Media scales within its container. Image attributes control cropping; meaningful alternative text remains your responsibility.",
    "examples": [
      {
        "id": "figure",
        "title": "Figures and responsive images",
        "description": "Supply intrinsic width and height to reserve space. Use a caption for visible context.",
        "html": "<figure>\n  <img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" alt=\"Illustrated hills beneath a pale sky\">\n  <figcaption>A responsive image with a caption.</figcaption>\n</figure>"
      },
      {
        "id": "image-ratio",
        "title": "Image ratios",
        "description": "data-ratio constrains the image. cover crops it; contain keeps the full image within the chosen ratio.",
        "html": "<div class=\"grid cols-2\">\n  <img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" data-ratio=\"square\" data-fit=\"cover\" alt=\"Hills, cropped to a square\">\n  <img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\" data-ratio=\"square\" data-fit=\"contain\" alt=\"The entire hills illustration inside a square\">\n</div>"
      }
    ]
  },
  {
    "slug": "disclosures",
    "title": "Disclosures and overlays",
    "intro": "Native HTML supplies disclosure and popover interactions. CSS styles their surfaces without adding application behavior.",
    "examples": [
      {
        "id": "details",
        "title": "Native disclosure",
        "description": "summary toggles its details. Add open if it should start expanded.",
        "html": "<details>\n  <summary>What is included?</summary>\n  <p>Native HTML foundations and optional component styles.</p>\n</details>"
      },
      {
        "id": "exclusive",
        "title": "Exclusive disclosure groups",
        "description": "Matching name values allow one disclosure in that group to remain open. Give separate instances unique group names.",
        "html": "<details name=\"demo-faq\">\n  <summary>Do I need JavaScript?</summary>\n  <p>These disclosures work with native HTML.</p>\n</details>\n<details name=\"demo-faq\">\n  <summary>Can I customise the styles?</summary>\n  <p>Use shared attributes and ordinary CSS.</p>\n</details>"
      },
      {
        "id": "popover",
        "title": "Native popover",
        "description": "popovertarget opens this popover without JavaScript in supporting browsers. Native auto popovers support light dismissal.",
        "html": "<button type=\"button\" popovertarget=\"demo-popover\">Show information</button>\n<div id=\"demo-popover\" popover>\n  <h3>Helpful information</h3>\n  <p>This is a native popover surface.</p>\n  <button type=\"button\" popovertarget=\"demo-popover\" popovertargetaction=\"hide\">Close</button>\n</div>"
      },
      {
        "id": "dialog",
        "title": "Dialog markup",
        "description": "open displays a non-modal dialog. This static markup does not implement modal opening or focus management; those require supported native invoker commands or a separate script. A form with method=\"dialog\" can close an open dialog.",
        "html": "<dialog open aria-labelledby=\"demo-dialog-title\">\n  <h3 id=\"demo-dialog-title\">Review your changes</h3>\n  <p>This example describes a non-modal dialog.</p>\n  <form method=\"dialog\"><button>Close</button></form>\n</dialog>",
        "isolated": true
      }
    ]
  }
];
