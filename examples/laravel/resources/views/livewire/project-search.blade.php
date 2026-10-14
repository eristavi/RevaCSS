<div class="stack">
    <x-reva::input name="search" id="project-search" label="Search projects" type="search" wire:model.live.debounce.300ms="search" maxlength="100" />
    <p role="status" wire:loading wire:target="search">Searching…</p>
    <div wire:loading.attr="aria-busy" wire:target="search">
        <x-reva::table caption="Matching projects">
            <x-slot:head><tr><th scope="col">Name</th><th scope="col">Status</th></tr></x-slot:head>
            @forelse($projects as $project)
                <tr wire:key="project-{{ $project->id }}"><th scope="row">{{ $project->name }}</th><td>{{ ucfirst($project->status) }}</td></tr>
            @empty
                <tr><td colspan="2">No projects match your search.</td></tr>
            @endforelse
        </x-reva::table>
        {{ $projects->links('reva::livewire-pagination') }}
    </div>
</div>
