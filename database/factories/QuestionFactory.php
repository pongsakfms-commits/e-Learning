<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        return [
            'quiz_id' => Quiz::factory(),
            'question_text' => $this->faker->sentence(12),
            'explanation' => $this->faker->optional()->paragraph(),
            'question_type' => 'multiple_choice',
            'points' => $this->faker->numberBetween(1, 5),
            'display_order' => $this->faker->numberBetween(1, 20),
        ];
    }
}
