<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::query()->where('name', 'admin')->first();
        $studentRole = Role::query()->where('name', 'student')->first();

        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('Admin@12345'),
                'student_code' => null,
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        $student = User::query()->updateOrCreate(
            ['email' => 'std001@example.com'],
            [
                'name' => 'Student 001',
                'password' => Hash::make('Std001@12345'),
                'student_code' => 'STD001',
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        if ($adminRole) {
            $admin->roles()->syncWithoutDetaching([$adminRole->id]);
        }

        if ($studentRole) {
            $student->roles()->syncWithoutDetaching([$studentRole->id]);
        }

        User::factory()
            ->count(5)
            ->create()
            ->each(function (User $user) use ($studentRole) {
                if ($studentRole) {
                    $user->roles()->attach($studentRole->id);
                }

                if (!$user->student_code) {
                    $user->update([
                        'student_code' => strtoupper(Str::random(6)),
                    ]);
                }
            });
    }
}
