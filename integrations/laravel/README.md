# RevaCSS for Laravel — version 2 integration

Optional Laravel integration, kept outside the RevaCSS core. The package adds Blade templates, Laravel form/validation handling, appearance configuration, versioned asset publishing and development guidance. It adds no browser JavaScript or replacement CSS engine. Livewire is optional in consuming applications.

**Status:** stable 2.0.0 artifact preparation. `revacss/laravel` is distributed as a Composer ZIP; Packagist publication has not occurred. Versioned archives will be attached to the core GitHub release after final validation. Source and local artifact installation work before publication. See the release validation record for automated/manual scope; reference-application device acceptance is not inferred from core sign-off.

## Requirements and structure

- PHP 8.3 or newer; Laravel 12 or 13.
- Optional Livewire 3 or 4 for reactive application features.
- Matching RevaCSS 2.x builds prepared from this repository.
- Node is a maintainer/source preparation tool, not a PHP runtime dependency.

The runnable [reference application](https://github.com/eristavi/RevaCSS/tree/main/examples/laravel) demonstrates session authentication, owned project CRUD, validated preferences, pagination and Livewire search. It lives at `examples/laravel` in the source checkout and is not included in the Composer archive. This package installs no application routes, user tables, authentication system or demo credentials.

## Install from this checkout

From the RevaCSS repository root:

```sh
npm ci
npm run build:css
node integrations/laravel/scripts/prepare.mjs
```

Preparation copies the existing compiled files **byte for byte**, snapshots supported option values, copies licensing, and records asset SHA-256 hashes. It never writes core CSS, tokens or build scripts. Do not mix an old CSS build with newer source contracts; prepare after building the matching checkout.

In your Laravel project's `composer.json`, add a path repository pointing to this package:

```json
{
  "repositories": [{
    "type": "path",
    "url": "/path/to/RevaCSS/integrations/laravel",
    "options": { "versions": { "revacss/laravel": "2.0.0" } }
  }]
}
```

Then, inside that application:

```sh
composer require 'revacss/laravel:^2.0'
php artisan reva:install
```

Composer discovers `RevaServiceProvider`. `reva:install` publishes `config/reva.php` and matching assets to a version-and-content-addressed directory under `public/vendor/reva/`. Existing config is preserved. `--views` additionally publishes editable templates; `--force` overwrites published files and should be used deliberately. After changing or publishing views, clear compiled views with `php artisan view:clear`. Refresh assets on package upgrades and retain old asset directories until cached HTML is no longer in use.

For an isolated distributable, run `python3 integrations/laravel/scripts/package.py`. The resulting ZIP contains a root Composer manifest and prepared assets. It has stable `2.0.0` Composer metadata; creating the ZIP does not publish a release. Composer's artifact repository can consume it; see [distribution](docs/distribution.md).

## Start with native markup or Blade wrappers

The canonical package namespace is **`x-reva::`**, following Laravel package conventions. It does not reserve unprefixed application component names.

```blade
<x-reva::layout title="Projects">
    <x-reva::card title="Create a project">
        <x-reva::error-summary :ids="['name' => 'project-name']" />
        <x-reva::form :action="route('projects.store')">
            <x-reva::input name="name" id="project-name"
                label="Project name" maxlength="100" required />
            <x-reva::button type="submit">Create project</x-reva::button>
        </x-reva::form>
    </x-reva::card>
</x-reva::layout>
```

Define the real route, authorization and validation in your application. Native HTML can be used inside every slot. Classes/data attributes pass through; wrappers do not replace the framework's component contract.

| Component | Main props / slots |
| --- | --- |
| `layout` | `title`, `appearance`, `lang`, `dir`, `nonce`; `head`, `header`, `footer`; styles/scripts stacks |
| `assets` | optional `build`, `appearance`, CSP `nonce`; stylesheet links only |
| `shell` | `header`, `sidebar`, `mobileNavigation`; independent native mobile popover |
| `card` | `title`, `heading` or `header`, content, `footer` |
| `button` / `button-link` | `type` or `href`, `variant`, `appearance` |
| `form` | `action`, HTTP `method`; CSRF and method spoofing |
| `input` / `textarea` / `select` | `name`, `label`, `id`, `value`, `hint`, `error`, `error-bag`, `use-old` |
| `select` | `options` as value-to-label map, optional `placeholder`, optional custom option slot |
| `checkbox` / `radio` | `name`, `label`, `value`, `checked`; checkbox `unchecked` fallback |
| `error-summary` | `error-bag`, optional field-key-to-ID `ids`, `title` |
| `alert` / `badge` | supported semantic `variant`; alerts announce dynamically when `live` is true |
| `table` | required `caption`, optional scroll-region `label`, `head` / `foot` slots |
| `breadcrumbs` | `items` containing `label` and optional `url`; last item is current |
| `nav-link` | `href`, `active` for `aria-current="page"` |
| `metric` / `empty-state` | metric `label`, `value`; empty state `title` |

Buttons default to `type="button"`; submit explicitly. `variant="secondary"` uses the existing secondary class; other variants use documented `data-variant`. Button appearance is `solid`, `outline` or `ghost`, using the existing native button contract. Omitted variants inherit settings.

## Forms and validation

Controls require a label or native `aria-label`/`aria-labelledby`. Generated IDs are unique; supply stable IDs for reactive forms, repeated keyed items and error-summary links. `name="items[0][name]"` resolves errors and previous input using Laravel's `items.0.name` key. Dot-style names can be used for Livewire model properties.

Native form controls receive application attributes, including `required`, `disabled`, `readonly`, `autocomplete`, `data-*` and `wire:*`. Control attributes go on the **control**, not its wrapper. The adapter joins existing descriptions with hint/error IDs and enforces `aria-invalid="true"` when a known error exists. Visible messages are escaped text; colour is supplementary.

Previous input takes precedence over the supplied value; `:use-old="false"` disables that. Password/file controls never render a value. Multiple selects accept value arrays. For custom select option markup in the slot, the application handles its selected states.

Checkboxes publish an unchecked value of `0` before the native checkbox, including matching disabled state. Use `:unchecked="null"` for checkbox arrays/custom submission contracts. Radio groups need distinct explicit IDs when used reactively and a native fieldset/legend for the group.

```blade
<x-reva::input name="email" label="Email" type="email" error-bag="profile" />
<x-reva::select name="tags[]" label="Tags" multiple
    :options="['design' => 'Design', 'development' => 'Development']"
    :value="$selectedTags" />
```

## Appearance, fonts and application palettes

Defaults live in `config/reva.php`. Per-page/user settings use the layout's `appearance` array. `Appearance::values()` validates exact supported values and does not mutate configuration, making user overrides safe to reuse under long-running application workers.

```blade
<x-reva::layout title="Workspace" :appearance="$user->preferences ?? []">
    ...
</x-reva::layout>
```

`theme=auto` follows system colour preference. Font options remain exactly `manrope` and `system`; bundled Manrope is self-hosted. Disable `assets.fonts` to omit font downloads; native system fallback remains available. Fonts, SVG icons and optional extensions keep their original adjacent paths.

Register application-owned custom palettes as a map in `reva.palettes`, for example `'brand' => 'css/brand.css'`. Supply that stylesheet under the application's public directory and define the documented palette colour tokens for light/dark modes. Then `['palette' => 'brand']` is validated and its CSS is loaded after framework assets. Paths are relative local CSS paths; built-in palette names cannot be replaced through this map. No database content is interpolated into CSS. Use the existing RevaCSS custom-palette exporter and review contrast before adoption.

Custom shapes/density/width retain their existing CSS token mechanism. Add application CSS in the `styles` stack or `head` slot, preferably an external stylesheet compatible with your CSP. The adapter does not generate a personalised core or inject inline styles.

Root Glass/Soft/button material settings automatically select their matching extension. For local section materials, explicitly include required extensions in `assets.extensions`. Scoped mode uses the matching scoped extensions and a `.reva` boundary; `layout` puts that boundary on `<html>`. In an existing app, place `<x-reva::assets build="scoped" />` in its head and style only a manually supplied `.reva` region. Existing framework fonts and registrations retain their documented scope limits. This requires visual acceptance before release.

## Pagination and Livewire

```blade
{{ $projects->links('reva::pagination') }}
{{ $simpleProjects->links('reva::simple-pagination') }}
```

The provider preserves your application's default pagination unless `pagination.use_as_default` is explicitly enabled. Query strings/page names follow Laravel's paginator; call `withQueryString()` or `appends()` in the application where appropriate.

For Livewire, see [the integration guide](docs/livewire.md). `wire:model` directives go to native controls. The adapter omits old/default input values and checkbox hidden fallbacks for model-bound fields, leaving hydration to Livewire. Use the Livewire pagination view explicitly; the opt-in default pagination setting only covers ordinary Laravel paginators.

## Boundaries and version 2 readiness

The adapter provides no application routes, authentication, database schemas, payments, search engine or AI provider. These belong to the consuming application. The reference app demonstrates the connections and adds its own optional Livewire runtime. Existing Tailwind/Flux/Filament interfaces require template adaptation; this is not an automatic skin for their component APIs.

The native mobile popover is non-modal. Provide separate `sidebar` and `mobileNavigation` slots so controls/IDs are not silently duplicated. Navigation that must support browsers without native popovers needs an application-level fallback or another documented layout.

See [validation](docs/validation.md), [distribution](docs/distribution.md) and [AI guidance](docs/ai.md). No package is published or automatically merged by the scripts. Fresh browser/device/screen-reader review remains a version 2 release gate.
