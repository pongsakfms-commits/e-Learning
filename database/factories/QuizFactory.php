<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuizFactory extends Factory
{
    protected $model = Quiz::class;

    public function definition(): array
    {
        return [
            'lesson_id' => Lesson::factory(),
            'title' => $this->faker->sentence(4),
            'type' => $this->faker->randomElement(['pre_test', 'post_test', 'exercise']),
            'description' => $this->faker->optional()->paragraph(),
            'time_limit_minutes' => $this->faker->optional()->numberBetween(15, 60),
            'passing_score' => 70,
            'max_attempts' => $this->faker->optional()->numberBetween(1, 5),
            'is_active' => true,
        ];
    }
}
