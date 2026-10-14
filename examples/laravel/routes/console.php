<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('reva-demo:seed {email : An existing local account email}', function (): int {
    if (!app()->environment('local')) {
        $this->error('Sample records are available in the local environment only.');
        return 1;
    }
    $user = \App\Models\User::where('email', $this->argument('email'))->first();
    if (!$user) { $this->error('Register an account first.'); return 1; }
    foreach (range(1, 12) as $number) {
        $user->projects()->firstOrCreate(['name' => 'Example project '.$number], ['status' => $number % 3 === 0 ? 'complete' : 'active']);
    }
    $this->info('Sample projects created for this local account.');
    return 0;
})->purpose('Create optional sample projects without creating default credentials');
