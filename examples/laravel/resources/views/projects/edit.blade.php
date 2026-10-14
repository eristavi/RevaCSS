<x-application title="Edit project">
    <x-reva::breadcrumbs :items="[['label' => 'Projects', 'url' => route('projects.index')], ['label' => $project->name]]" />
    <x-reva::card title="Project details">
        <x-reva::error-summary />
        <x-reva::form :action="route('projects.update', $project)" method="PUT">
            @include('projects.fields')
            <div class="row"><x-reva::button type="submit">Save changes</x-reva::button><x-reva::button-link :href="route('projects.index')" appearance="outline">Cancel</x-reva::button-link></div>
        </x-reva::form>
    </x-reva::card>
    <x-reva::card title="Delete this project">
        <p>Deletion permanently removes this project.</p>
        <x-reva::form :action="route('projects.destroy', $project)" method="DELETE"><x-reva::button type="submit" variant="danger">Delete project</x-reva::button></x-reva::form>
    </x-reva::card>
</x-application>
