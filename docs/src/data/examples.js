import {nativePatternTopics} from "./native-patterns.js";
export const topics = [
  {
    "slug": "scroll-top",
    "title": "Scroll to top",
    "intro": "A labelled native link returns to a page-owned top anchor. One structural class; no JavaScript.",
    "notes": [
      "Included in complete and scoped builds. Modular consumers load tokens, base, reva.scroll-top.css and reva.scrolling.css.",
      "Put a unique ID at the beginning of your page and link to it. Keep a visible label; decorative arrows are aria-hidden.",
      "The link is in normal flow by default. It stays available without a scroll timeline or observer and is hidden in print.",
      "Document scrolling follows data-motion on html. Local motion on the link alone cannot change the viewport scroll container.",
      "For a floating link, application CSS can set position:fixed and physical safe-area offsets. Reserve enough space so it cannot cover content, controls or focused elements."
    ],
    "examples": [
      {
        "id": "scroll-top-basic",
        "title": "Footer return link",
        "description": "This example links to the top of this documentation page.",
        "html": "<a class=\"scroll-top\" href=\"#page-top\"><span aria-hidden=\"true\">↑</span> Back to top</a>"
      },
      {
        "id": "scroll-top-page",
        "title": "Complete anchor structure",
        "render": false,
        "html": "<body id=\"page-top\">\n  <main>Page content</main>\n  <footer><a class=\"scroll-top\" href=\"#page-top\">Back to top</a></footer>\n</body>"
      }
    ]
  },

...nativePatternTopics,
{
  "slug": "selects",
  "title": "Native select dropdowns",
  "intro": "An optional CSS-only enhancement styles ordinary select option lists with the existing framework tokens. No classes, extra wrappers or new data attributes.",
  "notes": [
    "Load reva.selects.css after the global core, or reva.selects.scoped.css after the scoped core. The documentation loads the extension for its live examples.",
    "The enhancement is guarded by support for appearance:base-select and ::picker(select). Unsupported browsers retain their ordinary native picker. Supported browsers use an in-page picker rather than the operating-system mobile selection sheet.",
    "Only single-selection dropdowns are enhanced. Multiple selects and size greater than one keep their native listbox treatment. Labels, names, values, required validation and disabled options remain native HTML.",
    "Theme, palette, typography, size, density, shape, border and depth use existing tokens. The option surface stays opaque for readability, including inside a glass parent. Selected options keep the browser checkmark; disabled options remain unavailable.",
    "Picker icons respect motion and reduced-motion preferences. Forced colours use system colours and visible selection states. Browser keyboard behaviour and form submission are retained; CSS does not search or fetch options."
  ],
  "examples": [
    {
      "id": "native-select-basic",
      "title": "Ordinary select, framework option list",
      "description": "The same simple HTML works with and without the optional stylesheet.",
      "html": "<label for=\"native-select-project\">Project status</label>\n<select id=\"native-select-project\" name=\"status\">\n  <option value=\"active\">In progress</option>\n  <option value=\"review\">In review</option>\n  <option value=\"complete\">Complete</option>\n</select>"
    },
    {
      "id": "native-select-groups",
      "title": "Groups and disabled options",
      "description": "Native groups, disabled options and a longer label.",
      "html": "<label for=\"native-select-team\">Assign a team</label>\n<select id=\"native-select-team\" name=\"team\">\n  <option value=\"\" disabled selected>Choose a team</option>\n  <optgroup label=\"Available teams\">\n    <option value=\"operations\">Operations and service delivery</option>\n    <option value=\"design\">Design</option>\n  </optgroup>\n  <optgroup label=\"Unavailable\">\n    <option value=\"finance\" disabled>Finance \u2014 assignment unavailable</option>\n  </optgroup>\n</select>"
    },
    {
      "id": "native-select-listbox",
      "title": "Native listbox retained",
      "description": "Multiple selection is deliberately outside the enhanced dropdown contract.",
      "html": "<label for=\"native-select-members\">Team members</label>\n<select id=\"native-select-members\" name=\"members\" multiple size=\"3\">\n  <option value=\"alex\">Alex</option>\n  <option value=\"sam\">Sam</option>\n  <option value=\"jamie\">Jamie</option>\n</select>"
    }
  ]
},
  {
    "slug": "timeline",
    "title": "Activity timeline",
    "intro": "One class on an ordered list presents events and audit history with native timestamps.",
    "notes": [
      "Use ol.timeline with one li per event. Ordinary headings or paragraphs describe the event; time with datetime supplies an unambiguous timestamp.",
      "Keep chronological or reverse chronological DOM order explicit. CSS does not reorder, group, fetch or announce events.",
      "Spacing, typography, palette and border thickness inherit. Markers are decorative: event meaning must remain visible in text. Logical properties support RTL."
    ],
    "examples": [
      {
        "id": "activity-timeline",
        "title": "Recent activity",
        "description": "One structural class and ordinary event text.",
        "html": "<ol class=\"timeline\">\n  <li><p><strong>Workspace refresh shared</strong></p><p>Ready for review.</p><time datetime=\"2026-10-03T09:40:00+03:00\">October 3 · 09:40</time></li>\n  <li><p><strong>Report completed</strong></p><time datetime=\"2026-10-02T16:30:00+03:00\">October 2 · 16:30</time></li>\n</ol>"
      }
    ]
  },
  {
    "slug": "charts",
    "title": "Charts",
    "intro": "The dashboard’s existing line/area and doughnut charts now share a reusable figure class and stylesheet. No additional chart types or duplicate dashboard charts.",
    "notes": [
      "Use figure.chart with a direct SVG and figcaption. Supply a viewBox, role=img and unique title/desc IDs connected with aria-labelledby. Provide exact data in visible HTML or a linked table.",
      "Direct polyline is the line, polygon is the area, circles without pathLength are points; g > line draws the grid and SVG text supplies labels. Coordinates and scales are calculated by your backend, not by CSS.",
      "Doughnut segments are circles with pathLength=100. The backend supplies stroke-dasharray and stroke-dashoffset. --re-chart-color selects each segment colour; --re-chart-ring-width controls the stroke (22 by default). SVG rotates segments around the viewBox centre.",
      "Always identify series and values in text. Forced colours and print can remove colour distinctions; descriptions and tables preserve meaning. No automatic legends, tooltips or data fetching.",
      "The full/components/scoped builds include chart presentation. Modular consumers can load reva.charts.css with tokens and base. Existing chart geometry is reused; no new chart types are introduced."
    ],
    "examples": [
      {
        "id": "existing-revenue-chart",
        "title": "Existing revenue chart",
        "description": "The same line/area chart already used by the dashboard, now without demo-only chart classes.",
        "html": "<figure class=\"chart\"><svg viewBox=\"0 0 540 210\" role=\"img\" aria-labelledby=\"revenue-svg-title revenue-svg-desc\"><title id=\"revenue-svg-title\">Monthly revenue, April to September 2026</title><desc id=\"revenue-svg-desc\">Revenue rises from 28,400 euros in April to 42,500 euros in September, with a dip in June. April 28,400; May 32,100; June 29,700; July 36,800; August 39,200; September 42,500 euros.</desc><g><line x1=\"50\" x2=\"500\" y1=\"150\" y2=\"150\"></line><text x=\"0\" y=\"154\">10k</text></g><g><line x1=\"50\" x2=\"500\" y1=\"110\" y2=\"110\"></line><text x=\"0\" y=\"114\">20k</text></g><g><line x1=\"50\" x2=\"500\" y1=\"70\" y2=\"70\"></line><text x=\"0\" y=\"74\">30k</text></g><g><line x1=\"50\" x2=\"500\" y1=\"30\" y2=\"30\"></line><text x=\"0\" y=\"34\">40k</text></g><polygon points=\"50,190 50,76.4 140,61.599999999999994 230,71.2 320,42.80000000000001 410,33.19999999999999 500,20 500,190\"></polygon><polyline points=\"50,76.4 140,61.599999999999994 230,71.2 320,42.80000000000001 410,33.19999999999999 500,20\"></polyline><circle cx=\"50\" cy=\"76.4\" r=\"4\"></circle><circle cx=\"140\" cy=\"61.599999999999994\" r=\"4\"></circle><circle cx=\"230\" cy=\"71.2\" r=\"4\"></circle><circle cx=\"320\" cy=\"42.80000000000001\" r=\"4\"></circle><circle cx=\"410\" cy=\"33.19999999999999\" r=\"4\"></circle><circle cx=\"500\" cy=\"20\" r=\"4\"></circle><text x=\"50\" y=\"208\" text-anchor=\"middle\">Apr</text><text x=\"140\" y=\"208\" text-anchor=\"middle\">May</text><text x=\"230\" y=\"208\" text-anchor=\"middle\">Jun</text><text x=\"320\" y=\"208\" text-anchor=\"middle\">Jul</text><text x=\"410\" y=\"208\" text-anchor=\"middle\">Aug</text><text x=\"500\" y=\"208\" text-anchor=\"middle\">Sep</text></svg><figcaption>Six months of recognised revenue.</figcaption></figure>"
      },
      {
        "id": "existing-channel-chart",
        "title": "Existing channel chart",
        "description": "The same doughnut chart already used by the dashboard, with all shares in its accessible description.",
        "html": "<figure class=\"chart\"><svg viewBox=\"0 0 160 160\" role=\"img\" aria-labelledby=\"channels-svg-title channels-svg-desc\"><title id=\"channels-svg-title\">Revenue share by channel</title><desc id=\"channels-svg-desc\">Direct 55 percent, partners 30 percent, referrals 15 percent.</desc><circle style=\"--re-chart-color: var(--re-primary)\" cx=\"80\" cy=\"80\" r=\"58\" pathLength=\"100\" stroke-dasharray=\"55 45\" stroke-dashoffset=\"0\"></circle><circle style=\"--re-chart-color: color-mix(in srgb,var(--re-primary) 55%,var(--re-surface))\" cx=\"80\" cy=\"80\" r=\"58\" pathLength=\"100\" stroke-dasharray=\"30 70\" stroke-dashoffset=\"-55\"></circle><circle style=\"--re-chart-color: color-mix(in srgb,var(--re-primary) 25%,var(--re-surface))\" cx=\"80\" cy=\"80\" r=\"58\" pathLength=\"100\" stroke-dasharray=\"15 85\" stroke-dashoffset=\"-85\"></circle><text x=\"80\" y=\"77\" text-anchor=\"middle\" style=\"font-size:19px\">€42.5k</text><text x=\"80\" y=\"96\" text-anchor=\"middle\" style=\"font-size:7px;letter-spacing:.6px\">TOTAL REVENUE</text></svg><figcaption>Share of September revenue</figcaption></figure>"
      }
    ]
  },
  {
    "slug": "navigation-rail",
    "title": "Navigation rail",
    "intro": "A compact native nav with visible labels and optional existing SVG icons. One structural class, no additional attributes.",
    "notes": [
      "Use nav.nav-rail with direct anchors and an accessible navigation label. Use aria-current=page only for an actual current page; ordinary fragment links are not automatically tracked by CSS.",
      "Labels stay visible. Existing SVG icons are decorative and should use aria-hidden=true. Navigation uses ordinary browser keyboard and link behaviour.",
      "The rail is vertical on wider viewports and wraps horizontally below 40rem. It does not change the app shell or sidebar. Place it as an alternative navigation layout, not a second set of required sidebar controls."
    ],
    "examples": [
      {
        "id": "compact-navigation",
        "title": "Compact navigation",
        "description": "Native anchors with visible text.",
        "html": "<nav class=\"nav-rail\" aria-label=\"Workspace\">\n  <a href=\"#rail-overview\">Overview</a>\n  <a href=\"#rail-projects\">Projects</a>\n  <a href=\"#rail-activity\">Activity</a>\n</nav>\n<section id=\"rail-overview\"><h3>Overview</h3></section>\n<section id=\"rail-projects\"><h3>Projects</h3></section>\n<section id=\"rail-activity\"><h3>Activity</h3></section>"
      }
    ]
  },
  {
    "slug": "metrics",
    "title": "Metric cards",
    "intro": "Use the existing card class and native term/value pairs for readable values, trends and comparisons. No metric-specific classes or data attributes.",
    "notes": [
      "Use .card on an article, with a direct dl containing dt for the metric label and dd > output for its value. Further dd elements contain comparison text, context or a native progress/meter.",
      "Theme, palette, shape, density, typography, border, depth, decorative edges and optional materials reuse the existing card contract. Place shared attributes on html, a parent or the card.",
      "Write the trend and comparison period in words. An increase is not always good: costs and incidents can rise. Colour and arrows are never the only explanation.",
      "The backend supplies formatted values, comparison text and native progress/meter values. CSS does not calculate statistics, animate counters, fetch data or announce updates on a timer.",
      "Use the existing grid layout to arrange multiple cards. Long values wrap, the DOM reading order stays unchanged and no chart or icon is required.",
      "Load the complete/scoped build, or tokens, base, components and reva.card-patterns.css. Materials and motion remain optional."
    ],
    "examples": [
      {
        "id": "metric-revenue",
        "title": "Value and comparison",
        "description": "One existing class; label, value and comparison stay readable in HTML.",
        "html": "<article class=\"card\">\n  <dl>\n    <dt>Total revenue</dt>\n    <dd><output>€42,500</output></dd>\n    <dd>Up 8.4% versus August</dd>\n    <dd><small>Recognised revenue in September.</small></dd>\n  </dl>\n</article>"
      },
      {
        "id": "metric-cost",
        "title": "Decrease with context",
        "description": "Explicit language separates the direction from its business meaning.",
        "html": "<article class=\"card\">\n  <dl>\n    <dt>Support incidents</dt>\n    <dd><output>12</output></dd>\n    <dd>Down 25% versus August</dd>\n    <dd><small>Fewer incidents this month.</small></dd>\n  </dl>\n</article>"
      },
      {
        "id": "metric-target",
        "title": "Value and target",
        "description": "A labelled native meter shows a bounded value; the number and target remain visible.",
        "html": "<article class=\"card\">\n  <dl>\n    <dt>Team utilisation</dt>\n    <dd><output>78%</output></dd>\n    <dd>Target range: 70–85%</dd>\n    <dd><label>Utilisation <meter min=\"0\" max=\"100\" low=\"70\" high=\"85\" optimum=\"78\" value=\"78\">78%</meter></label></dd>\n  </dl>\n</article>"
      }
    ]
  },
  {
    "slug": "drawers",
    "title": "Drawer / inspector",
    "intro": "One drawer class turns a native popover into a viewport-edge inspector. Use semantic children and inherited data attributes for details, filters or settings.",
    "notes": [
      "Use an aside.drawer with popover=auto and a unique id. Native button popovertarget opens it; popovertargetaction=hide closes it. Label the panel with aria-labelledby and give its heading a unique id.",
      "Direct header, section and footer children identify the regions. No drawer-header, drawer-body or drawer-footer classes are needed. The panel scrolls as a whole, keeping all content reachable at small heights and zoom.",
      "Default width is 28rem, bounded by the viewport, on the logical end edge. Customise with inherited CSS variables --re-drawer-width, --re-drawer-start and --re-drawer-end. No component-specific data attributes are required.",
      "Theme, palette, density, shape, depth, border and optional materials inherit from the actual DOM parent. Opening in the top layer does not move that DOM boundary. Keep drawers inside .reva for scoped builds. Existing optional motion styles apply; data-motion=none and reduced-motion preferences suppress entrance motion.",
      "This is a non-modal overlay, not a permanent split-pane layout: no focus trap, page inertness or scroll lock. Outside-click and Escape dismiss it natively. Ordinary links and form actions do not close it automatically; the browser restores focus according to native popover behavior. Native popover support is required.",
      "Load tokens, base and reva.drawers.css for modular use, or the complete/components/scoped builds. Optional glass and veil modules already style popover surfaces. Forced colours retain boundaries; print hides drawers.",
      "Application code or the server supplies details, filter results and saved settings. The component does not fetch, filter or save records."
    ],
    "examples": [
      {
        "id": "project-inspector-example",
        "title": "Project inspector",
        "description": "One structural class and inherited appearance. Open, close, click outside or press Escape.",
        "html": "<section>\n  <button type=\"button\" popovertarget=\"drawer-end\">Open project inspector</button>\n  <aside class=\"drawer\" id=\"drawer-end\" popover=\"auto\" aria-labelledby=\"drawer-end-title\">\n    <header><h2 id=\"drawer-end-title\">Project inspector</h2><button type=\"button\" popovertarget=\"drawer-end\" popovertargetaction=\"hide\" autofocus>Close</button></header>\n    <section><p>Review the project without leaving this page.</p><dl><dt>Owner</dt><dd>Alex Morgan</dd><dt>Status</dt><dd>In progress</dd></dl><label>Completion <progress value=\"72\" max=\"100\">72%</progress></label></section>\n    <footer><button type=\"button\" popovertarget=\"drawer-end\" popovertargetaction=\"hide\">Done</button></footer>\n  </aside>\n</section>"
      },
      {
        "id": "filter-drawer-example",
        "title": "Filter drawer",
        "description": "One structural class and inherited appearance. Open, close, click outside or press Escape.",
        "html": "<section style=\"--re-drawer-start: 0; --re-drawer-end: auto; --re-drawer-direction: -1; --re-drawer-width: 20rem\">\n  <button type=\"button\" popovertarget=\"drawer-start\">Open filter drawer</button>\n  <aside class=\"drawer\" id=\"drawer-start\" popover=\"auto\" aria-labelledby=\"drawer-start-title\">\n    <header><h2 id=\"drawer-start-title\">Filter drawer</h2><button type=\"button\" popovertarget=\"drawer-start\" popovertargetaction=\"hide\" autofocus>Close</button></header>\n    <section><fieldset><legend>Project status</legend><label><input type=\"checkbox\" checked> In progress</label><label><input type=\"checkbox\"> Complete</label></fieldset><p>A backend supplies and applies the filter values.</p></section>\n    <footer><button type=\"button\" popovertarget=\"drawer-start\" popovertargetaction=\"hide\">Done</button></footer>\n  </aside>\n</section>"
      }
    ]
  },
  {
    "slug": "app-shell",
    "title": "Sidebar and app shell",
    "intro": "One app-shell class arranges a native aside, header and main. Sidebar links, expandable groups and profile regions use semantic HTML, with inherited theme styling and zero browser JavaScript.",
    "notes": [
      "Use .app-shell on one wrapper. Direct aside, header and main children identify the regions. No shell-header, sidebar-item or sidebar-link classes are required. A direct section can replace main when the shell is embedded inside a document that already has a main landmark.",
      "At 60rem and wider the desktop aside occupies the left column, with a sticky, independently scrollable sidebar. Below 60rem the header and content form one column; a separate aside[popover=auto] provides a viewport-bounded drawer. The layout uses viewport media queries, including when embedded in a demo.",
      "The desktop sidebar and mobile drawer share navigation content through your template. Keep destinations consistent and use unique IDs for every drawer and any repeated form controls. The shell itself needs only one class; a standalone aside.sidebar needs one class when used without the shell.",
      "Only the direct sidebar nav is styled. Native details/summary handles expandable groups at any depth, aria-current=page marks the current destination, and ordinary anchors navigate. Label navigation landmarks; retain native Tab, Enter, Space and Escape behaviour.",
      "Use a direct header button with popovertarget matching the drawer id, and a drawer close button with popovertargetaction=hide. Direct header popover buttons are reserved for the mobile drawer; put other header popover controls inside a group. Native popover support is required.",
      "The drawer is non-modal: it does not trap focus, make the page inert or lock body scrolling. Outside-click and Escape dismiss it natively. In-page links do not automatically close it. Closing and focus restoration follow native browser behaviour. Resizing to desktop hides an open drawer; returning to mobile can restore its open state.",
      "Palette, material, shape, density, depth, border, size and motion inherit from html or a parent. No data-sidebar preset is needed in this first version. data-navbar still configures only top menus. Glass and Veil modules include sidebar and shell-header surfaces with their existing accessibility fallbacks.",
      "Load tokens, base and reva.app-shell.css for modular use, or use the complete/components/scoped builds. --re-sidebar-width defaults to 16rem; mobile width remains viewport-bounded. More contrast and forced colours retain boundaries; reduced motion disables chevron transitions. Print omits navigation and keeps content."
    ],
    "examples": [
      {
        "id": "responsive-shell",
        "title": "One-class responsive app shell",
        "description": "Resize this isolated preview: desktop sidebar becomes a Menu button and native drawer below 60rem. Expand Settings, then Team.",
        "html": "<div class=\"app-shell\">\n  <aside aria-label=\"Desktop workspace navigation\">\n<header><a href=\"#overview\">Studio</a><small>Team workspace</small></header>\n<nav aria-label=\"Workspace navigation\">\n  <a href=\"#overview\" aria-current=\"page\">Overview</a>\n  <a href=\"#projects\">Projects</a>\n  <details>\n    <summary>Settings</summary>\n    <a href=\"#general\">General</a>\n    <details><summary>Team</summary><a href=\"#members\">Members</a></details>\n  </details>\n</nav>\n<footer><strong>Alex Morgan</strong><br><small>Workspace admin</small></footer>\n  </aside>\n  <aside id=\"workspace-drawer\" popover=\"auto\" aria-label=\"Mobile workspace navigation\">\n    <button type=\"button\" popovertarget=\"workspace-drawer\" popovertargetaction=\"hide\">Close sidebar</button>\n<header><a href=\"#overview\">Studio</a><small>Team workspace</small></header>\n<nav aria-label=\"Workspace navigation\">\n  <a href=\"#overview\" aria-current=\"page\">Overview</a>\n  <a href=\"#projects\">Projects</a>\n  <details>\n    <summary>Settings</summary>\n    <a href=\"#general\">General</a>\n    <details><summary>Team</summary><a href=\"#members\">Members</a></details>\n  </details>\n</nav>\n<footer><strong>Alex Morgan</strong><br><small>Workspace admin</small></footer>\n  </aside>\n  <header>\n    <button type=\"button\" popovertarget=\"workspace-drawer\" aria-label=\"Open sidebar\"><svg class=\"icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M4 6h16M4 12h16M4 18h16\"/></svg></button>\n    <strong>Workspace overview</strong>\n  </header>\n  <main id=\"overview\">\n    <h1>Overview</h1>\n    <p>Your application content goes here.</p>\n    <section id=\"projects\"><h2>Projects</h2><p>Reusable layout, native navigation, shared theme.</p></section>\n    <section id=\"general\"><h2>General settings</h2><p>A real application supplies settings forms.</p></section>\n    <section id=\"members\"><h2>Team members</h2><p>A real application supplies member records.</p></section>\n  </main>\n</div>",
        "isolated": true,
        "isolatedHeight": 480
      },
      {
        "id": "standalone-sidebar",
        "title": "Sidebar outside an app shell",
        "description": "One sidebar class establishes the same native navigation styling without the surrounding application layout.",
        "html": "<aside class=\"sidebar\" aria-label=\"Workspace sidebar\">\n<header><a href=\"#overview\">Studio</a><small>Team workspace</small></header>\n<nav aria-label=\"Workspace navigation\">\n  <a href=\"#overview\" aria-current=\"page\">Overview</a>\n  <a href=\"#projects\">Projects</a>\n  <details>\n    <summary>Settings</summary>\n    <a href=\"#general\">General</a>\n    <details><summary>Team</summary><a href=\"#members\">Members</a></details>\n  </details>\n</nav>\n<footer><strong>Alex Morgan</strong><br><small>Workspace admin</small></footer>\n</aside>"
      }
    ]
  },
  {
    "slug": "dropdowns",
    "title": "Dropdowns",
    "intro": "One dropdown class turns a native popover list into a standalone set of links or actions. Use it beside a button, outside the top navigation, with inherited theme styling and no JavaScript.",
    "notes": [
      "Use a native button with type=\"button\" and popovertarget matching the list’s unique document-wide id. Keep popover=\"auto\" for outside-click and Escape dismissal; another unrelated auto popover closes the current one.",
      "Keep ordinary list, link and button semantics. role=\"list\" preserves list semantics when markers are removed. Do not add role=\"menu\", role=\"menuitem\", aria-haspopup=\"menu\" or fixed aria-expanded: this pattern uses ordinary Tab navigation, not application-menu arrow keys.",
      "The opener’s native association anchors the panel where CSS anchor positioning is supported. No wrapper or anchor-name is required. Panels can flip at viewport edges; otherwise they use a viewport-bounded centred fallback. Native popover support is required.",
      "Panels inherit theme, shape, density, border and depth through their DOM parent, even in the top layer. Keep the panel inside the configured parent or .reva boundary. Shared size affects rows once; rows remain neutral rather than adopting filled button variants or animated edges.",
      "Tab and Shift+Tab move through ordinary controls. Enter/Space activate buttons; Escape dismisses. Default opening and focus restoration follow native browser behaviour. An optional autofocus close button explicitly places focus inside on opening. Do not use this pattern as a modal dialog.",
      "Destination links navigate normally. In-page links and arbitrary action buttons do not automatically dismiss the panel; an explicit popovertargetaction=\"hide\" button can close it. Applications supply business actions; CSS adds no event handlers.",
      "The complete, scoped and components builds include the dropdown. Modular use: tokens, base and reva.dropdowns.css; glass requires the matching optional extension. --re-dropdown-width defaults to 18rem and remains viewport-bounded. Open dropdowns are omitted from print."
    ],
    "glass": true,
    "examples": [
      {
        "id": "dropdown-links",
        "title": "A standalone link dropdown",
        "description": "One class on the list, one unique id, and native button targeting. Use the documentation links as real destinations.",
        "html": "<button type=\"button\" popovertarget=\"resource-dropdown\">Resources</button>\n<ul class=\"dropdown\" id=\"resource-dropdown\" popover=\"auto\"\n    role=\"list\" aria-label=\"Resources\">\n  <li><a href=\"__BASE__guide/\">Get started</a></li>\n  <li><a href=\"__BASE__reference/\">API reference</a></li>\n  <li><a href=\"__BASE__icons/\">SVG icons</a></li>\n</ul>"
      },
      {
        "id": "dropdown-actions",
        "title": "Explicit close and unavailable actions",
        "description": "The close button is functional and receives focus on opening. The disabled action remains unavailable through native HTML.",
        "html": "<button type=\"button\" popovertarget=\"project-dropdown\">Project options</button>\n<ul class=\"dropdown\" id=\"project-dropdown\" popover=\"auto\"\n    role=\"list\" aria-label=\"Project options\">\n  <li><button type=\"button\" popovertarget=\"project-dropdown\"\n              popovertargetaction=\"hide\" autofocus>Close options</button></li>\n  <li><a href=\"__BASE__components/card-patterns/\">View card patterns</a></li>\n  <li><button type=\"button\" disabled>Archive project — unavailable</button></li>\n</ul>"
      },
      {
        "id": "dropdown-themes",
        "title": "Light and dark parent defaults",
        "description": "Theme, shape and size live on the containing section; neither dropdown needs repeated styling attributes.",
        "html": "<section data-theme=\"light\" data-shape=\"rounded\" data-size=\"small\">\n  <button type=\"button\" popovertarget=\"light-dropdown\">Light resources</button>\n  <ul class=\"dropdown\" id=\"light-dropdown\" popover=\"auto\"\n      role=\"list\" aria-label=\"Light resources\">\n    <li><a href=\"__BASE__themes/light/\">Light theme guide</a></li>\n    <li><a href=\"__BASE__guide/styling/\">Shared styling</a></li>\n  </ul>\n</section>\n<section data-theme=\"dark\" data-shape=\"subtle\" data-size=\"large\">\n  <button type=\"button\" popovertarget=\"dark-dropdown\">Dark resources</button>\n  <ul class=\"dropdown\" id=\"dark-dropdown\" popover=\"auto\"\n      role=\"list\" aria-label=\"Dark resources\">\n    <li><a href=\"__BASE__themes/dark/\">Dark theme guide</a></li>\n    <li><a href=\"__BASE__reference/tokens/\">CSS tokens</a></li>\n  </ul>\n</section>"
      },
      {
        "id": "dropdown-glass",
        "title": "Glass and a local solid boundary",
        "description": "The optional glass extension follows the parent material. A solid section resets the second panel without repeating settings on its rows.",
        "glass": true,
        "html": "<section data-material=\"glass\" data-shape=\"rounded\" data-accent=\"teal\">\n  <button type=\"button\" popovertarget=\"glass-dropdown\">Glass resources</button>\n  <ul class=\"dropdown\" id=\"glass-dropdown\" popover=\"auto\"\n      role=\"list\" aria-label=\"Glass resources\">\n    <li><button type=\"button\" popovertarget=\"glass-dropdown\"\n                popovertargetaction=\"hide\" autofocus>Close resources</button></li>\n    <li><a href=\"__BASE__themes/glass/\">Glass material guide</a></li>\n    <li><a href=\"__BASE__reference/\">API reference</a></li>\n  </ul>\n  <section data-material=\"solid\">\n    <button type=\"button\" popovertarget=\"solid-dropdown\">Solid resources</button>\n    <ul class=\"dropdown\" id=\"solid-dropdown\" popover=\"auto\"\n        role=\"list\" aria-label=\"Solid resources\">\n      <li><a href=\"__BASE__guide/\">Get started</a></li>\n      <li><a href=\"__BASE__guide/accessibility/\">Behaviour and accessibility</a></li>\n    </ul>\n  </section>\n</section>"
      }
    ]
  },
  {
    "slug": "switches",
    "title": "Switches",
    "intro": "A switch class styles a native checkbox as an on/off control. Checked state, keyboard activation, form submission and disabled behavior remain native.",
    "notes": [
      "Use switches for boolean settings. Keep a stable visible label; Space toggles the focused checkbox. Optional role=\"switch\" communicates on/off semantics while checked remains the native input state.",
      "Place the checkbox inside its label for a comfortable label target. Add aria-describedby for explanatory text. Do not maintain aria-checked manually on a native checkbox.",
      "Size, shape, accent, borders and motion follow the parent. Switches keep opaque control backing, including inside a glass section. Reduced-motion preferences stop thumb transitions."
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
      },
      {
        "id": "switch-sized-group",
        "title": "A sized labelled switch",
        "description": "The group label and switch consume the size setting once. A local switch size remains an independent override.",
        "html": "<section data-size=\"large\">\n  <div class=\"form-group\">\n    <label><input class=\"switch\" type=\"checkbox\" role=\"switch\" checked> Email notifications</label>\n  </div>\n  <div class=\"form-group\">\n    <label><input class=\"switch\" type=\"checkbox\" role=\"switch\" data-size=\"small\"> A smaller local switch</label>\n  </div>\n</section>"
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
      "Use type=\"submit\" only for actions backed by an actual form. Application routes and processing remain your responsibility. Static action demos use type=\"button\"."
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
      },
      {
        "id": "input-group-native-action",
        "title": "A native action input",
        "description": "Action inputs use the same grouping role as buttons. The editable field takes the available width; the action wraps when needed.",
        "html": "<div class=\"form-group\">\n  <label for=\"native-group-query\">Search documents</label>\n  <div class=\"input-group\">\n    <input id=\"native-group-query\" type=\"search\" name=\"query\">\n    <input type=\"button\" value=\"Search\">\n  </div>\n</div>"
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
      "Gap and density inherit. The wrapper paints no extra surface; combine it with card when a surface is useful."
    ],
    "examples": [
      {
        "id": "toolbar-container",
        "title": "Actions in a narrow workspace",
        "description": "Below 24rem of wrapper width, toolbar children fill the line and nested input groups stack. These links retain ordinary navigation behaviour.",
        "html": "<div style=\"max-inline-size: 22rem;\">\n  <div class=\"responsive\">\n    <div class=\"toolbar\" role=\"group\" aria-label=\"Workspace links\">\n      <a class=\"button\" href=\"__BASE__guide/\">Getting started</a>\n      <a class=\"button outline\" href=\"__BASE__reference/\">API reference</a>\n    </div>\n  </div>\n</div>"
      },
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
      "Colours, density and borders inherit. Basic dl without this class retains normal document formatting."
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
      "Theme, shape, depth, density and optional glass material belong to the existing card. The new module adds structure without replacing its surface styling."
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
      "Size and motion follow shared parent settings. data-motion=\"none\" and reduced-motion preferences stop the custom spinner. The visible message remains available."
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
      },
      {
        "id": "loading-in-action",
        "title": "Loading inside a sized action",
        "description": "The action supplies size once; its spinner follows the resolved text size without multiplying that setting again. Applications control disabled and loading state.",
        "html": "<section class=\"row\" data-size=\"large\">\n  <button type=\"button\" disabled>\n    <span class=\"spinner\" aria-hidden=\"true\"></span>\n    Preparing report…\n  </button>\n</section>"
      }
    ]
  },
  {
    "slug": "tabs",
    "title": "Tabs",
    "intro": "A tab-style header selects its associated content panel using native radios underneath. Visible radio circles are removed; the selected tab has an accent underline and surface backing. No JavaScript is added.",
    "notes": [
      "The visual presentation is a tab bar, while the underlying interaction retains radio semantics. Do not add tablist/tab roles or manually maintained aria-selected attributes. Applications requiring the ARIA tabs interaction contract need a separate behaviour layer.",
      "Give the fieldset a legend and every radio a label. Use one unique radio name per instance and mark exactly one radio checked. Tab enters the radio group; arrow keys select its native choices.",
      "Keep each tab-panel immediately after its label. Panels may contain ordinary headings, links and controls. CSS :has selects the checked radio's following panel. Without :has support, all panels remain readable; print also shows all panels.",
      "Theme, shape, size, density, gap, borders and fieldset material follow the parent. Radio controls are visually hidden, not removed from the focus order. Focus appears on the tab label, and native disabled choices remain unavailable. Included in complete, scoped and components builds; modular use: tokens, base and reva.tabs.css.",
      "A shared underline glides between selected tabs in browsers supporting CSS anchor positioning and anchor-scope. Other browsers retain a static selected border. No extra class is needed. Parent data-motion controls duration; reduced motion removes the transition. The effect reserves ::after on .tabs."
    ],
    "examples": [
      {
        "id": "tabs-basic",
        "title": "A tab bar with two panels",
        "description": "Click a tab label or use native radio-group arrow keys. The selected tab is underlined; radio circles are visually hidden.",
        "html": "<fieldset class=\"tabs\">\n  <legend>Account information</legend>\n  <label>\n    <input type=\"radio\" name=\"account-panels\" checked> Overview\n  </label>\n  <section class=\"tab-panel\">\n    <h3>Account overview</h3>\n    <p>Your account is active.</p>\n  </section>\n  <label>\n    <input type=\"radio\" name=\"account-panels\"> Preferences\n  </label>\n  <section class=\"tab-panel\">\n    <h3>Your preferences</h3>\n    <p>Choose preferences in your application settings.</p>\n    <a href=\"__BASE__components/form-groups/\">Explore form groups</a>\n  </section>\n</fieldset>"
      },
      {
        "id": "tabs-independent",
        "title": "An independent instance",
        "description": "A different name keeps this selection independent of the first example.",
        "html": "<fieldset class=\"tabs\" data-shape=\"pill\" data-gap=\"small\">\n  <legend>Documentation view</legend>\n  <label><input type=\"radio\" name=\"documentation-panels\" checked> HTML</label>\n  <section class=\"tab-panel\">\n    <p>Start with native elements and shared parent settings.</p>\n  </section>\n  <label><input type=\"radio\" name=\"documentation-panels\"> Styling</label>\n  <section class=\"tab-panel\">\n    <p>Add a component class only when the pattern needs one.</p>\n  </section>\n</fieldset>"
      },
      {
        "id": "tabs-disabled",
        "title": "An unavailable tab",
        "description": "Native disabled prevents selection and keyboard focus. Keep an available choice checked; a disabled label explains its unavailable state.",
        "html": "<fieldset class=\"tabs\">\n  <legend>Project views</legend>\n  <label><input type=\"radio\" name=\"project-view-panels\" checked> Overview</label>\n  <section class=\"tab-panel\"><h3>Project overview</h3><p>Your active project details.</p></section>\n  <label><input type=\"radio\" name=\"project-view-panels\" disabled> Reports — unavailable</label>\n  <section class=\"tab-panel\"><h3>Reports</h3><p>This view is currently unavailable.</p></section>\n</fieldset>"
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
      "aria-current marks the actual current destination. Status badges remain passive content inside a list item."
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
      "Spacing follows density, text follows the theme, and native actions keep their inherited styling. Combine with card when a surface is useful; card can receive optional glass material."
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
      },
      {
        "id": "empty-chart",
        "title": "No chart data",
        "description": "Reuse the existing empty-state instead of drawing a misleading empty or zero chart.",
        "html": "<section class=\"empty-state\" aria-labelledby=\"empty-chart-title\"><h3 id=\"empty-chart-title\">No revenue data yet</h3><p>The chart will appear after a reporting period is available.</p></section>"
      },
      {
        "id": "unavailable-metric",
        "title": "Unavailable metric",
        "description": "Missing values are distinct from a measured zero.",
        "html": "<article class=\"card\"><dl><dt>Forecast revenue</dt><dd><output>Unavailable</output></dd><dd><small>No forecast has been supplied.</small></dd></dl></article>"
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
      "Constrained avatars keep a square aspect ratio as their available width decreases. Shape changes the boundary, not the aspect ratio."
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
    "intro": "Native details and summary elements provide the interaction. One accordion wrapper arranges the group; theme, shape, density, spacing, borders, depth, material and motion inherit from the parent.",
    "notes": [
      "Keep summary as the first child of details. A rotating CSS chevron replaces the visual marker; native keyboard behavior remains intact; do not add button roles or manually maintained aria-expanded attributes.",
      "Omit name to allow multiple items to stay open. Give details a shared, unique name for native exclusive groups. Browsers without exclusive-group support still provide independent disclosure toggles. Names are document-wide, so separate accordion instances need different names.",
      "Use open on at most one item in an exclusive group. CSS does not add custom arrow-key navigation or force collapsed content to print.",
      "Motion is included in the core and accordion module: none opens instantly, subtle expands and rotates the chevron over 140ms, and expressive adds a content fade over 240ms. Height transitions require ::details-content, interpolate-size and discrete transitions; other browsers use instant native disclosure. Reduced-motion preferences disable transitions."
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
        "id": "accordion-motion",
        "title": "Inherited motion intensity",
        "description": "Choose motion once on a parent. Open and close each section to compare instant, subtle and expressive behaviour. Reduced motion wins; browsers without intrinsic-size transitions retain native disclosure.",
        "html": "<section data-motion=\"none\">\n  <h3>None</h3>\n  <div class=\"accordion\">\n    <details>\n      <summary>How does none motion work?</summary>\n      <p>The content and indicator change immediately.</p>\n      <p>The browser owns the open state and keyboard behaviour.</p>\n    </details>\n  </div>\n</section>\n<section data-motion=\"subtle\">\n  <h3>Subtle</h3>\n  <div class=\"accordion\">\n    <details>\n      <summary>How does subtle motion work?</summary>\n      <p>Content expands smoothly and the indicator rotates.</p>\n      <p>The browser owns the open state and keyboard behaviour.</p>\n    </details>\n  </div>\n</section>\n<section data-motion=\"expressive\">\n  <h3>Expressive</h3>\n  <div class=\"accordion\">\n    <details>\n      <summary>How does expressive motion work?</summary>\n      <p>Content expands with a gentle fade and a rotating indicator.</p>\n      <p>The browser owns the open state and keyboard behaviour.</p>\n    </details>\n  </div>\n</section>"
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
      "Use actual destination URLs in your application. The documentation examples link to real documentation pages. Theme, typography, size and density inherit; breadcrumbs have no surface requiring glass."
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
      "A decorative underline follows eligible links on hover or keyboard focus, then returns to the current page. The current page keeps its own styling throughout. CSS anchor positioning and anchor-scope enable this default enhancement; unsupported browsers retain ordinary pagination. Shared data-motion controls duration, and reduced motion removes transitions. The effect reserves ::after on the direct ol."
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
      "Use existing grid and stack classes for arrangement. This component adds no grid system. Optional glass affects existing fieldsets, while text controls retain their normal readable backing."
    ],
    "examples": [
      {
        "id": "form-complete-error",
        "title": "An explicitly supplied validation error",
        "description": "The application supplies aria-invalid and the visible error. CSS keeps the error border and focus outline consistent. Associate both the hint and error with the field.",
        "html": "<div class=\"form-group\">\n  <label for=\"complete-error-email\">Email <small>(required)</small></label>\n  <input id=\"complete-error-email\" name=\"email\" type=\"email\" required value=\"invalid-address\" aria-invalid=\"true\" aria-describedby=\"complete-email-hint complete-email-error\">\n  <small id=\"complete-email-hint\">Use the address where you want to receive updates.</small>\n  <p class=\"field-error\" id=\"complete-email-error\">Enter a complete email address, such as name@example.com.</p>\n</div>"
      },
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
    "intro": "Native HTML text elements receive their styling automatically. This page covers all six heading levels, body text, inline semantics, lists, quotations and technical notation, with the HTML beneath every example.",
    "examples": [
      {
        "id": "headings",
        "title": "All six heading levels",
        "description": "h1 through h6 retain their native semantics and default styling. This isolated document has its own page heading; use levels according to the structure of your real content.",
        "isolated": true,
        "isolatedHeight": 760,
        "html": "<main class=\"container\" style=\"padding: 1rem;\">\n  <h1>Heading 1 — Page title</h1>\n  <h2>Heading 2 — Main section</h2>\n  <h3>Heading 3 — Subsection</h3>\n  <h4>Heading 4 — Detailed section</h4>\n  <h5>Heading 5 — Supporting detail</h5>\n  <h6>Heading 6 — Further detail</h6>\n  <p>Heading levels express hierarchy, not a choice of font size.</p>\n</main>"
      },
      {
        "id": "paragraphs",
        "title": "Paragraphs and readable text",
        "description": "Paragraphs use the inherited font, colour and line height. The optional prose wrapper provides a readable maximum width.",
        "html": "<div class=\"prose\">\n  <p>RevaCSS starts with ordinary HTML. Use paragraphs to organise related sentences into clear blocks of content.</p>\n  <p>A new paragraph gives the next idea room to breathe. Shared typography settings apply without repeated classes.</p>\n  <p><small>Supporting information: available features may vary by browser.</small></p>\n</div>"
      },
      {
        "id": "inline",
        "title": "Importance, emphasis and visual annotation",
        "description": "strong expresses importance and em expresses stress. b draws attention, i distinguishes an alternate voice or term, u annotates, and s marks information that is no longer accurate.",
        "html": "<p><strong>Important:</strong> save your changes before leaving.</p>\n<p>This setting is <em>especially</em> useful for shared themes.</p>\n<p>The keyword is <b>inheritance</b>.</p>\n<p>The term <i lang=\"la\">in situ</i> means in its original place.</p>\n<p>Spelling annotation: <u>recieve</u> should be receive.</p>\n<p><s>Registration closes on Friday.</s> Registration now closes on Monday.</p>\n<p><mark>Highlighted for review:</mark> confirm the delivery date.</p>"
      },
      {
        "id": "links",
        "title": "Links and supporting text",
        "description": "Use real destinations and meaningful link labels. Small print remains readable and is not a substitute for essential instructions.",
        "html": "<p>Start with the <a href=\"__BASE__guide/\">RevaCSS installation guide</a>.</p>\n<p>For a local section, see <a href=\"#headings\">all six heading levels</a>.</p>\n<p><small>Terms apply to the current preview release.</small></p>"
      },
      {
        "id": "edits",
        "title": "Inserted and deleted content",
        "description": "Use ins and del to identify document edits. Their semantics differ from simply drawing a line through outdated text with s.",
        "html": "<p>The meeting starts at <del datetime=\"2026-10-01\">09:00</del> <ins datetime=\"2026-10-02\">10:00</ins>.</p>"
      },
      {
        "id": "definitions",
        "title": "Abbreviations and definitions",
        "description": "Expand abbreviations visibly on first use. The title attribute provides additional information but should not be the only explanation.",
        "html": "<p>Cascading Style Sheets (<abbr title=\"Cascading Style Sheets\">CSS</abbr>) controls presentation.</p>\n<p><dfn>Inheritance</dfn> is the process by which supported styling values pass from a parent to its descendants.</p>"
      },
      {
        "id": "lists",
        "title": "Unordered, ordered and nested lists",
        "description": "Use ul when order is not meaningful and ol for sequences. Nest another list inside its parent li; native numbering options need no helper classes.",
        "html": "<ul>\n  <li>Light theme</li>\n  <li>Dark theme\n    <ul>\n      <li>Solid surfaces</li>\n      <li>Glass surfaces</li>\n    </ul>\n  </li>\n</ul>\n<ol>\n  <li>Load the stylesheet</li>\n  <li>Set shared defaults</li>\n  <li>Add semantic HTML</li>\n</ol>\n<ol start=\"4\">\n  <li>Override local exceptions</li>\n  <li>Review the result</li>\n</ol>"
      },
      {
        "id": "description-lists",
        "title": "Terms and descriptions",
        "description": "Native dl, dt and dd express term/value associations. The separate description-list component is available when you need a responsive record layout.",
        "html": "<dl>\n  <dt>Theme</dt>\n  <dd>The light, dark or system colour mode.</dd>\n  <dt>Material</dt>\n  <dd>The solid or glass surface treatment.</dd>\n  <dt>Accent</dt>\n  <dd>The shared highlight colour.</dd>\n</dl>"
      },
      {
        "id": "quote",
        "title": "Block quotations, inline quotes and citations",
        "description": "blockquote contains a quotation, q marks an inline quotation, and cite names a work rather than a person's name. The text below is demonstration copy.",
        "html": "<figure>\n  <blockquote>\n    <p>Good defaults leave room for your own decisions.</p>\n  </blockquote>\n  <figcaption>From <cite>A demonstration of semantic typography</cite>.</figcaption>\n</figure>\n<p>The example describes its approach as <q>native by design</q>.</p>"
      },
      {
        "id": "code",
        "title": "Code, keyboard input, output and variables",
        "description": "code identifies code, kbd keyboard input, samp program output and var a variable. Escape angle brackets when showing HTML as text.",
        "html": "<p>Set <code>data-theme=\"dark\"</code> on your page.</p>\n<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.</p>\n<p>The command reports <samp>Build complete.</samp></p>\n<p>The rectangle area is <var>w</var> × <var>h</var>.</p>\n<pre tabindex=\"0\" aria-label=\"Example HTML\"><code>&lt;button type=\"button\"&gt;Save&lt;/button&gt;\n&lt;p&gt;Your content stays in HTML.&lt;/p&gt;</code></pre>"
      },
      {
        "id": "notation",
        "title": "Subscripts and superscripts",
        "description": "sub and sup support conventional notation. Provide an understandable text explanation when a formula needs more context.",
        "html": "<p>Water has the chemical formula H<sub>2</sub>O.</p>\n<p>A square metre is written m<sup>2</sup>.</p>\n<p>The expression x<sup>2</sup> means x squared.</p>"
      },
      {
        "id": "time-data",
        "title": "Dates and machine-readable values",
        "description": "time supplies a machine-readable date or time; data associates visible text with an application value. CSS does not format dates or calculate values.",
        "html": "<p>Published <time datetime=\"2026-10-02\">2 October 2026</time>.</p>\n<p>The call begins at <time datetime=\"15:30\">15:30</time>.</p>\n<p>Product: <data value=\"RV-001\">RevaCSS starter</data>.</p>"
      },
      {
        "id": "address",
        "title": "Contact information",
        "description": "address contains contact information for the relevant page or article. RevaCSS removes the default italic styling; use ordinary HTML links where appropriate.",
        "html": "<address>\n  RevaCSS project<br>\n  <a href=\"https://github.com/eristavi/RevaCSS\">Project repository and issue tracker</a>\n</address>"
      },
      {
        "id": "breaks",
        "title": "Thematic breaks and controlled line breaks",
        "description": "hr marks a thematic change, br creates a meaningful line break and wbr marks an optional wrapping opportunity. Use paragraphs and CSS spacing rather than repeated br elements.",
        "html": "<p>The first topic ends here.</p>\n<hr>\n<p>A new topic begins here.</p>\n<p>A two-line label:<br>Native HTML and CSS</p>\n<p>An optional break: verylong<wbr>projectname<wbr>example</p>"
      },
      {
        "id": "international",
        "title": "Language, direction and ruby annotations",
        "description": "Set language and direction where needed. bdi isolates text with an unknown direction; bdo deliberately overrides direction. Ruby annotations retain native browser presentation.",
        "html": "<p lang=\"fr\">Une interface claire et lisible.</p>\n<p>Contributor: <bdi dir=\"auto\" lang=\"he\">עדי</bdi>.</p>\n<p>Direction override demonstration: <bdo dir=\"rtl\">ABC</bdo>.</p>\n<p lang=\"ja\"><ruby>東京<rp>（</rp><rt>とうきょう</rt><rp>）</rp></ruby></p>"
      },
      {
        "id": "shared-type",
        "title": "Inherited text scale and a local exception",
        "description": "data-type selects body typography scale. Configure a parent and override only exceptions; headings and paragraphs require no extra styling classes.",
        "html": "<section data-type=\"large\">\n  <h3>A larger shared text scale</h3>\n  <p>Headings and body text use the parent typography scale.</p>\n  <section data-type=\"compact\">\n    <h4>A compact local section</h4>\n    <p>Only this branch changes its text scale.</p>\n  </section>\n</section>"
      }
    ],
    "notes": [
      "Choose an element for its meaning, rather than its visual size. Use a logical heading hierarchy and a clear page heading; no typography classes are required.",
      "The heading specimen uses a separate document so its h1–h6 examples do not interrupt the documentation page's own outline. Its palette follows the browser colour preference.",
      "Theme, font and data-type defaults inherit from the parent. data-size configures controls, not body text. The optional prose class limits reading width; it is not required for text styling.",
      "Some elements use RevaCSS styling and others preserve browser-native presentation. Semantic markup does not automatically add application behaviour or accessible explanations; expand abbreviations in text when needed."
    ]
  },
  {
    "slug": "buttons",
    "title": "Buttons",
    "intro": "Native actions use the inherited primary accent by default. Set data-variant on a parent for shared semantic colours, or on an action for a local exception. Keep buttons for actions and anchors for navigation.",
    "examples": [
      {
        "id": "variants",
        "title": "Button variants",
        "description": "Use the shared semantic vocabulary. No identifying class is needed on native buttons.",
        "html": "<div class=\"row\">\n  <button type=\"button\">Primary</button>\n  <button type=\"button\" data-variant=\"success\">Confirm</button>\n  <button type=\"button\" data-variant=\"warning\">Review warning</button>\n  <button type=\"button\" data-variant=\"danger\">Delete</button>\n  <button type=\"button\" data-variant=\"neutral\">Neutral</button>\n</div>"
      },
      {
        "id": "button-parent-variant",
        "title": "Parent defaults and local exceptions",
        "description": "The button and badge share the parent's meaning. The delete action overrides only its variant.",
        "html": "<section class=\"stack\" data-variant=\"success\" data-shape=\"rounded\">\n  <div class=\"row\">\n    <button type=\"button\">Approve</button>\n    <span class=\"badge\">Approved</span>\n    <button type=\"button\" data-variant=\"danger\">Delete</button>\n  </div>\n  <div class=\"alert\">Success: Your changes have been saved.</div>\n</section>"
      },
      {
        "id": "button-presentation",
        "title": "Semantic colour with outline or ghost",
        "description": "Presentation classes remain optional. data-appearance is not a button setting.",
        "html": "<div class=\"row\" data-variant=\"success\">\n  <button type=\"button\">Confirm</button>\n  <button type=\"button\" class=\"outline\">Outline confirm</button>\n  <button type=\"button\" class=\"ghost\">Quiet confirm</button>\n  <button type=\"button\" class=\"outline\" data-variant=\"danger\">Outline delete</button>\n</div>"
      },
      {
        "id": "button-compatibility",
        "title": "Existing classes and precedence",
        "description": "Local semantic classes override the parent. An explicit action attribute wins when both APIs are present.",
        "html": "<div class=\"row\" data-variant=\"success\">\n  <button type=\"button\">Inherited success</button>\n  <button type=\"button\" class=\"danger\">Existing danger class</button>\n  <button type=\"button\" class=\"secondary\">Existing secondary class</button>\n  <button type=\"button\" class=\"danger\" data-variant=\"primary\">Explicit primary override</button>\n</div>"
      },
      {
        "id": "button-action-elements",
        "title": "Links and native action inputs",
        "description": "Only native action input types receive the semantic button treatment. Destination links keep their .button hook.",
        "html": "<section class=\"row\" data-variant=\"success\">\n  <a class=\"button\" href=\"__BASE__guide/\">Read the guide</a>\n  <input type=\"button\" value=\"Confirm\">\n  <button type=\"button\" disabled>Unavailable</button>\n</section>"
      },
      {
        "id": "button-glass-variant",
        "title": "Glass and semantic edge colours",
        "description": "The parent supplies the variant and material. A local primary value resets the semantic colour while retaining glass.",
        "glass": true,
        "html": "<section class=\"row\" data-material=\"glass\" data-theme=\"dark\"\n         data-variant=\"success\" data-shape=\"pill\">\n  <button type=\"button\" data-edge=\"gradient\">Confirm</button>\n  <button type=\"button\" data-variant=\"primary\">Continue</button>\n  <button type=\"button\" data-variant=\"danger\" data-material=\"solid\">Solid delete</button>\n</section>"
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
      },
      {
        "id": "button-materials",
        "title": "A separate material for actions",
        "description": "The card follows the general material. Actions use liquid; the local default button returns to the card\u2019s material. Load reva.button-materials.css after the core.",
        "html": "<section data-material=\"soft\" data-button-material=\"liquid\">\n  <article class=\"card\"><h3>Shared defaults</h3><p>Soft surfaces with liquid actions.</p><div class=\"row\"><button type=\"button\">Save project</button><button type=\"button\" data-button-material=\"default\">Follow surface</button><a class=\"button outline\" href=\"__BASE__themes/button-materials/\">Button material guide</a></div></article>\n</section>"
      }
    ],
    "glass": true,
    "notes": [
      "data-variant accepts primary, success, warning, danger and neutral. It applies to native buttons, button/submit/reset inputs and .button links. Other form controls do not acquire action colours, and navigation toggles keep their neutral menu styling.",
      "Existing secondary, danger and warning classes remain supported as local choices over inherited variants. A valid data-variant placed directly on an action takes precedence over those classes. An unsupported value leaves the nearest valid inherited variant in effect, with a local legacy class still taking priority.",
      "Outline and ghost are presentation classes that can combine with data-variant. data-appearance still applies only to badges and alerts. Secondary remains a class; it is not an accepted data-variant value.",
      "Shared theme, material, accent, shape, size, border, fill, depth and motion continue to apply. Glass and decorative edges consume the action's resolved semantic colours. Native disabled prevents activation; an anchor cannot be disabled with the disabled attribute.",
      "Optional reva.button-materials.css configures inherited data-button-material. Default follows data-material; explicit solid, glass, veil, soft or liquid affects actions only. See the Button materials guide for local resets, scoped use and motion/preferences."
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
      "Alerts are persistent. CSS does not provide a dismiss action; no inactive close buttons are included. Use native links for destinations and buttons only for actions implemented by your application."
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
      "Write the status in visible text. Colour alone must not carry its meaning. Counts need context, for example “3 unread messages.” Use native links and buttons for actions; a badge itself is a passive label.",
      "data-variant (primary, success, warning, danger, neutral) and data-appearance (tinted, solid, outline) configure badges on html, any parent, or an optional local exception. Unsupported values keep the nearest valid parent setting. data-fill retains its existing gradient/solid meaning; decorative data-edge does not apply to badges."
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
      },
      {
        "id": "badge-in-action",
        "title": "A count inside a sized action",
        "description": "The badge remains relative to the action text while preserving shared size and an optional local badge override. The button label supplies count context.",
        "html": "<div class=\"row\" data-size=\"large\">\n  <button type=\"button\">Messages <span class=\"badge\" data-variant=\"neutral\">3 unread</span></button>\n</div>"
      }
    ]
  },
  {
    "slug": "forms",
    "title": "Forms",
    "intro": "Native controls need explicit labels. RevaCSS supplies appearance; your HTML supplies names, hints, errors and form behavior.",
    "examples": [
      {
        "id": "form-disabled-group",
        "title": "Disabled and read-only states",
        "description": "Native disabled fieldsets disable their descendant controls. Read-only fields retain focus and submission; disabled fields are omitted from submission.",
        "html": "<fieldset disabled>\n  <legend>Shipping options unavailable</legend>\n  <label for=\"disabled-address\">Address</label><input id=\"disabled-address\" name=\"address\" autocomplete=\"street-address\" value=\"Unavailable\">\n  <label for=\"disabled-service\">Service</label><select id=\"disabled-service\" name=\"service\"><option>Standard</option></select>\n</fieldset>\n<div class=\"form-group\">\n  <label for=\"explicit-readonly\">Account reference</label>\n  <input id=\"explicit-readonly\" name=\"reference\" value=\"REVA-001\" readonly aria-describedby=\"readonly-hint\">\n  <small id=\"readonly-hint\">Read only. This reference cannot be changed.</small>\n</div>"
      },
      {
        "id": "form-native-pickers",
        "title": "Date, time and numeric controls",
        "description": "Native pickers, constraints and keyboard behaviour remain browser-owned. Picker appearance and support vary by browser. These fields have no submission handler.",
        "html": "<div class=\"grid cols-2\">\n  <div class=\"form-group\"><label for=\"extended-date\">Appointment date <small>(required)</small></label><input id=\"extended-date\" name=\"date\" type=\"date\" required></div>\n  <div class=\"form-group\"><label for=\"extended-time\">Time</label><input id=\"extended-time\" name=\"time\" type=\"time\"></div>\n  <div class=\"form-group\"><label for=\"extended-datetime\">Local date and time</label><input id=\"extended-datetime\" name=\"local-time\" type=\"datetime-local\"></div>\n  <div class=\"form-group\"><label for=\"extended-number\">Quantity</label><input id=\"extended-number\" name=\"quantity\" type=\"number\" min=\"1\" max=\"20\" step=\"1\" value=\"1\"></div>\n</div>"
      },
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
        "id": "container-responsive",
        "title": "A layout inside a narrow parent",
        "description": "The responsive wrapper measures its own width. The fixed-column grid collapses below 40rem even on a wide desktop. Put the wrapper inside a sized parent; do not put containment on a subgrid card.",
        "html": "<div style=\"max-inline-size: 32rem;\">\n  <div class=\"responsive\">\n    <div class=\"grid cols-2\">\n      <article class=\"card\"><h3>First item</h3><p>One column in this narrow space.</p></article>\n      <article class=\"card\"><h3>Second item</h3><p>The browser window can remain wide.</p></article>\n    </div>\n  </div>\n</div>"
      },
      {
        "id": "card",
        "title": "Cards",
        "description": "Apply .card to an article or section. Shared shape, density, depth and border attributes control its treatment.",
        "html": "<article class=\"card\" data-shape=\"rounded\" data-depth=\"subtle\">\n  <h3>Your next project</h3>\n  <p>A surface for related content.</p>\n  <a href=\"#main\">Read more</a>\n</article>"
      },
      {
        "id": "grid",
        "title": "Responsive grids",
        "description": "The default grid fits as many columns as space permits. cols-2 and cols-3 switch to one column below 40rem. Inside a responsive wrapper they also use the wrapper width; cols-3 uses two columns from 40rem to below 60rem.",
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
