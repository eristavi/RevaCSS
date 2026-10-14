<x-application title="Find a project">
    <x-slot:head>@livewireStyles</x-slot:head>
    <p>Search your projects as you type.</p>
    <livewire:project-search />
    @push('scripts') @livewireScripts @endpush
</x-application>
