export const componentGroups = [
  {
    "key": "foundations",
    "title": "Foundations",
    "slugs": [
      "typography",
      "layouts",
      "tables",
      "media",
      "description-lists"
    ]
  },
  {
    "key": "forms",
    "title": "Forms and actions",
    "slugs": [
      "buttons",
      "forms",
      "form-groups",
      "input-groups",
      "switches",
      "toolbars"
    ]
  },
  {
    "key": "navigation",
    "title": "Navigation and disclosure",
    "slugs": [
      "top-menu",
      "dropdowns",
      "breadcrumbs",
      "pagination",
      "accordions",
      "tabs",
      "disclosures"
    ]
  },
  {
    "key": "feedback",
    "title": "Feedback and status",
    "slugs": [
      "alerts",
      "badges",
      "progress",
      "loading",
      "skeletons",
      "empty-states"
    ]
  },
  {
    "key": "content",
    "title": "Content and identity",
    "slugs": [
      "card-patterns",
      "lists",
      "avatars"
    ]
  }
];
export const componentContracts = {
  "dropdowns": [
    "ul.dropdown[popover=auto] > li > a or button",
    "Unique id and native popovertarget; role=list and a panel label.",
    "reva.dropdowns.css",
    "Native outside-click/Escape dismissal; ordinary Tab navigation, not an ARIA menu. Actions and in-page links do not automatically dismiss."
  ],
  "typography": [
    "Native headings, paragraphs, lists and inline text",
    "None; choose semantic HTML.",
    "reva.base.css",
    "Document structure comes from your markup."
  ],
  "layouts": [
    ".card, .container, .grid, .row, .stack",
    "Optional cols-2/cols-3; shared width and gap settings.",
    "reva.components.css",
    "Layouts arrange content; there is no numbered 12-column API."
  ],
  "tables": [
    "table; .table-scroll for overflow",
    "data-table; caption and native header cells.",
    "reva.components.css",
    "CSS does not sort, filter or fetch records."
  ],
  "media": [
    "img, video, figure",
    "data-ratio and data-fit; meaningful alt text.",
    "reva.components.css",
    "Intrinsic media dimensions and playback are browser/application-owned."
  ],
  "description-lists": [
    "dl.description-list, dt, dd",
    "Native div groups for term/value pairs.",
    "reva.description-lists.css",
    "Pairs adapt to their available container width."
  ],
  "buttons": [
    "button, action inputs; a.button for destinations",
    "Inherited data-variant; outline/ghost presentation; existing secondary/danger/warning classes.",
    "reva.base.css",
    "Local action attributes override inherited values and legacy classes; data-appearance remains badge/alert-only."
  ],
  "forms": [
    "label, input, select, textarea, fieldset, legend",
    "required, disabled, readonly, aria-invalid as appropriate.",
    "reva.base.css",
    "Native validation is preserved; applications provide error messages."
  ],
  "form-groups": [
    ".form-group; optional .field-error",
    "for/id labels and aria-describedby descriptions.",
    "reva.form-groups.css",
    "Error display and announcements are application-owned."
  ],
  "input-groups": [
    ".input-group around native controls and text",
    "A label remains outside or associated with the input.",
    "reva.input-groups.css",
    "Actions need an application handler or a real form destination."
  ],
  "switches": [
    "input.switch[type=checkbox] inside a label",
    "Native checked/disabled; optional role=switch.",
    "reva.switches.css",
    "Checked state, keyboard activation and submission remain native."
  ],
  "toolbars": [
    ".toolbar",
    "Use a named role=group for ordinary controls.",
    "reva.toolbars.css",
    "No ARIA toolbar arrow-key management is added."
  ],
  "top-menu": [
    ".top-menu and documented menu structure",
    "Unique panel IDs, popovertarget, popover=auto.",
    "reva.navigation.css",
    "Native popover support is required; nested focus restoration is browser-dependent."
  ],
  "breadcrumbs": [
    "nav.breadcrumbs > ol > li",
    "A landmark name; aria-current=page on the current location.",
    "reva.breadcrumbs.css",
    "Ancestor links need actual destinations."
  ],
  "pagination": [
    "nav.pagination > ol > li",
    "aria-current=page; spans for unavailable controls.",
    "reva.pagination.css",
    "Applications supply URLs, page counts and results."
  ],
  "accordions": [
    ".accordion > details > summary",
    "Optional shared unique name; native open attribute.",
    "reva.accordions.css",
    "Exclusive groups depend on native details name support."
  ],
  "tabs": [
    "fieldset.tabs, radio labels, .tab-panel",
    "One unique radio name per instance; label immediately before its panel.",
    "reva.tabs.css",
    "This is radio-selected content, not the ARIA tabs interaction contract."
  ],
  "disclosures": [
    "details/summary, dialog, [popover]",
    "Native open, popovertarget and popover attributes.",
    "reva.base.css",
    "Dialog styling does not itself implement a modal workflow."
  ],
  "alerts": [
    ".alert",
    "data-variant and data-appearance, including inherited values.",
    "reva.alerts.css",
    "Static messages have no automatic live region or dismissal."
  ],
  "badges": [
    ".badge",
    "data-variant and data-appearance, including inherited values.",
    "reva.badges.css",
    "Passive labels; no automatic announcements or interaction."
  ],
  "progress": [
    "progress, meter",
    "Native value/max and meter thresholds; accessible labels.",
    "reva.base.css",
    "Values and native indeterminate presentation are not calculated by CSS."
  ],
  "loading": [
    ".spinner",
    "Decorative aria-hidden plus visible loading text.",
    "reva.loading.css",
    "Application owns loading state; reduced motion stops the spinner."
  ],
  "skeletons": [
    ".skeleton",
    "Hide decorative placeholders; retain meaningful loading text.",
    "reva.skeletons.css",
    "Application owns aria-busy and replacing placeholders."
  ],
  "empty-states": [
    ".empty-state",
    "Ordinary heading, explanation and real next action.",
    "reva.empty-states.css",
    "Applications determine when there are no results."
  ],
  "card-patterns": [
    ".card with header, figure and footer",
    "Native structure; row for optional action arrangement.",
    "reva.card-patterns.css",
    "The components bundle includes the card surface and these patterns."
  ],
  "lists": [
    "ul.list-group or ol.list-group",
    "Keep role=list; ordinary links for destinations.",
    "reva.lists.css",
    "Ordinary collections, not interactive listboxes."
  ],
  "avatars": [
    ".avatar on img or an initials span",
    "alt text or full-name labelling when needed.",
    "reva.avatars.css",
    "Failed-image replacement must be supplied by the application."
  ]
};
export const learnLinks = [
 { key:'guide', title:'Get started', path:'guide/' },
 { key:'motion', title:'Motion and animations', path:'guide/motion/' },
 { key:'styling', title:'Styling and inheritance', path:'guide/styling/' },
 { key:'accessibility', title:'Behaviour and accessibility', path:'guide/accessibility/' },
 { key:'device-checks', title:'Real-device checks', path:'guide/device-checks/' }
];
export const themeLinks = [
 { key:'themes', title:'Theme overview', path:'themes/' },
 { key:'palettes', title:'Colour palettes', path:'themes/palettes/' },
 { key:'light', title:'Light', path:'themes/light/' },
 { key:'dark', title:'Dark', path:'themes/dark/' },
 { key:'auto', title:'System', path:'themes/auto/' },
 { key:'glass', title:'Glass material', path:'themes/glass/' }
];
export const referenceLinks = [
 { key:'reference', title:'API overview', path:'reference/' },
 { key:'attributes', title:'Attribute examples', path:'attributes/' },
 { key:'component-api', title:'Component API', path:'reference/components/' },
 { key:'tokens', title:'CSS tokens', path:'reference/tokens/' },
 { key:'icons', title:'SVG icons', path:'icons/' }
];
