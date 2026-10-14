@props(['title'])
<x-reva::layout :title="$title" :appearance="auth()->user()->preferences ?? []">
    <x-slot:head>{{ $head ?? '' }}</x-slot:head>
    <x-reva::shell>
        <x-slot:sidebar><header><a href="{{ route('projects.index') }}">Reva Workspace</a></header>@include('partials.navigation')</x-slot:sidebar>
        <x-slot:mobileNavigation>@include('partials.navigation')</x-slot:mobileNavigation>
        <x-slot:header>
            <strong>{{ auth()->user()->name }}</strong>
            <x-reva::form :action="route('logout')"><x-reva::button type="submit" variant="secondary" appearance="outline">Sign out</x-reva::button></x-reva::form>
        </x-slot:header>
        <div class="stack">
            <h1>{{ $title }}</h1>
            @if(session('status'))<x-reva::alert variant="success">{{ session('status') }}</x-reva::alert>@endif
            {{ $slot }}
        </div>
    </x-reva::shell>
</x-reva::layout>
