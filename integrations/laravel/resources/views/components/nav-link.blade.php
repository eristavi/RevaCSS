@props(['href', 'active' => false])
<a href="{{ $href }}" {{ $active ? $attributes->merge(['aria-current' => 'page']) : $attributes }}>{{ $slot }}</a>
