<?php

namespace Reva\Laravel\Console;

use Illuminate\Console\Command;
use Reva\Laravel\Support\Assets;

class InstallCommand extends Command
{
    protected $signature = 'reva:install {--views : Publish editable Blade templates} {--force : Overwrite published files}';
    protected $description = 'Publish the optional RevaCSS Laravel configuration and matching versioned assets';

    public function handle(Assets $assets): int
    {
        $assets->manifest(); // Fail clearly if a source checkout has not been prepared.
        $tags = ['reva-config', 'reva-assets'];
        if ($this->option('views')) {
            $tags[] = 'reva-views';
        }
        $result = $this->call('vendor:publish', [
            '--provider' => \Reva\Laravel\RevaServiceProvider::class,
            '--tag' => $tags,
            '--force' => $this->option('force'),
        ]);
        if ($result === self::SUCCESS) {
            $this->info('RevaCSS assets: '.$assets->directory());
            $this->line('Use <x-reva::layout> or <x-reva::assets /> in your application.');
        }
        return $result;
    }
}
