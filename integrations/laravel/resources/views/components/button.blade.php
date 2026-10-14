@props(['type' => 'button', 'variant' => null, 'appearance' => null])
@php
    if (!in_array($type, ['button', 'submit', 'reset'], true)) throw new \InvalidArgumentException('Unsupported button type.');
    if ($variant !== null && !in_array($variant, ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral'], true)) throw new \InvalidArgumentException('Unsupported button variant.');
    if ($appearance !== null && !in_array($appearance, ['solid', 'outline', 'ghost'], true)) throw new \InvalidArgumentException('Unsupported button appearance.');
    $attrs = $attributes->class(['secondary' => $variant === 'secondary', 'outline' => $appearance === 'outline', 'ghost' => $appearance === 'ghost']);
    if ($variant !== null && $variant !== 'secondary') $attrs = $attrs->merge(['data-variant' => $variant]);
@endphp
<button type="{{ $type }}" {{ $attrs }}>{{ $slot }}</button>
