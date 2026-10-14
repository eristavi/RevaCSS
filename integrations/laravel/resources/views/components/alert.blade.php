@props(['variant' => null, 'live' => false])
@php
    if ($variant !== null && !in_array($variant, ['primary', 'success', 'warning', 'danger', 'neutral'], true)) throw new \InvalidArgumentException('Unsupported alert variant.');
    $attrs = $attributes->class(['alert']);
    if ($variant !== null) $attrs = $attrs->merge(['data-variant' => $variant]);
    if ($live) $attrs = $attrs->merge(['role' => $variant === 'danger' ? 'alert' : 'status']);
@endphp
<div {{ $attrs }}>{{ $slot }}</div>
