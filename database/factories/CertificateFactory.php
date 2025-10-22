<?php

namespace Database\Factories;

use App\Models\Certificate;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CertificateFactory extends Factory
{
    protected $model = Certificate::class;

    public function definition(): array
    {
        $issuedAt = $this->faker->dateTimeBetween('-3 months', 'now');

        return [
            'user_id' => User::factory(),
            'lesson_id' => Lesson::factory(),
            'certificate_code' => strtoupper(Str::random(10)),
            'status' => 'issued',
            'score' => $this->faker->randomFloat(2, 60, 100),
            'issued_at' => $issuedAt,
            'expires_at' => $this->faker->boolean(30)
                ? $this->faker->dateTimeBetween($issuedAt, '+1 year')
                : null,
            'metadata' => [
                'issuer' => 'System',
                'notes' => $this->faker->optional()->sentence(),
            ],
        ];
    }
}
