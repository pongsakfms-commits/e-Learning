<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $adminPassword = env('ADMIN_DEFAULT_PASSWORD');
        $studentPassword = env('STUDENT_DEFAULT_PASSWORD', 'password123');

        if (!User::where('email', 'admin@example.com')->exists()) {
            if (empty($adminPassword)) {
                $adminPassword = Str::random(16);
                $this->command?->warn(sprintf(
                    'Seeded admin credentials — email: %s password: %s',
                    'admin@example.com',
                    $adminPassword
                ));
            }

            User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'role' => User::ROLE_ADMIN,
                'password' => Hash::make($adminPassword),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]);
        }

        if (!User::where('email', 'student@example.com')->exists()) {
            User::create([
                'name' => 'Student User',
                'email' => 'student@example.com',
                'role' => User::ROLE_STUDENT,
                'password' => Hash::make($studentPassword ?: Str::random(16)),
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]);
        }
    }
}
