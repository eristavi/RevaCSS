<?php

namespace Reva\Laravel;

use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;
use Reva\Laravel\Console\InstallCommand;
use Reva\Laravel\Support\Appearance;
use Reva\Laravel\Support\Assets;

class RevaServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__.'/../config/reva.php', 'reva');
        $defaults = require __DIR__.'/../config/reva.php';
        foreach (['appearance', 'assets', 'pagination'] as $section) {
            $this->app['config']->set('reva.'.$section, array_replace($defaults[$section], $this->app['config']->get('reva.'.$section, [])));
        }
        $this->app->singleton(Appearance::class);
        $this->app->singleton(Assets::class);
    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'reva');

        if (config('reva.pagination.use_as_default', false)) {
            Paginator::defaultView('reva::pagination');
            Paginator::defaultSimpleView('reva::simple-pagination');
        }

        if ($this->app->runningInConsole()) {
            $this->commands([InstallCommand::class]);
            $this->publishes([__DIR__.'/../config/reva.php' => config_path('reva.php')], 'reva-config');
            $this->publishes([__DIR__.'/../resources/views' => resource_path('views/vendor/reva')], 'reva-views');
            if (is_file(__DIR__.'/../resources/assets/manifest.json')) {
                $assets = $this->app->make(Assets::class);
                $this->publishes([__DIR__.'/../resources/assets' => public_path($assets->directory())], 'reva-assets');
            }
        }
    }
}
