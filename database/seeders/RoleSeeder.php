<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'display_name' => 'Administrator',
                'description' => 'System administrator with full permissions.',
            ],
            [
                'name' => 'student',
                'display_name' => 'Student',
                'description' => 'Learner enrolled in Python lessons.',
            ],
        ];

        foreach ($roles as $role) {
            Role::query()->updateOrCreate(
                ['name' => $role['name']],
                $role
            );
        }
    }
}
