<?php

namespace Database\Factories;

use App\Models\Option;
use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

class OptionFactory extends Factory
{
    protected $model = Option::class;

    public function definition(): array
    {
        return [
            'question_id' => Question::factory(),
            'option_text' => $this->faker->sentence(6),
            'is_correct' => false,
            'display_order' => $this->faker->numberBetween(1, 4),
        ];
    }

    public function correct(): self
    {
        return $this->state(fn () => [
            'is_correct' => true,
        ]);
    }
}
