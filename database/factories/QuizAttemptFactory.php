<?php

namespace Database\Factories;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuizAttemptFactory extends Factory
{
    protected $model = QuizAttempt::class;

    public function definition(): array
    {
        $maxScore = $this->faker->numberBetween(5, 100);
        $score = $this->faker->numberBetween(0, $maxScore);
        $percentage = $maxScore > 0 ? round(($score / $maxScore) * 100, 2) : 0;

        return [
            'quiz_id' => Quiz::factory(),
            'user_id' => User::factory(),
            'attempt_number' => $this->faker->numberBetween(1, 3),
            'score' => $score,
            'max_score' => $maxScore,
            'percentage' => $percentage,
            'status' => $percentage >= 70 ? 'passed' : 'failed',
            'is_passed' => $percentage >= 70,
            'time_spent_seconds' => $this->faker->numberBetween(120, 3600),
            'started_at' => $this->faker->dateTimeBetween('-2 months', '-1 day'),
            'completed_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
