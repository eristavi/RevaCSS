@props(['title' => null])
<article {{ $attributes->class(['card']) }}>
    @if(isset($header))<header>{{ $header }}</header>
    @elseif(isset($heading) || $title)<header><h2>{{ $heading ?? $title }}</h2></header>@endif
    {{ $slot }}
    @isset($footer)<footer>{{ $footer }}</footer>@endisset
</article>
