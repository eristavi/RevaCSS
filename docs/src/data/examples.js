export const topics = [
{
  "slug": "switches",
  "title": "Switches",
  "intro": "A switch class styles a native checkbox as an on/off control. Checked state, keyboard activation, form submission and disabled behavior remain native.",
  "notes": [
    "Use switches for boolean settings. Keep a stable visible label; Space toggles the focused checkbox. Optional role=\"switch\" communicates on/off semantics while checked remains the native input state.",
    "Place the checkbox inside its label for a comfortable label target. Add aria-describedby for explanatory text. Do not maintain aria-checked manually on a native checkbox.",
    "Size, shape, accent, borders and motion follow the parent. Switches keep opaque control backing, including inside a glass section. Reduced-motion preferences stop thumb transitions.",
    "Included in complete, minified, scoped and components builds. Modular use: tokens, base and reva.switches.css."
  ],
  "examples": [
    {
      "id": "switch-basic",
      "title": "A native on/off setting",
      "description": "The label names the setting and activates its checkbox.",
      "html": "<label>\n  <input class=\"switch\" type=\"checkbox\" role=\"switch\"\n         name=\"email-updates\" checked>\n  Email updates\n</label>"
    },
    {
      "id": "switch-help",
      "title": "Help and disabled settings",
      "description": "Associated help text explains the setting. Native disabled prevents changes.",
      "html": "<div class=\"form-group\" data-shape=\"pill\">\n  <label>\n    <input class=\"switch\" type=\"checkbox\" role=\"switch\"\n           name=\"weekly-summary\" aria-describedby=\"weekly-summary-help\">\n    Weekly summary\n  </label>\n  <small id=\"weekly-summary-help\">Receive one summary every Monday.</small>\n</div>\n<label>\n  <input class=\"switch\" type=\"checkbox\" role=\"switch\"\n         name=\"managed-backups\" checked disabled>\n  Backups enabled by your administrator\n</label>"
    },
    {
      "id": "switch-inherited",
      "title": "Shared defaults",
      "description": "Set accent and size on the parent; controls only need the switch class.",
      "html": "<section data-accent=\"teal\" data-size=\"large\" data-shape=\"pill\">\n  <label><input class=\"switch\" type=\"checkbox\" role=\"switch\" checked> Notifications</label>\n  <label><input class=\"switch\" type=\"checkbox\" role=\"switch\">Activity emails</label>\n</section>"
    }
  ],
  "glass": false
},
{
  "slug": "input-groups",
  "title": "Input groups",
  "intro": "One input-group wrapper arranges a native input with text prefixes, suffixes or an action. Each field keeps its own label and shared control styling.",
  "notes": [
    "The prefix or suffix does not replace a label. Include units in the visible label and connect meaningful supporting text with aria-describedby when needed.",
    "Groups wrap when space is limited. Small gaps keep each control's borders and focus outline clear rather than relying on tightly joined corners.",
    "Use type=\"submit\" only for actions backed by an actual form. Application routes and processing remain your responsibility. Static action demos use type=\"button\".",
    "Included in complete, minified, scoped and components builds. Modular use: tokens, base and reva.input-groups.css."
  ],
  "examples": [
    {
      "id": "input-group-currency",
      "title": "An amount with a prefix",
      "description": "The visible label names both the field and its currency; the decorative prefix avoids repeating it.",
      "html": "<div class=\"form-group\">\n  <label for=\"invoice-amount\">Amount in euros</label>\n  <div class=\"input-group\">\n    <span aria-hidden=\"true\">€</span>\n    <input id=\"invoice-amount\" name=\"amount\" type=\"number\" min=\"0\" step=\"0.01\"\n           aria-describedby=\"invoice-amount-help\">\n  </div>\n  <small id=\"invoice-amount-help\">Enter the total before tax.</small>\n</div>"
    },
    {
      "id": "input-group-action",
      "title": "A field with an action",
      "description": "The example action is presentation-only. Your application supplies the search behavior.",
      "html": "<div class=\"form-group\">\n  <label for=\"group-search\">Search projects</label>\n  <div class=\"input-group\">\n    <input id=\"group-search\" name=\"query\" type=\"search\">\n    <button type=\"button\">Search</button>\n  </div>\n</div>"
    },
    {
      "id": "input-group-unit",
      "title": "A measured value",
      "description": "Units are explicit in the label, with a decorative suffix.",
      "html": "<div class=\"form-group\" data-size=\"small\">\n  <label for=\"package-weight\">Package weight in kilograms</label>\n  <div class=\"input-group\">\n    <input id=\"package-weight\" name=\"weight\" type=\"number\" min=\"0\" step=\"0.1\">\n    <span aria-hidden=\"true\">kg</span>\n  </div>\n</div>"
    }
  ],
  "glass": false
},
{
  "slug": "skeletons",
  "title": "Skeletons",
  "intro": "A skeleton class draws a decorative loading placeholder. Keep a real loading message available; your application controls when placeholders are replaced by content.",
  "notes": [
    "Hide decorative placeholders from assistive technology using aria-hidden=\"true\" on their containing wrapper. Do not place essential text inside a skeleton.",
    "aria-busy on the affected region communicates incomplete updates. Your application must clear busy state when the content arrives. A static documentation example adds no automatic live announcements.",
    "Theme, roundness and motion inherit. data-motion=\"none\" pauses shimmer, reduced-motion preferences remove it, and forced colours use static boundaries. Placeholders are omitted from print.",
    "Use --re-skeleton-width and --re-skeleton-height on a parent or individual exception. Included in all core builds; modular use: tokens, base and reva.skeletons.css."
  ],
  "examples": [
    {
      "id": "skeleton-card",
      "title": "Loading card content",
      "description": "Visible text explains the waiting state; only the placeholders are decorative.",
      "html": "<article class=\"card\" aria-busy=\"true\" aria-label=\"Project details\">\n  <p>Loading project details…</p>\n  <div class=\"stack\" aria-hidden=\"true\">\n    <span class=\"skeleton\" style=\"--re-skeleton-width: 55%;\"></span>\n    <span class=\"skeleton\"></span>\n    <span class=\"skeleton\" style=\"--re-skeleton-width: 80%;\"></span>\n  </div>\n</article>"
    },
    {
      "id": "skeleton-static",
      "title": "Shared stationary placeholders",
      "description": "The parent disables motion. An optional height gives the first placeholder a media shape.",
      "html": "<section data-motion=\"none\" data-shape=\"rounded\">\n  <p>Preparing a preview…</p>\n  <div class=\"stack\" aria-hidden=\"true\">\n    <span class=\"skeleton\" style=\"--re-skeleton-height: 8rem;\"></span>\n    <span class=\"skeleton\" style=\"--re-skeleton-width: 60%;\"></span>\n  </div>\n</section>"
    }
  ],
  "glass": false
},
{
  "slug": "toolbars",
  "title": "Toolbars",
  "intro": "One toolbar class arranges related native actions and allows them to wrap. Controls inherit their existing button and form styling.",
  "notes": [
    "Use role=\"group\" with a descriptive name for this CSS-only pattern. Each control remains a normal Tab stop. Do not add role=\"toolbar\" without implementing its expected arrow-key focus behavior.",
    "Use links for destinations and buttons for application actions. Native disabled works as usual. Name icon-only buttons explicitly.",
    "Gap and density inherit. The wrapper paints no extra surface; combine it with card when a surface is useful.",
    "Included in all core builds; modular use: tokens, base and reva.toolbars.css."
  ],
  "examples": [
    {
      "id": "toolbar-basic",
      "title": "A group of actions",
      "description": "The labelled group explains why these controls belong together.",
      "html": "<div class=\"toolbar\" role=\"group\" aria-label=\"Project actions\">\n  <button type=\"button\">Create project</button>\n  <button type=\"button\" class=\"secondary\">Export</button>\n  <button type=\"button\" disabled>Archive selected</button>\n</div>"
    },
    {
      "id": "toolbar-links",
      "title": "Related destinations",
      "description": "Ordinary links keep navigation semantics inside a labelled action group.",
      "html": "<div class=\"toolbar\" role=\"group\" aria-label=\"Documentation shortcuts\" data-gap=\"small\">\n  <a class=\"button\" href=\"__BASE__guide/\">Get started</a>\n  <a class=\"button secondary\" href=\"__BASE__attributes/\">Shared settings</a>\n  <a class=\"button outline\" href=\"__BASE__icons/\">SVG icons</a>\n</div>"
    }
  ],
  "glass": false
},
{
  "slug": "description-lists",
  "title": "Description lists",
  "intro": "One description-list class arranges native term and description pairs. Use this pattern for record summaries and profile metadata.",
  "notes": [
    "Use dl, dt and dd for associations, not a table when there are no tabular column relationships. A native div may group each term with its description.",
    "Pairs stack when their own container is narrow; a viewport fallback supports browsers without container queries. Use --re-description-label to customise the label column.",
    "Colours, density and borders inherit. Basic dl without this class retains normal document formatting.",
    "Included in all core builds; modular use: tokens, base and reva.description-lists.css."
  ],
  "examples": [
    {
      "id": "description-record",
      "title": "Record details",
      "description": "Each native div groups a term and its value.",
      "html": "<dl class=\"description-list\">\n  <div><dt>Project</dt><dd>RevaCSS</dd></div>\n  <div><dt>Status</dt><dd><span class=\"badge\" data-variant=\"success\">Active</span></dd></div>\n  <div><dt>Documentation</dt><dd><a href=\"__BASE__guide/\">Getting started</a></dd></div>\n</dl>"
    },
    {
      "id": "description-card",
      "title": "Metadata inside a card",
      "description": "The label width is optional; the enclosing card supplies its inherited surface.",
      "html": "<article class=\"card\">\n  <h3>Account summary</h3>\n  <dl class=\"description-list\" style=\"--re-description-label: 8rem;\">\n    <div><dt>Plan</dt><dd>Professional</dd></div>\n    <div><dt>Billing</dt><dd>Monthly</dd></div>\n    <div><dt>Team</dt><dd>12 members</dd></div>\n  </dl>\n</article>"
    }
  ],
  "glass": false
},
{
  "slug": "card-patterns",
  "title": "Card patterns",
  "intro": "Extend the existing card class with native header, figure and footer elements. No extra classes are needed for the card's structural sections.",
  "notes": [
    "Use article for self-contained content or section with an appropriate heading for a page section. Heading levels should fit the surrounding document.",
    "Header and footer separators follow shared borders and density. Native media keeps its responsive sizing and meaningful alternative text. Existing row and grid classes arrange actions or multiple cards.",
    "Theme, shape, depth, density and optional glass material belong to the existing card. The new module adds structure without replacing its surface styling.",
    "Included in all core builds. The components bundle already includes these patterns. reva.card-patterns.css is also available for projects supplying their own card surface; glass requires its matching extension."
  ],
  "examples": [
    {
      "id": "card-header-footer",
      "title": "Header, content and actions",
      "description": "Native elements identify the structural sections of the card.",
      "html": "<article class=\"card\">\n  <header>\n    <h3>Project overview</h3>\n    <p><span class=\"badge\">New</span> RevaCSS documentation</p>\n  </header>\n  <p>Start with inherited page defaults, then add only local exceptions.</p>\n  <footer class=\"row\">\n    <a class=\"button\" href=\"__BASE__guide/\">Read the guide</a>\n    <a href=\"__BASE__attributes/\">View defaults</a>\n  </footer>\n</article>"
    },
    {
      "id": "card-media",
      "title": "A media card",
      "description": "Intrinsic image dimensions reserve its natural space. The figure adds a visible caption.",
      "html": "<article class=\"card\">\n  <figure>\n    <img src=\"__BASE__images/example-landscape.svg\" width=\"640\" height=\"360\"\n         alt=\"Illustrated hills beneath a pale sky\">\n    <figcaption>A quiet landscape</figcaption>\n  </figure>\n  <h3>Explore the possibilities</h3>\n  <p>Native content and responsive media share the same surface.</p>\n  <footer><a href=\"__BASE__components/media/\">Explore media styling</a></footer>\n</article>"
    },
    {
      "id": "card-glass-pattern",
      "title": "Shared glass material",
      "description": "Only the enclosing section needs theme and material settings.",
      "html": "<section data-theme=\"dark\" data-material=\"glass\" data-shape=\"rounded\">\n  <article class=\"card\">\n    <header><h3>Frosted account summary</h3></header>\n    <p>A native header and footer follow the inherited card surface.</p>\n    <footer><a href=\"__BASE__themes/glass/\">Explore glass material</a></footer>\n  </article>\n</section>",
      "glass": true
    }
  ],
  "glass": true
},
{
  "slug": "progress",
  "title": "Progress and meters",
  "intro": "Native progress and meter elements already inherit the accent and available width. No component class is required.",
  "notes": [
    "Use progress for task completion. A missing value means indeterminate progress; native animation and appearance follow the browser. Provide a label and visible completion text.",
    "Use meter for a known measurement within a range, not loading. min, max, low, high and optimum describe its scale and meaningful thresholds. Native meter colours may reflect those thresholds rather than your accent.",
    "Your application or server supplies values. CSS cannot calculate completion or update measurements. Progress and meter have no added glass material or custom animation."
  ],
  "examples": [
    {
      "id": "progress-known",
      "title": "Known completion",
      "description": "A native label names the progress indicator; visible text communicates its value.",
      "html": "<div class=\"form-group\">\n  <label for=\"upload-completion\">Upload progress</label>\n  <progress id=\"upload-completion\" value=\"65\" max=\"100\">65%</progress>\n  <small>65% complete</small>\n</div>"
    },
    {
      "id": "progress-unknown",
      "title": "Indeterminate progress",
      "description": "Omit value when completion is unknown. Keep a visible explanation while the browser renders its native indicator.",
      "html": "<div class=\"form-group\">\n  <label for=\"indexing-progress\">Preparing your files</label>\n  <progress id=\"indexing-progress\">Working</progress>\n  <small>This may take a moment.</small>\n</div>"
    },
    {
      "id": "meter-range",
      "title": "A measured range",
      "description": "Meter describes a bounded measurement. The browser uses its native threshold presentation.",
      "html": "<div class=\"form-group\">\n  <label for=\"storage-capacity\">Storage used</label>\n  <meter id=\"storage-capacity\" min=\"0\" max=\"100\" low=\"50\"\n         high=\"85\" optimum=\"20\" value=\"72\">72%</meter>\n  <small>72 GB of 100 GB used</small>\n</div>"
    }
  ]
},
{
  "slug": "loading",
  "title": "Loading indicators",
  "intro": "A single spinner class supplies decorative CSS motion. Visible text explains what is happening; your application decides when to show or remove the indicator.",
  "notes": [
    "The spinner is decorative: use aria-hidden=\"true\" and keep meaningful text beside it. A static example needs no live-region role.",
    "For application updates, establish a role=\"status\" region before changing its text. aria-busy on the affected content can communicate that work is incomplete; your application manages its value.",
    "Size and motion follow shared parent settings. data-motion=\"none\" and reduced-motion preferences stop the custom spinner. The visible message remains available.",
    "Included in complete, scoped and components builds; modular use: tokens, base and reva.loading.css."
  ],
  "examples": [
    {
      "id": "loading-basic",
      "title": "Visible loading text",
      "description": "The text carries the meaning, so the spinner is hidden from assistive technology.",
      "html": "<p><span class=\"spinner\" aria-hidden=\"true\"></span> Loading your records…</p>"
    },
    {
      "id": "loading-still",
      "title": "Without animation",
      "description": "Configure motion on the parent to keep a stationary indicator.",
      "html": "<section data-motion=\"none\" data-size=\"large\">\n  <p><span class=\"spinner\" aria-hidden=\"true\"></span> Preparing your report…</p>\n</section>"
    },
    {
      "id": "loading-application",
      "title": "Application-owned status",
      "description": "Keep the live region in place before updating it; hide the decorative spinner once loading finishes.",
      "html": "<!-- Update this established region from your application. -->\n<p role=\"status\">\n  <span class=\"spinner\" aria-hidden=\"true\"></span>\n  Loading results…\n</p>",
      "render": false
    }
  ]
},
{
  "slug": "tabs",
  "title": "Tabs: native choice panels",
  "intro": "A tabs fieldset uses native radio choices to show one associated panel at a time. The controls retain their radio semantics and keyboard behavior; no JavaScript is added.",
  "notes": [
    "This is a radio-selection pattern, not an ARIA tab widget. Do not add tablist/tab roles or manually maintained aria-selected attributes. For an application that specifically needs the ARIA tabs interaction contract, use a separate behavior layer.",
    "Give the fieldset a legend and every radio a label. Use one unique radio name per instance and mark exactly one radio checked. Tab enters the radio group; arrow keys select its native choices.",
    "Keep each tab-panel immediately after its label. Panels may contain ordinary headings, links and controls. CSS :has selects the checked radio's following panel. Without :has support, all panels remain readable; print also shows all panels.",
    "Theme, shape, size, density, gap, borders and fieldset material follow the parent. Controls remain visibly native. Included in complete, scoped and components builds; modular use: tokens, base and reva.tabs.css."
  ],
  "examples": [
    {
      "id": "tabs-basic",
      "title": "Two choice panels",
      "description": "The native radio labels select their immediately following sections.",
      "html": "<fieldset class=\"tabs\">\n  <legend>Account information</legend>\n  <label>\n    <input type=\"radio\" name=\"account-panels\" checked> Overview\n  </label>\n  <section class=\"tab-panel\">\n    <h3>Account overview</h3>\n    <p>Your account is active.</p>\n  </section>\n  <label>\n    <input type=\"radio\" name=\"account-panels\"> Preferences\n  </label>\n  <section class=\"tab-panel\">\n    <h3>Your preferences</h3>\n    <p>Choose preferences in your application settings.</p>\n    <a href=\"__BASE__components/form-groups/\">Explore form groups</a>\n  </section>\n</fieldset>"
    },
    {
      "id": "tabs-independent",
      "title": "An independent instance",
      "description": "A different name keeps this selection independent of the first example.",
      "html": "<fieldset class=\"tabs\" data-shape=\"pill\" data-gap=\"small\">\n  <legend>Documentation view</legend>\n  <label><input type=\"radio\" name=\"documentation-panels\" checked> HTML</label>\n  <section class=\"tab-panel\">\n    <p>Start with native elements and shared parent settings.</p>\n  </section>\n  <label><input type=\"radio\" name=\"documentation-panels\"> Styling</label>\n  <section class=\"tab-panel\">\n    <p>Add a component class only when the pattern needs one.</p>\n  </section>\n</fieldset>"
    }
  ]
},
{
  "slug": "lists",
  "title": "List groups",
  "intro": "One list-group class arranges ordinary list items with shared surface colours, borders, shape and density. Native lists without this class retain their existing typography.",
  "notes": [
    "Use ul for an unordered collection and ol when order matters. Keep role=\"list\" because list-style:none can affect list announcements in some browsers.",
    "Use links for destinations. A list item needs no extra class; its only-child link gets a comfortable minimum target height. Do not use listbox roles for ordinary navigation.",
    "aria-current marks the actual current destination. Status badges remain passive content inside a list item.",
    "Included in complete, scoped and components builds; modular use: tokens, base and reva.lists.css. Load the matching optional glass extension to inherit frosted list-item backing."
  ],
  "examples": [
    {
      "id": "list-basic",
      "title": "Text items with badges",
      "description": "Standard list markup supports richer content without per-item classes.",
      "html": "<ul class=\"list-group\" role=\"list\">\n  <li>Profile <span class=\"badge\" data-variant=\"success\">Complete</span></li>\n  <li>Billing <span class=\"badge\" data-variant=\"warning\">Review needed</span></li>\n  <li>Notifications enabled</li>\n</ul>"
    },
    {
      "id": "list-links",
      "title": "Linked items",
      "description": "A labelled navigation landmark contains real documentation destinations.",
      "html": "<nav aria-label=\"Related documentation\">\n  <ul class=\"list-group\" role=\"list\">\n    <li><a href=\"__BASE__guide/\">Getting started</a></li>\n    <li><a href=\"__BASE__attributes/\">Shared attributes</a></li>\n    <li><a href=\"__BASE__components/lists/\" aria-current=\"page\">List groups</a></li>\n  </ul>\n</nav>"
    }
  ]
},
{
  "slug": "empty-states",
  "title": "Empty states",
  "intro": "One empty-state class centres ordinary content with readable spacing. Your application decides when the collection is empty; CSS only arranges the message.",
  "notes": [
    "Explain what is missing and the next useful action. Keep headings at the appropriate document level and use native links for navigation.",
    "An empty state is content, not automatically an alert. For application-updated results, choose an appropriate established announcement region only when needed.",
    "Spacing follows density, text follows the theme, and native actions keep their inherited styling. Combine with card when a surface is useful; card can receive optional glass material.",
    "Included in complete, scoped and components builds; modular use: tokens, base and reva.empty-states.css."
  ],
  "examples": [
    {
      "id": "empty-basic",
      "title": "No records yet",
      "description": "A heading and explanation are enough when there is no meaningful action to offer.",
      "html": "<section class=\"empty-state\" aria-labelledby=\"empty-records-heading\">\n  <h3 id=\"empty-records-heading\">No records yet</h3>\n  <p>Your records will appear here after you add them.</p>\n</section>"
    },
    {
      "id": "empty-action",
      "title": "A useful next step",
      "description": "Combine existing card and button styles with the empty-state layout.",
      "html": "<section class=\"card empty-state\" aria-labelledby=\"empty-start-heading\">\n  <h3 id=\"empty-start-heading\">Start your first project</h3>\n  <p>Explore the guide to choose your page defaults and components.</p>\n  <a class=\"button\" href=\"__BASE__guide/\">Read the guide</a>\n</section>"
    }
  ]
},
{
  "slug": "avatars",
  "title": "Avatars",
  "intro": "One avatar class supports an image or explicit initials. Size, shape, borders and colours follow shared parent defaults.",
  "notes": [
    "Use meaningful alt text when the image identifies a person. Use alt=\"\" when a nearby visible name already gives the same information.",
    "For standalone initials, supply the full name through an accessible label. Initials are not an automatic image-loading fallback; your application or server chooses which markup to render.",
    "data-shape=\"pill\" makes the square avatar round. Use --re-avatar-size for a custom base dimension; data-size scales it. Set attributes on a parent for shared defaults.",
    "Included in complete, scoped and components builds; modular use: tokens, base and reva.avatars.css. Avatar backing remains opaque."
  ],
  "examples": [
    {
      "id": "avatar-initials",
      "title": "Initials with a full name",
      "description": "The visible name gives context, so the initials are decorative.",
      "html": "<div class=\"row\" data-shape=\"pill\">\n  <span class=\"avatar\" aria-hidden=\"true\">RE</span>\n  <span>Revaz Eristavi</span>\n</div>"
    },
    {
      "id": "avatar-image",
      "title": "Image markup",
      "description": "This documentation illustration demonstrates cropping. Replace the source with a real profile image.",
      "html": "<div class=\"row\" data-shape=\"pill\">\n  <img class=\"avatar\" src=\"__BASE__images/example-landscape.svg\"\n       width=\"44\" height=\"44\" alt=\"\">\n  <span>Example profile</span>\n</div>"
    },
    {
      "id": "avatar-sizes",
      "title": "Inherited sizes and shapes",
      "description": "Each parent supplies a size. A full accessible name accompanies standalone initials.",
      "html": "<div class=\"row\" data-shape=\"pill\">\n  <section data-size=\"small\"><span class=\"avatar\" role=\"img\" aria-label=\"Alex Morgan\">AM</span></section>\n  <section data-size=\"medium\"><span class=\"avatar\" role=\"img\" aria-label=\"Jamie Lee\">JL</span></section>\n  <section data-size=\"large\"><span class=\"avatar\" role=\"img\" aria-label=\"Sam Taylor\">ST</span></section>\n</div>"
    }
  ]
},
{
  "slug": "accordions",
  "title": "Accordions",
  "glass": true,
  "intro": "Native details and summary elements provide the interaction. One accordion wrapper arranges the group; theme, shape, density, spacing, borders, depth and material inherit from the parent.",
  "notes": [
    "Keep summary as the first child of details. Its native marker and keyboard behavior remain intact; do not add button roles or manually maintained aria-expanded attributes.",
    "Omit name to allow multiple items to stay open. Give details a shared, unique name for native exclusive groups. Browsers without exclusive-group support still provide independent disclosure toggles. Names are document-wide, so separate accordion instances need different names.",
    "Use open on at most one item in an exclusive group. CSS does not add custom arrow-key navigation, opening animations or force collapsed content to print.",
    "Included in the complete, scoped and components builds. Modular use: tokens, base and reva.accordions.css; glass requires its matching extension."
  ],
  "examples": [
    {
      "id": "accordion-basic",
      "title": "Independent sections",
      "description": "Each native disclosure opens and closes independently. The wrapper supplies spacing without extra classes on items.",
      "html": "<div class=\"accordion\">\n  <details open>\n    <summary>What does RevaCSS include?</summary>\n    <p>Native HTML styling and optional components.</p>\n  </details>\n  <details>\n    <summary>Do I need JavaScript?</summary>\n    <p>These accordions work through native browser behavior.</p>\n  </details>\n</div>"
    },
    {
      "id": "accordion-exclusive",
      "title": "One item open at a time",
      "description": "Matching name attributes request an exclusive group. Use a different name for every group in your document.",
      "html": "<div class=\"accordion\">\n  <details name=\"account-faq\" open>\n    <summary>How do I create an account?</summary>\n    <p>Complete the registration form.</p>\n  </details>\n  <details name=\"account-faq\">\n    <summary>How do I change my details?</summary>\n    <p>Open your profile settings.</p>\n  </details>\n</div>"
    },
    {
      "id": "accordion-glass",
      "title": "Inherited material and shape",
      "description": "Configure the wrapper once. Both native disclosures inherit glass, dark colours and roundness.",
      "glass": true,
      "html": "<div class=\"accordion\" data-theme=\"dark\" data-material=\"glass\"\n     data-shape=\"rounded\" data-gap=\"small\">\n  <details>\n    <summary>Shared appearance</summary>\n    <p>This disclosure follows its parent settings.</p>\n  </details>\n  <details>\n    <summary>More information</summary>\n    <p>No component attributes are repeated.</p>\n  </details>\n</div>"
    }
  ]
},
{
  "slug": "breadcrumbs",
  "title": "Breadcrumbs",
  "intro": "One breadcrumbs class styles a native navigation landmark and ordered list. Real links lead to ancestor pages; aria-current identifies the current page.",
  "notes": [
    "Give the navigation a descriptive aria-label, particularly when there are other navigation landmarks.",
    "Keep role=\"list\" on the list to preserve list announcements in browsers that treat list-style:none differently. Decorative separators have no spoken text.",
    "Use actual destination URLs in your application. The documentation examples link to real documentation pages. Theme, typography, size and density inherit; breadcrumbs have no surface requiring glass.",
    "Included in complete, scoped and components builds; modular use: tokens, base and reva.breadcrumbs.css."
  ],
  "examples": [
    {
      "id": "breadcrumbs-basic",
      "title": "A page trail",
      "description": "The current location is plain text with aria-current; only ancestor pages are links.",
      "html": "<nav class=\"breadcrumbs\" aria-label=\"Breadcrumb\">\n  <ol role=\"list\">\n    <li><a href=\"__BASE__\">Home</a></li>\n    <li><a href=\"__BASE__guide/\">Guide</a></li>\n    <li><span aria-current=\"page\">Breadcrumbs</span></li>\n  </ol>\n</nav>"
    },
    {
      "id": "breadcrumbs-long",
      "title": "Wrapping and parent defaults",
      "description": "Long labels wrap. The same logical layout works with the document reading direction.",
      "html": "<section data-size=\"small\" data-density=\"compact\">\n  <nav class=\"breadcrumbs\" aria-label=\"Documentation breadcrumb\">\n    <ol role=\"list\">\n      <li><a href=\"__BASE__\">Documentation home</a></li>\n      <li><a href=\"__BASE__attributes/\">Shared component settings and defaults</a></li>\n      <li><span aria-current=\"page\">Customising navigation for your project</span></li>\n    </ol>\n  </nav>\n</section>"
    }
  ]
},
{
  "slug": "pagination",
  "title": "Pagination",
  "glass": true,
  "intro": "One pagination class arranges native page links. Shared theme, size, density, shape, depth, borders, gap and optional glass styling inherit from the parent. Your server or application supplies page destinations.",
  "notes": [
    "Use a labelled nav and ordered list. Give numeric links accessible names such as Page 2. Mark exactly one current page with aria-current=\"page\".",
    "Unavailable controls are spans with aria-disabled=\"true\", without href or tabindex. aria-disabled alone does not stop a link from navigating. Ellipses are text, not controls.",
    "CSS provides presentation only. It does not fetch results, calculate page counts, change the current page or restore focus after an application update.",
    "The live demo links navigate to this page's example anchors to demonstrate native navigation. Production markup should point to actual result pages.",
    "Included in complete, scoped and components builds; modular use: tokens, base and reva.pagination.css. Glass requires its matching extension."
  ],
  "examples": [
    {
      "id": "pagination-basic",
      "title": "Current and unavailable pages",
      "description": "The current page and unavailable Previous control are plain spans. Demo links have real anchor destinations.",
      "html": "<nav class=\"pagination\" aria-label=\"Example pages\">\n  <ol role=\"list\">\n    <li><span aria-disabled=\"true\">Previous</span></li>\n    <li><span aria-current=\"page\" aria-label=\"Page 1\">1</span></li>\n    <li><a href=\"#pagination-more\" aria-label=\"Page 2\">2</a></li>\n    <li><a href=\"#pagination-glass\" aria-label=\"Page 3\">3</a></li>\n    <li><a href=\"#pagination-more\" rel=\"next\">Next</a></li>\n  </ol>\n</nav>"
    },
    {
      "id": "pagination-more",
      "title": "A longer range",
      "description": "Ellipses are passive text. Links wrap rather than stretching the page beyond its container.",
      "html": "<nav class=\"pagination\" aria-label=\"Long example page range\">\n  <ol role=\"list\">\n    <li><a href=\"#pagination-basic\" rel=\"prev\">Previous</a></li>\n    <li><a href=\"#pagination-basic\" aria-label=\"Page 1\">1</a></li>\n    <li><span aria-label=\"More pages\">…</span></li>\n    <li><span aria-current=\"page\" aria-label=\"Page 8\">8</span></li>\n    <li><span aria-label=\"More pages\">…</span></li>\n    <li><a href=\"#pagination-glass\" aria-label=\"Page 20\">20</a></li>\n    <li><a href=\"#pagination-glass\" rel=\"next\">Next</a></li>\n  </ol>\n</nav>"
    },
    {
      "id": "pagination-glass",
      "title": "Inherited glass and pill shape",
      "description": "The parent supplies material and shape; page links need no styling attributes.",
      "glass": true,
      "html": "<section data-theme=\"dark\" data-material=\"glass\" data-shape=\"pill\">\n  <nav class=\"pagination\" aria-label=\"Glass example pages\">\n    <ol role=\"list\">\n      <li><a href=\"#pagination-basic\" rel=\"prev\">Previous</a></li>\n      <li><a href=\"#pagination-basic\" aria-label=\"Page 1\">1</a></li>\n      <li><span aria-current=\"page\" aria-label=\"Page 2\">2</span></li>\n      <li><span aria-disabled=\"true\">Next</span></li>\n    </ol>\n  </nav>\n</section>"
    },
    {
      "id": "pagination-production",
      "title": "Application URL pattern",
      "description": "Replace these sample paths with routes served by your application. This is code-only to avoid navigating to unimplemented demo routes.",
      "render": false,
      "html": "<nav class=\"pagination\" aria-label=\"Search result pages\">\n  <ol role=\"list\">\n    <li><a href=\"/search?page=1\" rel=\"prev\">Previous</a></li>\n    <li><a href=\"/search?page=1\" aria-label=\"Page 1\">1</a></li>\n    <li><span aria-current=\"page\" aria-label=\"Page 2\">2</span></li>\n    <li><a href=\"/search?page=3\" aria-label=\"Page 3\">3</a></li>\n    <li><a href=\"/search?page=3\" rel=\"next\">Next</a></li>\n  </ol>\n</nav>"
    }
  ]
},
{
  "slug": "form-groups",
  "title": "Form groups",
  "glass": true,
  "intro": "One form-group class keeps a native label, control and help text together. Theme and control settings inherit from the parent; use fieldset and legend for related choices.",
  "notes": [
    "Every control needs an accessible label. Match label for to a unique control id. Associate help and error text using aria-describedby; placeholders do not replace labels.",
    "Use native required, disabled and readonly where appropriate. aria-invalid=\"true\" marks a known validation error; your server or application owns the error text and when it is shown. CSS does not generate validation messages.",
    "The optional field-error class styles explicit error text. State the error in words and explain how to fix it; do not rely only on a red border.",
    "Use existing grid and stack classes for arrangement. This component adds no grid system. Optional glass affects existing fieldsets, while text controls retain their normal readable backing.",
    "Included in complete, scoped and components builds; modular use: tokens, base and reva.form-groups.css."
  ],
  "examples": [
    {
      "id": "form-group-basic",
      "title": "Label, control and help",
      "description": "Only the group needs a class. IDs connect the label and explanation to the native control.",
      "html": "<div class=\"form-group\">\n  <label for=\"profile-display-name\">Display name</label>\n  <input id=\"profile-display-name\" name=\"display-name\"\n         autocomplete=\"nickname\" aria-describedby=\"profile-name-help\">\n  <small id=\"profile-name-help\">The name shown on your public profile.</small>\n</div>"
    },
    {
      "id": "form-group-error",
      "title": "A known validation error",
      "description": "This static server-validation example includes an explicit error and aria-invalid. No automatic validation script is added.",
      "html": "<div class=\"form-group\">\n  <label for=\"profile-email\">Email address (required)</label>\n  <input id=\"profile-email\" name=\"email\" type=\"email\" required\n         autocomplete=\"email\" value=\"invalid-address\" aria-invalid=\"true\"\n         aria-describedby=\"profile-email-help profile-email-error\">\n  <small id=\"profile-email-help\">We use this for account notifications.</small>\n  <small class=\"field-error\" id=\"profile-email-error\">Enter a complete email address, such as name@example.com.</small>\n</div>"
    },
    {
      "id": "form-group-grid",
      "title": "Responsive grouped fields",
      "description": "Existing grid layout arranges groups. A textarea and select retain native behavior and shared control styling.",
      "html": "<div class=\"grid\" data-size=\"medium\" data-density=\"comfortable\">\n  <div class=\"form-group\">\n    <label for=\"profile-language\">Language</label>\n    <select id=\"profile-language\" name=\"language\">\n      <option value=\"en\">English</option>\n      <option value=\"fr\">French</option>\n    </select>\n  </div>\n  <div class=\"form-group\">\n    <label for=\"profile-bio\">About you</label>\n    <textarea id=\"profile-bio\" name=\"bio\" rows=\"3\"\n              aria-describedby=\"profile-bio-help\"></textarea>\n    <small id=\"profile-bio-help\">Write a short introduction.</small>\n  </div>\n</div>"
    },
    {
      "id": "form-group-choices",
      "title": "Related choices in a fieldset",
      "description": "The legend names the group. Each radio has its own native label. This fieldset inherits optional glass material.",
      "glass": true,
      "html": "<section data-material=\"glass\" data-theme=\"dark\">\n  <fieldset aria-describedby=\"contact-channel-help\">\n    <legend>Preferred contact method</legend>\n    <div class=\"form-group\">\n      <label><input type=\"radio\" name=\"contact-channel\" value=\"email\" checked> Email</label>\n      <label><input type=\"radio\" name=\"contact-channel\" value=\"phone\"> Phone</label>\n      <small id=\"contact-channel-help\">Choose one contact method.</small>\n    </div>\n  </fieldset>\n</section>"
    }
  ]
},
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
  "slug": "alerts",
  "title": "Alerts",
  "glass": true,
  "intro": "Messages with one alert class. Theme, accent, shape, size, density, depth, borders, fill and material follow the parent. Attributes are optional exceptions, not required on every alert.",
  "notes": [
    "Default: primary variant with a tinted appearance. Primary uses your inherited accent for informational messages. Success, warning, danger and neutral share the badge vocabulary. Write the meaning in text; colour alone is insufficient.",
    "Use ordinary div, section or paragraph markup for static messages. The alert class does not create a live region. For a message updated by your application, establish role=\"status\" before a non-urgent update, or role=\"alert\" for an urgent update that warrants interruption. These ARIA roles do not add interactivity.",
    "data-variant and data-appearance work on html, parent sections or individual exceptions. Unsupported values preserve the nearest valid ancestor setting. Decorative data-edge does not apply to alerts.",
    "Alerts are persistent. CSS does not provide a dismiss action; no inactive close buttons are included. Use native links for destinations and buttons only for actions implemented by your application.",
    "The complete, minified, scoped and components builds include alerts. Modular use: load tokens and base, then reva.alerts.css. Glass requires the matching optional glass stylesheet after the core. Higher contrast, reduced transparency, forced colours and print receive opaque treatments."
  ],
  "examples": [
    {
      "id": "basic-alert",
      "title": "One class, no attributes",
      "description": "A static informational message uses the inherited accent and needs no announcement role.",
      "html": "<div class=\"alert\">\n  <strong>Information:</strong> Your draft is saved locally.\n</div>"
    },
    {
      "id": "alert-variants",
      "title": "Shared status variants",
      "description": "Choose meaning through visible text and optional variants. Each message stays readable without relying on its colour.",
      "html": "<div class=\"stack\">\n  <div class=\"alert\">Information: Your next invoice arrives on Monday.</div>\n  <div class=\"alert\" data-variant=\"success\">Success: Your changes have been saved.</div>\n  <div class=\"alert\" data-variant=\"warning\">Warning: Your subscription expires in three days.</div>\n  <div class=\"alert\" data-variant=\"danger\">Error: Your payment could not be processed.</div>\n  <div class=\"alert\" data-variant=\"neutral\">Note: This project is archived.</div>\n</div>"
    },
    {
      "id": "alert-content",
      "title": "Headings, lists and links",
      "description": "Ordinary HTML supports richer messages. Use a heading level that fits your document and descriptive links.",
      "html": "<section class=\"alert\" data-variant=\"warning\" aria-labelledby=\"alert-review-heading\">\n  <h3 id=\"alert-review-heading\">Review before continuing</h3>\n  <p>Please check the following details:</p>\n  <ul>\n    <li>Your billing address</li>\n    <li>Your preferred payment method</li>\n  </ul>\n  <p><a href=\"#main\">Return to the documentation content</a></p>\n</section>"
    },
    {
      "id": "alert-inheritance",
      "title": "Parent defaults and local exceptions",
      "description": "Both alerts inherit appearance and shape. Only the exception needs its own variant.",
      "html": "<section class=\"stack\" data-variant=\"success\" data-appearance=\"tinted\"\n         data-shape=\"rounded\" data-density=\"comfortable\">\n  <div class=\"alert\">Success: Your profile is complete.</div>\n  <div class=\"alert\" data-variant=\"warning\">Warning: Verify your email address.</div>\n</section>"
    },
    {
      "id": "alert-appearance",
      "title": "Tinted, solid and outline",
      "description": "The same appearance setting configures badges and alerts. Outline keeps an opaque surface backing for readable content.",
      "html": "<div class=\"stack\" data-variant=\"success\">\n  <div class=\"alert\">Success: Tinted appearance.</div>\n  <div class=\"alert\" data-appearance=\"solid\">Success: Solid appearance.</div>\n  <div class=\"alert\" data-appearance=\"outline\">Success: Outline appearance.</div>\n</div>"
    },
    {
      "id": "alert-glass",
      "title": "Glass with a solid exception",
      "description": "Load the optional glass extension. Parent material carries into alerts; a local solid section stops it. Unsupported blur retains opaque backing.",
      "glass": true,
      "html": "<section class=\"stack\" data-theme=\"dark\" data-material=\"glass\">\n  <div class=\"alert\">Information: A frosted message surface.</div>\n  <section data-material=\"solid\">\n    <div class=\"alert\">Information: An opaque local exception.</div>\n  </section>\n</section>"
    },
    {
      "id": "alert-announcements",
      "title": "Application announcement markup",
      "description": "This markup is for an application that later updates the message. Keep the region in the document before updating its contents; use urgent alerts sparingly.",
      "render": false,
      "html": "<!-- Non-urgent feedback; populate after a completed action. -->\n<div class=\"alert\" data-variant=\"success\" role=\"status\"></div>\n\n<!-- Urgent feedback; populate when immediate attention is needed. -->\n<div class=\"alert\" data-variant=\"danger\" role=\"alert\"></div>"
    }
  ]
},
  {
    "slug": "badges",
    "title": "Badges",
    "glass": true,
    "intro": "Passive status labels, counts and categories. One badge class identifies the component; theme, accent, size, shape, density, depth, borders and material follow the parent. No attributes are required on individual badges.",
    "notes": [
      "Use a span for a plain label. A badge has no automatic alert/status role, focusability or live announcement. For changing information, choose a live region on its meaningful containing element only when announcements are needed.",
      "Write the status in visible text. Colour alone must not carry its meaning. Counts need context, for example \u201c3 unread messages.\u201d Use native links and buttons for actions; a badge itself is a passive label.",
      "data-variant (primary, success, warning, danger, neutral) and data-appearance (tinted, solid, outline) configure badges on html, any parent, or an optional local exception. Unsupported values keep the nearest valid parent setting. data-fill retains its existing gradient/solid meaning; decorative data-edge does not apply to badges.",
      "The complete, minified, scoped and components builds include badges. For modular use, load tokens and base, then reva.badges.css. Glass needs reva.glass.css after the matching core. Accessibility preferences and print keep labels readable."
    ],
    "examples": [
      {
        "id": "basic-badges",
        "title": "One class, no attributes",
        "description": "The default badge is tinted and uses the inherited accent. Use ordinary text around a count to explain it.",
        "html": "<p>Product update <span class=\"badge\">New</span></p>\n<p>Unread messages <span class=\"badge\">3</span></p>"
      },
      {
        "id": "badge-parent",
        "title": "Configure a parent once",
        "description": "Both badges inherit the parent. The same settings can be placed on html for the whole site.",
        "html": "<section data-theme=\"dark\" data-accent=\"violet\"\n         data-shape=\"pill\" data-size=\"large\"\n         data-appearance=\"solid\" data-depth=\"flat\">\n  <p>\n    <span class=\"badge\">Featured</span> <span class=\"badge\">New</span></p>\n</section>"
      },
      {
        "id": "badge-status",
        "title": "Status colours from parents",
        "description": "A status on a parent applies to all badges inside it. Each label states its meaning in text.",
        "html": "<div class=\"row\">\n  <section data-variant=\"primary\">\n    <span class=\"badge\">New</span>\n  </section>\n  <section data-variant=\"success\">\n    <span class=\"badge\">Approved</span>\n  </section>\n  <section data-variant=\"warning\">\n    <span class=\"badge\">Pending</span>\n  </section>\n  <section data-variant=\"danger\">\n    <span class=\"badge\">Overdue</span>\n  </section>\n  <section data-variant=\"neutral\">\n    <span class=\"badge\">Archived</span>\n  </section>\n</div>"
      },
      {
        "id": "badge-appearance",
        "title": "Tinted, solid and outline",
        "description": "Appearance is separate from status and from the shared gradient setting.",
        "html": "<div class=\"row\" data-variant=\"success\">\n  <section data-appearance=\"tinted\">\n    <span class=\"badge\">Tinted</span>\n  </section>\n  <section data-appearance=\"solid\">\n    <span class=\"badge\">Solid</span>\n  </section>\n  <section data-appearance=\"outline\">\n    <span class=\"badge\">Outline</span>\n  </section>\n</div>"
      },
      {
        "id": "badge-size",
        "title": "Shared size and shape",
        "description": "Size and shape are inherited. Labels can wrap instead of widening a narrow page.",
        "html": "<div class=\"row\" data-shape=\"pill\">\n  <section data-size=\"small\">\n    <span class=\"badge\">Small</span>\n  </section>\n  <section data-size=\"medium\">\n    <span class=\"badge\">Medium</span>\n  </section>\n  <section data-size=\"large\">\n    <span class=\"badge\">Large</span>\n  </section>\n</div>\n<p data-shape=\"square\">\n    <span class=\"badge\">Square</span></p>"
      },
      {
        "id": "badge-overrides",
        "title": "Optional local exceptions",
        "description": "The parent remains the default. Override only the label or subtree that needs to differ; plain buttons keep their existing API.",
        "html": "<section data-variant=\"success\" data-appearance=\"solid\">\n  <p>\n    <span class=\"badge\">Approved</span></p>\n  <p><span class=\"badge\" data-variant=\"warning\">Pending review</span></p>\n  <section data-appearance=\"outline\">\n    <p>\n    <span class=\"badge\">Paid</span></p>\n  </section>\n</section>"
      },
      {
        "id": "badge-glass",
        "title": "Inherited glass with a solid exception",
        "description": "Load the optional glass stylesheet. Badges inherit material; solid stops it locally. Unsupported blur falls back to the normal opaque badge.",
        "glass": true,
        "html": "<section data-material=\"glass\" data-theme=\"dark\"\n         data-shape=\"pill\" data-variant=\"primary\">\n  <p>\n    <span class=\"badge\">Glass label</span></p>\n  <section data-material=\"solid\">\n    <p>\n    <span class=\"badge\">Solid exception</span></p>\n  </section>\n</section>"
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
