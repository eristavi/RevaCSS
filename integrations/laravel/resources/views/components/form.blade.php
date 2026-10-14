@props(['action' => null, 'method' => 'POST'])
@php
    $verb = strtoupper($method);
    if (!in_array($verb, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], true)) throw new \InvalidArgumentException('Unsupported form method.');
@endphp
<form action="{{ $action ?? url()->current() }}" method="{{ $verb === 'GET' ? 'get' : 'post' }}" {{ $attributes }}>
    @if($verb !== 'GET') @csrf @endif
    @if(!in_array($verb, ['GET', 'POST'], true)) @method($verb) @endif
    {{ $slot }}
</form>
