@props(['label' => null])
@php($menuId = 'reva-menu-'.\Illuminate\Support\Str::uuid())
<div {{ $attributes->class(['app-shell']) }}>
    @isset($sidebar)<aside>{{ $sidebar }}</aside>@endisset
    <header>
        @isset($mobileNavigation)
            <button type="button" popovertarget="{{ $menuId }}">{{ __('Menu') }}</button>
        @endisset
        {{ $header ?? '' }}
    </header>
    @isset($mobileNavigation)
        <aside id="{{ $menuId }}" popover aria-label="{{ $label ?? __('Application navigation') }}">
            <button type="button" popovertarget="{{ $menuId }}" popovertargetaction="hide">{{ __('Close navigation') }}</button>
            {{ $mobileNavigation }}
        </aside>
    @endisset
    <section>{{ $slot }}</section>
</div>
