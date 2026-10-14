@props(['build' => null, 'appearance' => [], 'nonce' => null])
@php
    $manager = app(\Reva\Laravel\Support\Assets::class);
    $settings = app(\Reva\Laravel\Support\Appearance::class)->values($appearance);
@endphp
@foreach ($manager->stylesheets($build, $settings) as $stylesheet)
    <link rel="stylesheet" href="{{ $manager->url($stylesheet) }}" @if($nonce) nonce="{{ $nonce }}" @endif>
@endforeach
@if(isset(config('reva.palettes', [])[$settings['palette'] ?? 'default']))
    <link rel="stylesheet" href="{{ asset(config('reva.palettes')[$settings['palette']]) }}" @if($nonce) nonce="{{ $nonce }}" @endif>
@endif
