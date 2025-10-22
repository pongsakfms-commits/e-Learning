<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEaMlIeG8EMLiB6Z0i36y5Zol6i', // password
            'student_code' => strtoupper(Str::random(6)),
            'is_active' => true,
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): self
    {
        return $this->state(fn () => [
            'email_verified_at' => null,
        ]);
    }
}
