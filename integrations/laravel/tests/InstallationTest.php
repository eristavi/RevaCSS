<?php

namespace Reva\Laravel\Tests;

use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\Blade;
use Orchestra\Testbench\TestCase;
use Reva\Laravel\RevaServiceProvider;
use Reva\Laravel\Support\Assets;

class InstallationTest extends TestCase
{
    private string $sandbox;
    private string $resourceSandbox;

    protected function getPackageProviders($app): array
    {
        return [RevaServiceProvider::class];
    }

    protected function getEnvironmentSetUp($app): void
    {
        $this->sandbox = sys_get_temp_dir().'/reva-laravel-'.bin2hex(random_bytes(8));
        foreach (['public', 'config', 'resources/views/vendor/reva'] as $path) mkdir($this->sandbox.'/'.$path, 0777, true);
        $app->usePublicPath($this->sandbox.'/public');
        $app->useConfigPath($this->sandbox.'/config');
        $this->resourceSandbox = $app->resourcePath('views/vendor/reva');
        (new Filesystem)->ensureDirectoryExists($this->resourceSandbox);
        $app['config']->set('view.paths', [$app->resourcePath('views')]);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        (new Filesystem)->deleteDirectory($this->sandbox);
        (new Filesystem)->deleteDirectory($this->resourceSandbox);
    }

    public function test_installation_publishes_matching_assets_without_overwriting_configuration(): void
    {
        $this->artisan('reva:install')->assertExitCode(0)->run();
        $config = config_path('reva.php');
        $core = public_path(app(Assets::class)->directory().'/reva.min.css');
        $this->assertFileExists($config);
        $this->assertSame(app(Assets::class)->manifest()['files']['reva.min.css'], hash_file('sha256', $core));
        file_put_contents($config, '<?php return ["customized" => true];');
        $this->artisan('reva:install')->assertExitCode(0)->run();
        $this->assertStringContainsString('customized', file_get_contents($config));
        $this->artisan('reva:install', ['--force' => true])->assertExitCode(0)->run();
        $this->assertStringNotContainsString('customized', file_get_contents($config));
    }

    public function test_views_can_be_published_and_overridden_without_changing_package_templates(): void
    {
        $this->artisan('reva:install', ['--views' => true])->assertExitCode(0)->run();
        $file = resource_path('views/vendor/reva/components/card.blade.php');
        $this->assertFileExists($file);
        file_put_contents($file, '<section class="my-card">{{ $slot }}</section>');
        $this->assertStringContainsString('my-card', Blade::render('<x-reva::card>Custom</x-reva::card>'));
        $this->assertStringNotContainsString('my-card', file_get_contents(__DIR__.'/../resources/views/components/card.blade.php'));
    }
}
