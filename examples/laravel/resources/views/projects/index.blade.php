<x-application title="Your projects">
    <div class="grid">
        <x-reva::metric label="Projects" :value="$total" />
        <x-reva::metric label="Active" :value="$active" />
        <x-reva::metric label="Complete" :value="$complete" />
    </div>
    <x-reva::card title="Project list">
        @if($projects->isEmpty())
            <x-reva::empty-state title="Start your first project"><p>Add a project using the form below.</p></x-reva::empty-state>
        @else
            <x-reva::table caption="Your projects" data-table="striped">
                <x-slot:head><tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col">Actions</th></tr></x-slot:head>
                @foreach($projects as $project)
                    <tr><th scope="row">{{ $project->name }}</th><td><x-reva::badge :variant="$project->status === 'complete' ? 'success' : null">{{ ucfirst($project->status) }}</x-reva::badge></td>
                        <td><a href="{{ route('projects.edit', $project) }}">Edit <span class="visually-hidden">{{ $project->name }}</span></a></td></tr>
                @endforeach
            </x-reva::table>
            {{ $projects->links('reva::pagination') }}
        @endif
    </x-reva::card>
    <x-reva::card title="Add a project">
        <x-reva::error-summary />
        <x-reva::form :action="route('projects.store')">
            @include('projects.fields', ['project' => null])
            <x-reva::button type="submit">Create project</x-reva::button>
        </x-reva::form>
    </x-reva::card>
</x-application>
