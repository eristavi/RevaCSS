<nav aria-label="Workspace">
    <x-reva::nav-link :href="route('projects.index')" :active="request()->routeIs('projects.*')">Projects</x-reva::nav-link>
    <x-reva::nav-link :href="route('preferences.edit')" :active="request()->routeIs('preferences.*')">Appearance</x-reva::nav-link>
    <x-reva::nav-link :href="route('livewire')" :active="request()->routeIs('livewire')">Live search</x-reva::nav-link>
</nav>
