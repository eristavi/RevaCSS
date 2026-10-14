<x-reva::layout title="Create an account · Reva Workspace" :appearance="['width' => 'narrow']">
    <h1>Create your workspace</h1>
    <x-reva::card>
        <x-reva::error-summary />
        <x-reva::form :action="route('register')">
            <x-reva::input name="name" label="Name" autocomplete="name" maxlength="100" required />
            <x-reva::input name="email" label="Email" type="email" autocomplete="username" required />
            <x-reva::input name="password" label="Password" type="password" autocomplete="new-password" minlength="12" hint="Use at least 12 characters." required />
            <x-reva::input name="password_confirmation" label="Confirm password" type="password" autocomplete="new-password" required />
            <x-reva::button type="submit">Create account</x-reva::button>
        </x-reva::form>
        <x-slot:footer><a href="{{ route('login') }}">Already have an account? Sign in</a></x-slot:footer>
    </x-reva::card>
</x-reva::layout>
