@props(['title' => null, 'appearance' => [], 'lang' => null, 'dir' => 'ltr', 'nonce' => null])
@php
    if (!in_array($dir, ['ltr', 'rtl', 'auto'], true)) throw new \InvalidArgumentException('Unsupported document direction.');
    $settings = app(\Reva\Laravel\Support\Appearance::class)->attributes($appearance);
    $mainId = 'reva-main-'.\Illuminate\Support\Str::uuid();
@endphp
<!doctype html>
<html lang="{{ $lang ?? str_replace('_', '-', app()->getLocale()) }}" dir="{{ $dir }}" {{ $attributes->merge($settings->getAttributes())->class(['reva' => config('reva.assets.build') === 'scoped']) }}>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? config('app.name', 'RevaCSS') }}</title>
    <x-reva::assets :appearance="$appearance" :nonce="$nonce" />
    {{ $head ?? '' }}
    @stack('styles')
</head>
<body>
    <a class="skip-link" href="#{{ $mainId }}">{{ __('Skip to content') }}</a>
    {{ $header ?? '' }}
    <main id="{{ $mainId }}" class="container" tabindex="-1">{{ $slot }}</main>
    {{ $footer ?? '' }}
    @stack('scripts')
</body>
</html>
