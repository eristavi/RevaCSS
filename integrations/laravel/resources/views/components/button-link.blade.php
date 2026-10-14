@props(['href', 'variant' => null, 'appearance' => null])
@php
    if ($variant !== null && !in_array($variant, ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'], true)) throw new \InvalidArgumentException('Unsupported action-link variant.');
    if ($appearance !== null && !in_array($appearance, ['solid', 'outline', 'ghost'], true)) throw new \InvalidArgumentException('Unsupported action-link appearance.');
    $attrs = $attributes->class(['button', 'secondary' => $variant === 'secondary', 'outline' => $appearance === 'outline', 'ghost' => $appearance === 'ghost']);
    if ($variant !== null && $variant !== 'secondary') $attrs = $attrs->merge(['data-variant' => $variant]);
@endphp
<a href="{{ $href }}" {{ $attrs }}>{{ $slot }}</a>
