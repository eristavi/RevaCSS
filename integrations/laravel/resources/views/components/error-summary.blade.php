@props(['errorBag' => 'default', 'ids' => [], 'title' => null])
@php($messages = isset($errors) ? $errors->getBag($errorBag)->getMessages() : [])
@if($messages)
    <x-reva::alert variant="danger" :live="true" {{ $attributes }}>
        <h2>{{ $title ?? __('Please correct the following fields') }}</h2>
        <ul>
            @foreach($messages as $key => $entries)
                @foreach($entries as $message)
                    <li>@if(isset($ids[$key]))<a href="#{{ $ids[$key] }}">{{ $message }}</a>@else{{ $message }}@endif</li>
                @endforeach
            @endforeach
        </ul>
    </x-reva::alert>
@endif
