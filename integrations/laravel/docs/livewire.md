# Livewire integration

Livewire is optional. The adapter passes directives through to native controls and never adds its own browser runtime. Install Livewire using its official instructions and provide its application scripts/styles.

```blade
<x-reva::input name="email" id="profile-email" label="Email"
    type="email" wire:model.blur="email" />
<x-reva::button wire:click="save" wire:loading.attr="disabled" wire:target="save">
    Save profile
</x-reva::button>
<p role="status" wire:loading wire:target="save">Saving…</p>
```

The Livewire component owns validation, authorization and persistence. Its validation bag supplies the field error. Use explicit stable IDs and `wire:key` for repeated controls. Bound fields omit previous/default HTML values and checkbox hidden fallbacks. Model-bound selects omit server `selected` attributes; Livewire hydrates the selected value.

For length-aware reactive pagination:

```blade
{{ $projects->links('reva::livewire-pagination') }}
```

Use `WithPagination` in the component, reset the page when filters change, and give independently paginated collections distinct page names. Links retain real URLs and use `wire:click.prevent` for reactive navigation; this preserves the framework's native pagination markup. Labels are localizable. Application loading/disabled treatment can be added where needed.

The runnable example is `examples/laravel/app/Livewire/ProjectSearch.php`, with its matching Blade view. Its queries are scoped to the authenticated user. The ordinary CRUD pages work without application JavaScript; the search page uses Livewire's runtime.

CSS-native popovers and disclosures retain their own browser state. Avoid replacing their DOM unnecessarily during reactive updates. Use application hooks only where the product requires state persistence or explicit focus management; no universal focus-trap behaviour is promised by RevaCSS.
