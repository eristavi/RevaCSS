<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Livewire\Livewire;
use App\Livewire\ProjectSearch;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Livewire::component('project-search', ProjectSearch::class);
    }
}
