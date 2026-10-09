export const publicTokens = [
  ["Liquid buttons", "--re-liquid-scale-x / --re-liquid-scale-y", "Positive numbers", "Pressed expansion: subtle 1.025/1.015; expressive 1.045/1.02. Motion none and reduced motion suppress expansion."],
  ["Liquid buttons", "--re-liquid-blur", "Nonnegative length", "Backdrop blur radius; default 14px. Accessibility preferences disable filtering."],
  ["Liquid buttons", "--re-liquid-opacity", "Percentage", "Neutral backing; default 12%. The background remains visible through the glass. Review label contrast over custom backgrounds; preference fallbacks are opaque."],
  ["Scrolling", "--re-anchor-offset", "Nonnegative length", "Fragment target block-start margin; default 1rem. Account for your fixed header."],
  ["Scrolling", "--re-target-duration", "Nonnegative time", "Expressive fragment highlight duration; default 1.4s. Does not set native scroll speed."],
  ["Overlay motion", "--re-drawer-shift / --re-drawer-direction", "Length / 1 or -1", "Drawer entrance distance and inline-end/start direction. Direction defaults to 1."],
  ["Overlay motion", "--re-popover-offset / --re-popover-scale", "Length / positive number", "Numeric expressive overlay translation and scale."],
  ["Viewport", "--re-safe-top / --re-safe-right / --re-safe-bottom / --re-safe-left", "Nonnegative lengths", "Physical safe-area insets, defaulting to browser env() values. Used by full-height overlays and modal bounds."],
  ["Gallery", "--re-gallery-width", "Positive length", "Maximum slide width; default 24rem, bounded by the scroll container."],
  ["Scroll motion", "--re-reveal-distance", "Length", "Optional expressive card entrance distance; default .75rem."],
  ["Document transitions", "--re-view-duration", "Nonnegative time", "Optional navigation transition duration; defaults to inherited --re-duration."],
  ["Semantic colours", "--re-secondary / --re-secondary-end / --re-on-secondary", "Colours", "Secondary action fill, gradient endpoint and foreground."],
  ["Semantic colours", "--re-success / --re-success-end / --re-on-success", "Colours", "Success fill, gradient endpoint and foreground."],
  ["Semantic colours", "--re-warning / --re-warning-end / --re-on-warning", "Colours", "Warning fill, gradient endpoint and foreground."],
  ["Semantic colours", "--re-danger / --re-danger-end / --re-on-danger", "Colours", "Danger fill, gradient endpoint and foreground."],
  ["Semantic colours", "--re-secondary-link / --re-danger-link", "Colours", "Readable secondary and danger outline/ghost text."],
  ["Charts", "--re-chart-color", "Colour", "Local SVG series stroke; defaults to the primary colour."],
  ["Charts", "--re-chart-ring-width", "SVG user units", "Doughnut stroke width; default 22."],
  ["Drawer", "--re-drawer-width", "Length", "Inspector width; default 28rem, customisable with ordinary CSS. Bounded by the viewport."],
  ["Application layout", "--re-sidebar-width", "Length", "Sidebar and mobile drawer width; 16rem fallback, bounded by viewport."],
  ["Navigation", "--re-navbar-width", "Length or percentage", "Navbar width; standard 100%, floating min(100% - 2rem, page width)."],
  ["Navigation", "--re-navbar-margin", "Length", "Navbar block margin; standard 0, floating 1rem."],
  ["Veil", "--re-veil-opacity", "Percentage", "Surface backing; 94% default. Accessibility fallbacks use opaque backing."],
  ["Veil", "--re-veil-strength", "Number, 0–1", "Perimeter colour and contour strength; 1 default. More contrast removes decoration."],
  ["Navigation", "--re-dropdown-width", "Length", "Standalone dropdown width; 18rem fallback, bounded by viewport"],
  [
    "Palette",
    "--re-bg",
    "Colour",
    "Page background"
  ],
  [
    "Palette",
    "--re-surface",
    "Colour",
    "Opaque component surface"
  ],
  [
    "Palette",
    "--re-surface-alt",
    "Colour",
    "Secondary surface"
  ],
  [
    "Palette",
    "--re-text",
    "Colour",
    "Main foreground"
  ],
  [
    "Palette",
    "--re-muted",
    "Colour",
    "Supporting foreground"
  ],
  [
    "Palette",
    "--re-link",
    "Colour",
    "Link foreground"
  ],
  [
    "Palette",
    "--re-line",
    "Colour",
    "Surface boundary"
  ],
  [
    "Palette",
    "--re-control-line",
    "Colour",
    "Control boundary"
  ],
  [
    "Accent",
    "--re-primary / --re-primary-end",
    "Colours",
    "Accent stops; override both together"
  ],
  [
    "Accent",
    "--re-on-primary",
    "Colour",
    "Foreground for the accent fill"
  ],
  [
    "Typography",
    "--re-font",
    "Font-family list",
    "Body and control font"
  ],
  [
    "Typography",
    "--re-font-heading",
    "Font-family list",
    "Optional heading override; otherwise falls back to --re-font"
  ],
  [
    "Layout",
    "--re-radius / --re-button-radius",
    "Length",
    "Surface and action roundness"
  ],
  [
    "Layout",
    "--re-space / --re-gap",
    "Length",
    "Base spacing"
  ],
  [
    "Layout",
    "--re-container",
    "Length",
    "Maximum container width; 75rem by default"
  ],
  [
    "Layout",
    "--re-column",
    "Length",
    "Auto-fit grid column target; 18rem fallback"
  ],
  [
    "Layout",
    "--re-prose",
    "Length",
    "Readable content width; 65ch fallback"
  ],
  [
    "Layout",
    "--re-card-padding",
    "Length",
    "Optional card padding override"
  ],
  [
    "Material",
    "--re-glass-opacity",
    "Percentage",
    "Glass surfaces; 32% default"
  ],
  [
    "Material",
    "--re-glass-button-opacity",
    "Percentage",
    "Glass actions and small surfaces; 90% default"
  ],
  [
    "Material",
    "--re-glass-shadow",
    "Shadow list or none",
    "Glass elevation and rim shadows; follows shared data-depth"
  ],
  [
    "Material",
    "--re-glass-filter",
    "Filter value",
    "blur(12px) saturate(145%) default"
  ],
  [
    "Assets",
    "--re-icon-size",
    "Length",
    "Icon dimensions; 1.25em fallback"
  ],
  [
    "Assets",
    "--re-icon-stroke",
    "Number",
    "SVG stroke width; 1.75 fallback"
  ],
  [
    "Assets",
    "--re-avatar-size",
    "Length",
    "Avatar base size; 2.75rem fallback"
  ],
  [
    "Content",
    "--re-skeleton-width / --re-skeleton-height",
    "Length or percentage",
    "Placeholder width/height; 100% / 1em fallbacks"
  ],
  [
    "Content",
    "--re-description-label",
    "Length",
    "Description-list label column; 12rem fallback"
  ],
  [
    "Navigation",
    "--re-menu-width",
    "Length",
    "Desktop panel width; 20rem fallback"
  ],
  [
    "Navigation",
    "--re-menu-anchor",
    "CSS identifier",
    "Unique menu anchor; see complete menu markup"
  ]
];
