@props(['items' => [], 'label' => null])
<nav {{ $attributes->class(['breadcrumbs'])->merge(['aria-label' => $label ?? __('Breadcrumbs')]) }}>
    <ol role="list">
        @foreach($items as $item)
            <li>@if(!$loop->last && isset($item['url']))<a href="{{ $item['url'] }}">{{ $item['label'] }}</a>@else<span @if($loop->last) aria-current="page" @endif>{{ $item['label'] }}</span>@endif</li>
        @endforeach
    </ol>
</nav>
