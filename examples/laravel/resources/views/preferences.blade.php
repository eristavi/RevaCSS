<x-application title="Appearance">
    <x-reva::card title="Make this workspace yours">
        <p>Choose your defaults. They apply to every workspace page.</p>
        <x-reva::error-summary />
        <x-reva::form :action="route('preferences.update')" method="PUT">
            @foreach($choices as $key => $values)
                <x-reva::select :name="$key" :label="ucfirst($key)" :options="array_combine($values, array_map('ucfirst', $values))" :value="auth()->user()->preferences[$key] ?? config('reva.appearance.'.$key)" required />
            @endforeach
            <x-reva::button type="submit">Save appearance</x-reva::button>
        </x-reva::form>
    </x-reva::card>
</x-application>
