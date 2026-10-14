<?php

namespace Tests;

use App\Livewire\ProjectSearch;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Livewire\Livewire;

class WorkspaceTest extends TestCase
{
    use RefreshDatabase;

    private function user(array $overrides = []): User
    {
        return User::create(array_replace([
            'name' => 'Example User',
            'email' => 'user'.(User::count() + 1).'@example.test',
            'password' => 'a-long-test-password',
        ], $overrides));
    }

    public function test_guest_pages_render_and_workspace_requires_authentication(): void
    {
        $this->get('/login')->assertOk()->assertSee('name="email"', false)->assertSee('name="_token"', false);
        $this->get('/register')->assertOk()->assertSee('password_confirmation');
        $this->get('/projects')->assertRedirect('/login');
        $this->get('/preferences')->assertRedirect('/login');
        $this->get('/livewire')->assertRedirect('/login');
    }

    public function test_registration_hashes_password_and_authenticates_the_new_user(): void
    {
        $this->post('/register', ['name' => 'New User', 'email' => 'new@example.test', 'password' => 'a-long-test-password', 'password_confirmation' => 'a-long-test-password'])->assertRedirect('/projects');
        $user = User::firstOrFail();
        $this->assertAuthenticatedAs($user);
        $this->assertTrue(Hash::check('a-long-test-password', $user->password));
        $this->assertNotSame('a-long-test-password', $user->password);
    }

    public function test_login_failure_does_not_flash_password_and_logout_ends_session(): void
    {
        $user = $this->user();
        $this->from('/login')->post('/login', ['email' => $user->email, 'password' => 'wrong-password'])->assertRedirect('/login')->assertSessionHasErrors('email')->assertSessionMissing('_old_input.password');
        $this->post('/login', ['email' => $user->email, 'password' => 'a-long-test-password'])->assertRedirect('/projects');
        $this->assertAuthenticatedAs($user);
        $this->post('/logout')->assertRedirect('/login');
        $this->assertGuest();
    }

    public function test_projects_can_be_created_updated_and_deleted_by_the_owner(): void
    {
        $user = $this->user();
        $this->actingAs($user)->post('/projects', ['name' => 'First project', 'description' => 'Notes', 'status' => 'planned'])->assertRedirect('/projects');
        $project = $user->projects()->firstOrFail();
        $this->get('/projects')->assertOk()->assertSee('First project');
        $this->get('/projects/'.$project->id.'/edit')->assertOk()->assertSee('name="_method"', false);
        $this->put('/projects/'.$project->id, ['name' => 'Updated project', 'status' => 'active'])->assertRedirect('/projects');
        $this->assertDatabaseHas('projects', ['id' => $project->id, 'name' => 'Updated project']);
        $this->delete('/projects/'.$project->id)->assertRedirect('/projects');
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_other_users_projects_are_neither_visible_nor_editable(): void
    {
        $owner = $this->user();
        $other = $this->user();
        $private = $other->projects()->create(['name' => 'Other private project', 'status' => 'active']);
        $this->actingAs($owner)->get('/projects')->assertOk()->assertDontSee('Other private project');
        $this->get('/projects/'.$private->id.'/edit')->assertNotFound();
        $this->put('/projects/'.$private->id, ['name' => 'Changed', 'status' => 'active'])->assertNotFound();
        $this->delete('/projects/'.$private->id)->assertNotFound();
        $this->assertDatabaseHas('projects', ['id' => $private->id, 'name' => 'Other private project']);
    }

    public function test_validation_errors_render_visible_associated_field_messages(): void
    {
        $user = $this->user();
        $this->actingAs($user)->from('/projects')->post('/projects', ['name' => '', 'status' => 'invented'])->assertRedirect('/projects')->assertSessionHasErrors(['name', 'status']);
        $this->get('/projects')->assertOk()->assertSee('aria-invalid="true"', false)->assertSee('field-error')->assertSee('Please correct the following fields');
    }

    public function test_preferences_are_validated_persisted_and_scoped_to_the_user(): void
    {
        $user = $this->user();
        $other = $this->user();
        $settings = ['theme' => 'dark', 'palette' => 'mono', 'font' => 'system', 'shape' => 'pill', 'density' => 'compact', 'width' => 'full', 'motion' => 'none'];
        $this->actingAs($user)->get('/preferences')->assertOk();
        $this->put('/preferences', $settings)->assertRedirect();
        $this->assertSame($settings, $user->fresh()->preferences);
        $this->actingAs($user->fresh())->get('/projects')->assertOk()->assertSee('data-theme="dark"', false)->assertSee('data-font="system"', false);
        $this->put('/preferences', array_replace($settings, ['theme' => 'system']))->assertSessionHasErrors('theme');
        $this->assertSame('dark', $user->fresh()->preferences['theme']);
        $this->actingAs($other)->get('/projects')->assertOk()->assertSee('data-theme="auto"', false);
    }

    public function test_livewire_search_and_pagination_use_only_the_current_users_data(): void
    {
        $user = $this->user();
        $other = $this->user();
        foreach (range(1, 7) as $n) $user->projects()->create(['name' => 'Alpha '.$n, 'status' => 'active']);
        $user->projects()->create(['name' => 'Beta project', 'status' => 'planned']);
        $other->projects()->create(['name' => 'Private Alpha', 'status' => 'active']);
        $this->actingAs($user)->get('/livewire')->assertOk()->assertSee('wire:model.live.debounce.300ms', false);
        Livewire::actingAs($user)->test(ProjectSearch::class)
            ->set('search', 'Alpha')->assertSee('Alpha 7')->assertDontSee('Beta project')->assertDontSee('Private Alpha')
            ->call('gotoPage', 2)->assertSee('Alpha 1')
            ->set('search', 'Beta')->assertSee('Beta project')->assertDontSee('Alpha 1');
    }
}
