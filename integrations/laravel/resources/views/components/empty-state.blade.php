@props(['title'])
<section {{ $attributes->class(['empty-state']) }}>
    <h2>{{ $title }}</h2>
    {{ $slot }}
</section>
