<x-reva::layout title="Sign in · Reva Workspace" :appearance="['width' => 'narrow']">
    <h1>Welcome back</h1>
    <p>Sign in to your workspace.</p>
    <x-reva::card>
        <x-reva::error-summary :ids="['email' => 'login-email', 'password' => 'login-password']" />
        <x-reva::form :action="route('login')">
            <x-reva::input name="email" id="login-email" label="Email" type="email" autocomplete="username" required />
            <x-reva::input name="password" id="login-password" label="Password" type="password" autocomplete="current-password" required />
            <x-reva::checkbox name="remember" label="Remember me" />
            <x-reva::button type="submit">Sign in</x-reva::button>
        </x-reva::form>
        <x-slot:footer><a href="{{ route('register') }}">Create an account</a></x-slot:footer>
    </x-reva::card>
</x-reva::layout>
