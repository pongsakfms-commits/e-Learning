<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_admins_list(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get(route('admin.admins.index'));

        $response->assertOk();
        $response->assertViewIs('admin.admins.index');
    }

    public function test_student_cannot_access_admins_list(): void
    {
        $student = User::factory()->student()->create();

        $response = $this->actingAs($student)->get(route('admin.admins.index'));

        $response->assertForbidden();
    }

    public function test_admin_can_create_new_admin(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->post(route('admin.admins.store'), [
            'name' => 'New Admin',
            'email' => 'newadmin@example.com',
            'role' => User::ROLE_ADMIN,
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect(route('admin.admins.index'));
        $this->assertDatabaseHas('users', [
            'name' => 'New Admin',
            'email' => 'newadmin@example.com',
            'role' => User::ROLE_ADMIN,
        ]);
    }

    public function test_admin_can_edit_other_admin(): void
    {
        $admin = User::factory()->admin()->create(['name' => 'Main Admin']);
        $otherAdmin = User::factory()->admin()->create(['name' => 'Other Admin']);

        $response = $this->actingAs($admin)->get(route('admin.admins.edit', $otherAdmin));

        $response->assertOk();
        $response->assertViewIs('admin.admins.edit');
    }

    public function test_admin_cannot_edit_themselves(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get(route('admin.admins.edit', $admin));

        $response->assertForbidden();
    }

    public function test_admin_can_update_other_admin(): void
    {
        $admin = User::factory()->admin()->create(['name' => 'Main Admin']);
        $otherAdmin = User::factory()->admin()->create(['name' => 'Other Admin']);

        $response = $this->actingAs($admin)->put(route('admin.admins.update', $otherAdmin), [
            'name' => 'Updated Admin Name',
            'email' => $otherAdmin->email,
            'role' => User::ROLE_ADMIN,
        ]);

        $response->assertRedirect(route('admin.admins.index'));
        $this->assertDatabaseHas('users', [
            'id' => $otherAdmin->id,
            'name' => 'Updated Admin Name',
            'role' => User::ROLE_ADMIN,
        ]);
    }

    public function test_admin_can_update_other_admin_role(): void
    {
        $admin = User::factory()->admin()->create(['name' => 'Main Admin']);
        $otherAdmin = User::factory()->admin()->create(['name' => 'Other Admin']);

        $response = $this->actingAs($admin)->put(route('admin.admins.update', $otherAdmin), [
            'name' => 'Other Admin',
            'email' => $otherAdmin->email,
            'role' => User::ROLE_STUDENT,
        ]);

        $response->assertRedirect(route('admin.admins.index'));
        $this->assertDatabaseHas('users', [
            'id' => $otherAdmin->id,
            'role' => User::ROLE_STUDENT,
        ]);
    }

    public function test_admin_cannot_update_themselves(): void
    {
        $admin = User::factory()->admin()->create(['name' => 'Admin User']);

        $response = $this->actingAs($admin)->put(route('admin.admins.update', $admin), [
            'name' => 'Trying To Update',
            'email' => $admin->email,
            'role' => User::ROLE_ADMIN,
        ]);

        $response->assertForbidden();
        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
            'name' => 'Admin User',
        ]);
    }

    public function test_admin_can_delete_other_admin(): void
    {
        $admin = User::factory()->admin()->create();
        $otherAdmin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->delete(route('admin.admins.destroy', $otherAdmin));

        $response->assertRedirect(route('admin.admins.index'));
        $this->assertDatabaseMissing('users', [
            'id' => $otherAdmin->id,
        ]);
    }

    public function test_admin_cannot_delete_themselves(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->delete(route('admin.admins.destroy', $admin));

        $response->assertForbidden();
        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
        ]);
    }

    public function test_only_admin_role_users_shown_in_list(): void
    {
        $admin = User::factory()->admin()->create(['name' => 'First Admin']);
        $otherAdmin = User::factory()->admin()->create(['name' => 'Second Admin']);
        $student = User::factory()->student()->create(['name' => 'A Student User']);

        $response = $this->actingAs($admin)->get(route('admin.admins.index'));

        $response->assertOk();
        $response->assertSee($otherAdmin->name);
        $response->assertDontSee($student->name);
    }

    public function test_created_admin_has_correct_role(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post(route('admin.admins.store'), [
            'name' => 'New Admin',
            'email' => 'newadmin@example.com',
            'role' => User::ROLE_ADMIN,
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $newAdmin = User::where('email', 'newadmin@example.com')->first();

        $this->assertNotNull($newAdmin);
        $this->assertTrue($newAdmin->isAdmin());
        $this->assertFalse($newAdmin->isStudent());
    }

    public function test_admin_can_create_student_user(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->post(route('admin.admins.store'), [
            'name' => 'New Student',
            'email' => 'newstudent@example.com',
            'role' => User::ROLE_STUDENT,
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect(route('admin.admins.index'));
        $this->assertDatabaseHas('users', [
            'name' => 'New Student',
            'email' => 'newstudent@example.com',
            'role' => User::ROLE_STUDENT,
        ]);
    }
}
