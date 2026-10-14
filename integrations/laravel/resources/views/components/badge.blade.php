@props(['variant' => null])
@php
    if ($variant !== null && !in_array($variant, ['primary', 'success', 'warning', 'danger', 'neutral'], true)) throw new \InvalidArgumentException('Unsupported badge variant.');
    $attrs = $attributes->class(['badge']);
    if ($variant !== null) $attrs = $attrs->merge(['data-variant' => $variant]);
@endphp
<span {{ $attrs }}>{{ $slot }}</span>
