## RevaCSS Laravel integration

This optional package wraps the installed RevaCSS 2.x HTML/CSS contracts. Read its README and the focused references before using components. Use x-reva:: component names; native HTML remains supported. Keep all Laravel behaviour in the consuming application.

- Start with x-reva::layout or add x-reva::assets to an existing layout.
- Use labelled native controls. The adapter supports Laravel errors, named bags and previous input; do not repopulate passwords/files.
- Pass wire:* directives to controls and actions; Livewire is optional application behaviour.
- Appearance overrides are request-local arrays, validated by Reva\Laravel\Support\Appearance. Never mutate global config with user preferences.
- Use links('reva::pagination') or links('reva::livewire-pagination') explicitly.
- Preserve supported classes/data attributes, extension dependencies, native semantics and accessibility fallbacks.
- This is a version 2 candidate, not a published Packagist release. Do not invent install versions or CDN URLs.
- Follow the user's and repository's instructions for checks, browser review and publishing.
