---
name: revacss-development
description: Build Laravel Blade interfaces using the installed RevaCSS adapter, including labelled forms, validation, appearance defaults, pagination and optional Livewire integration.
license: MIT
---

# RevaCSS development in Laravel

Activate for RevaCSS Laravel interface work. Read the installed package README and focused docs first. Use its matching resources/contracts.json and asset manifest; do not assume newer source features exist in an older installation.

1. Decide between native HTML and optional x-reva:: wrappers. Both use the existing CSS.
2. Use x-reva::layout or x-reva::assets. Publish matching versioned files through reva:install. Scoped integration requires a .reva boundary and matching extensions.
3. Put page/user appearance settings in the layout's appearance array. Use Appearance::values() and Laravel validation for stored preferences. Do not store arbitrary attribute names or mutate global config per user.
4. Use input/textarea/select/checkbox/radio with labels, appropriate names and stable IDs for reactive fields. Field attributes and wire:model go on native controls. The adapter handles error associations, named bags and previous input; password/file values are omitted.
5. Forms need real routes, CSRF, correct HTTP methods, request validation and server-side authorization. The adapter supplies markup, not these business rules.
6. Use the ordinary or reactive pagination view explicitly. Scope queries to authorized data and reset pagination when filters change.
7. Inspect generated markup for missing extensions, duplicate IDs, invalid attributes, ambiguous labels and placeholder endpoints. Follow project instructions about checks; report deferred review accurately.

For button variants, secondary uses the existing secondary class; semantic variants use data-variant. Button appearance uses solid/outline/ghost. Do not import unrelated Tailwind/Flux markup or invent RevaCSS hooks.

Use separate sidebar/mobileNavigation slots. Native popovers are non-modal and do not provide a universal focus trap. Application state, search, authentication, payments, real-time updates and AI clients stay outside the CSS core.

For AI SDK functionality, consult the installed Laravel AI documentation. Escape generated text and validate structured output before mapping it to known components. Never execute model-produced Blade/PHP or trust arbitrary HTML.
