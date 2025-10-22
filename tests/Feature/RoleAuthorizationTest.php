<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_cannot_access_admin_dashboard(): void
    {
        $student = User::factory()->create();

        $response = $this->actingAs($student)->get('/admin/dashboard');

        $response->assertForbidden();
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get('/admin/dashboard');

        $response->assertOk();
    }

    public function test_admin_cannot_access_student_dashboard(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get('/student/dashboard');

        $response->assertForbidden();
    }

    public function test_student_can_access_student_dashboard(): void
    {
        $student = User::factory()->create();

        $response = $this->actingAs($student)->get('/student/dashboard');

        $response->assertOk();
    }
}
