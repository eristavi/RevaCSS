@props(['label', 'value'])
<article {{ $attributes->class(['card']) }}>
    <dl><dt>{{ $label }}</dt><dd><output>{{ $value }}</output></dd>@if(!$slot->isEmpty())<dd><small>{{ $slot }}</small></dd>@endif</dl>
</article>
