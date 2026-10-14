<?php

namespace Reva\Laravel\Tests;

use DOMDocument;
use DOMXPath;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\MessageBag;
use Illuminate\Support\ViewErrorBag;
use Orchestra\Testbench\TestCase;
use Reva\Laravel\RevaServiceProvider;
use Reva\Laravel\Support\Appearance;
use Reva\Laravel\Support\Assets;

class AdapterTest extends TestCase
{
    protected function getPackageProviders($app): array
    {
        return [RevaServiceProvider::class];
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->app['request']->setLaravelSession($this->app['session']->driver());
        view()->share('errors', new ViewErrorBag);
    }

    private function html(string $template, array $data = []): DOMXPath
    {
        $document = new DOMDocument;
        $rendered = Blade::render($template, $data);
        $document->loadHTML(str_contains($rendered, '<!doctype html>') ? $rendered : '<meta charset="utf-8">'.$rendered, LIBXML_NONET | LIBXML_NOERROR | LIBXML_NOWARNING);
        return new DOMXPath($document);
    }

    public function test_fields_have_unique_associated_ids_and_forward_native_attributes(): void
    {
        $html = $this->html('<x-reva::input name="email" label="Email" required autocomplete="email" class="customer-field" /><x-reva::input name="email" label="Other email" />');
        $inputs = $html->query('//input');
        $this->assertNotSame($inputs[0]->getAttribute('id'), $inputs[1]->getAttribute('id'));
        $this->assertSame($inputs[0]->getAttribute('id'), $html->query('//label')[0]->getAttribute('for'));
        $this->assertTrue($inputs[0]->hasAttribute('required'));
        $this->assertSame('email', $inputs[0]->getAttribute('autocomplete'));
        $this->assertSame('customer-field', $inputs[0]->getAttribute('class'));
    }

    public function test_named_validation_bags_merge_error_and_hint_descriptions(): void
    {
        view()->share('errors', (new ViewErrorBag)->put('profile', new MessageBag(['email' => ['Enter a valid email.']])));
        $html = $this->html('<x-reva::input name="email" id="email" label="Email" error-bag="profile" hint="We send receipts here." aria-describedby="external-help" aria-invalid="false" />');
        $this->assertSame('external-help email-hint email-error', $html->query('//input')[0]->getAttribute('aria-describedby'));
        $this->assertSame('true', $html->query('//input')[0]->getAttribute('aria-invalid'));
        $this->assertSame('Enter a valid email.', $html->query('//p[@id="email-error"]')[0]->textContent);
    }

    public function test_array_field_names_use_laravel_dot_keys_and_preserve_zero(): void
    {
        $this->app['session']->driver()->flashInput(['items' => [['quantity' => '0']]]);
        view()->share('errors', (new ViewErrorBag)->put('default', new MessageBag(['items.0.quantity' => ['Must be positive.']])));
        $html = $this->html('<x-reva::input name="items[0][quantity]" label="Quantity" type="number" value="5" />');
        $this->assertSame('items[0][quantity]', $html->query('//input')[0]->getAttribute('name'));
        $this->assertSame('0', $html->query('//input')[0]->getAttribute('value'));
        $this->assertSame('true', $html->query('//input')[0]->getAttribute('aria-invalid'));
    }

    public function test_password_and_file_fields_never_echo_values_or_old_input(): void
    {
        $this->app['session']->driver()->flashInput(['password' => 'secret-old', 'upload' => 'private-path']);
        $html = $this->html('<x-reva::input name="password" label="Password" type="password" value="secret-default" /><x-reva::input name="upload" label="Upload" type="file" value="private-default" />');
        foreach ($html->query('//input') as $input) $this->assertFalse($input->hasAttribute('value'));
    }

    public function test_malformed_old_scalar_values_do_not_break_validation_rendering(): void
    {
        $this->app['session']->driver()->flashInput(['name' => ['unexpected' => 'array'], 'choice' => [['nested']]]);
        $html = $this->html('<x-reva::input name="name" label="Name" /><x-reva::radio name="name" label="One" value="one" /><x-reva::checkbox name="choice[]" label="Choice" value="one" :unchecked="null" /><x-reva::input name="other" label="Other" :aria-invalid="true" />');
        $this->assertSame('', $html->query('//input[@name="name"]')[0]->getAttribute('value'));
        $this->assertSame(0, $html->query('//input[@checked]')->length);
        $this->assertSame('true', $html->query('//input[@name="other"]')[0]->getAttribute('aria-invalid'));
    }

    public function test_user_content_is_escaped_in_values_options_and_textareas(): void
    {
        $payload = '"></textarea><script>alert(1)</script>';
        $html = $this->html('<x-reva::input name="text" label="Text" :value="$payload" /><x-reva::textarea name="body" label="Body" :value="$payload" /><x-reva::select name="choice" label="Choice" :options="[1 => $payload]" />', compact('payload'));
        $this->assertSame(0, $html->query('//script')->length);
        $this->assertSame($payload, $html->query('//input')[0]->getAttribute('value'));
        $this->assertSame($payload, $html->query('//textarea')[0]->textContent);
        $this->assertSame($payload, $html->query('//option')[0]->textContent);
    }

    public function test_select_multiple_and_old_value_opt_out(): void
    {
        $this->app['session']->driver()->flashInput(['tags' => ['a', 'c'], 'body' => 'old']);
        $html = $this->html('<x-reva::select name="tags[]" label="Tags" multiple :options="[\'a\' => \'A\', \'b\' => \'B\', \'c\' => \'C\']" /><x-reva::textarea name="body" label="Body" value="new" :use-old="false" />');
        $this->assertSame(2, $html->query('//option[@selected]')->length);
        $this->assertSame('new', $html->query('//textarea')[0]->textContent);
    }

    public function test_livewire_owns_model_values_and_checkbox_has_no_hidden_fallback(): void
    {
        $this->app['session']->driver()->flashInput(['email' => 'stale', 'enabled' => '1']);
        $html = $this->html('<x-reva::input name="email" label="Email" value="default" wire:model.live="email" wire:key="email-field" /><x-reva::checkbox name="enabled" label="Enabled" :checked="true" wire:model="enabled" />');
        $this->assertSame('email', $html->query('//input[@name="email"]')[0]->getAttribute('wire:model.live'));
        $this->assertFalse($html->query('//input[@name="email"]')[0]->hasAttribute('value'));
        $this->assertSame(0, $html->query('//input[@type="hidden"]')->length);
        $this->assertFalse($html->query('//input[@type="checkbox"]')[0]->hasAttribute('checked'));
    }

    public function test_disabled_checkbox_does_not_submit_its_fallback(): void
    {
        $html = $this->html('<x-reva::checkbox name="enabled" label="Enabled" disabled />');
        $this->assertTrue($html->query('//input[@type="hidden"]')[0]->hasAttribute('disabled'));
        $this->assertTrue($html->query('//input[@type="checkbox"]')[0]->hasAttribute('disabled'));
    }

    public function test_checkbox_and_radio_respect_previous_unchecked_submission(): void
    {
        $this->app['session']->driver()->flashInput(['enabled' => '0', 'level' => 'basic']);
        $html = $this->html('<x-reva::checkbox name="enabled" label="Enabled" :checked="true" /><x-reva::radio name="level" label="Advanced" value="advanced" :checked="true" /><x-reva::radio name="level" label="Basic" value="basic" />');
        $this->assertSame(1, $html->query('//input[@checked]')->length);
        $this->assertSame('basic', $html->query('//input[@checked]')[0]->getAttribute('value'));
    }

    public function test_forms_add_csrf_and_method_spoofing_but_get_forms_do_not(): void
    {
        $html = $this->html('<x-reva::form action="/profile" method="PUT"><x-reva::button type="submit">Save</x-reva::button></x-reva::form><x-reva::form action="/search" method="GET" />');
        $this->assertSame('post', $html->query('//form')[0]->getAttribute('method'));
        $this->assertSame('PUT', $html->query('//input[@name="_method"]')[0]->getAttribute('value'));
        $this->assertSame(1, $html->query('//input[@name="_token"]')->length);
        $this->assertSame(0, $html->query('//form[@method="get"]//input')->length);
    }

    public function test_semantic_wrappers_match_framework_structure(): void
    {
        $html = $this->html('<x-reva::card title="Details"><p>Body</p><x-slot:footer>Actions</x-slot:footer></x-reva::card><x-reva::table caption="Records"><x-slot:head><tr><th scope="col">Name</th></tr></x-slot:head><tr><td>One</td></tr></x-reva::table><x-reva::button variant="secondary" appearance="outline">Back</x-reva::button>');
        $this->assertSame(1, $html->query('//article[contains(@class,"card")]/header/h2')->length);
        $this->assertSame(1, $html->query('//article/footer')->length);
        $this->assertSame('Records', $html->query('//table/caption')[0]->textContent);
        $this->assertSame('region', $html->query('//div[contains(@class,"table-scroll")]')[0]->getAttribute('role'));
        $this->assertSame('button', $html->query('//button')[0]->getAttribute('type'));
        $this->assertStringContainsString('secondary', $html->query('//button')[0]->getAttribute('class'));
    }

    public function test_missing_accessible_label_is_rejected(): void
    {
        $this->expectException(\Illuminate\View\ViewException::class);
        $this->expectExceptionMessage('needs a label');
        Blade::render('<x-reva::input name="email" />');
    }

    public function test_appearance_uses_exact_supported_values_without_cross_request_state(): void
    {
        $appearance = app(Appearance::class);
        $this->assertSame('dark', $appearance->values(['theme' => 'dark'])['theme']);
        $this->assertSame('auto', $appearance->values()['theme']);
        $this->assertSame('system', $appearance->attributes(['font' => 'system'])->get('data-font'));
        $this->expectException(\InvalidArgumentException::class);
        $appearance->values(['theme' => 'system']);
    }

    public function test_asset_selection_is_versioned_and_loads_matching_extensions(): void
    {
        config(['reva.assets.build' => 'scoped', 'reva.assets.extensions' => ['motion'], 'reva.assets.fonts' => false]);
        $assets = app(Assets::class);
        $this->assertSame(['reva.scoped.css', 'reva.motion.scoped.css', 'reva.glass.scoped.css'], $assets->stylesheets(null, ['material' => 'glass']));
        $this->assertMatchesRegularExpression('~vendor/reva/2\.0\.0-[a-f0-9]{12}/reva\.scoped\.css$~', $assets->url('reva.scoped.css'));
        $this->expectException(\InvalidArgumentException::class);
        $assets->url('../outside.css');
    }

    public function test_asset_path_traversal_is_rejected(): void
    {
        config(['reva.assets.path' => '../outside']);
        $this->expectException(\InvalidArgumentException::class);
        app(Assets::class)->directory();
    }

    public function test_registered_custom_palettes_use_validated_external_css(): void
    {
        config(['reva.palettes' => ['brand' => 'css/brand.css']]);
        $this->assertSame('brand', app(Appearance::class)->values(['palette' => 'brand'])['palette']);
        $html = $this->html('<x-reva::assets :appearance="[\'palette\' => \'brand\']" />');
        $this->assertSame(1, $html->query('//link[contains(@href,"css/brand.css")]')->length);
        config(['reva.palettes' => ['bad' => '../outside.css']]);
        $this->expectException(\InvalidArgumentException::class);
        app(Appearance::class)->choices();
    }

    public function test_packaged_assets_are_byte_identical_to_core_builds(): void
    {
        $assets = app(Assets::class);
        foreach ($assets->manifest()['files'] as $file => $hash) {
            $this->assertSame($hash, hash_file('sha256', __DIR__.'/../resources/assets/'.$file));
            $this->assertSame($hash, hash_file('sha256', dirname(__DIR__, 3).'/dist/'.$file));
        }
    }

    public function test_layout_outputs_escaped_title_root_settings_and_a_working_skip_link(): void
    {
        $html = $this->html('<x-reva::layout :title="$title" :appearance="[\'font\' => \'system\', \'theme\' => \'dark\']"><h1>Hello</h1></x-reva::layout>', ['title' => '<unsafe>']);
        $this->assertSame('<unsafe>', $html->query('//title')[0]->textContent);
        $this->assertSame('system', $html->query('//html')[0]->getAttribute('data-font'));
        $this->assertSame('dark', $html->query('//html')[0]->getAttribute('data-theme'));
        $this->assertSame('#'.$html->query('//main')[0]->getAttribute('id'), $html->query('//a[@class="skip-link"]')[0]->getAttribute('href'));
    }

    public function test_pagination_has_real_urls_current_state_and_livewire_enhancement(): void
    {
        $paginator = new LengthAwarePaginator(range(1, 5), 30, 5, 2, ['path' => '/records', 'pageName' => 'recordsPage']);
        $paginator->appends(['filter' => 'active']);
        $output = $paginator->links('reva::pagination')->toHtml();
        $this->assertStringContainsString('aria-current="page"', $output);
        $this->assertStringContainsString('filter=active', $output);
        $this->assertStringContainsString('recordsPage=3', $output);
        $reactive = $paginator->links('reva::livewire-pagination')->toHtml();
        $this->assertStringContainsString('wire:click.prevent="gotoPage(3,', $reactive);
        $this->assertStringContainsString('href="/records?', $reactive);
        $simple = new Paginator(range(1, 6), 5, 1, ['path' => '/records']);
        $this->assertStringContainsString('rel="next"', $simple->links('reva::simple-pagination')->toHtml());
    }

    public function test_package_does_not_replace_the_app_pagination_default(): void
    {
        $this->assertNotSame('reva::pagination', Paginator::$defaultView);
    }
}
