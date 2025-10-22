<?php

namespace Database\Factories;

use App\Models\DashboardMetric;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DashboardMetricFactory extends Factory
{
    protected $model = DashboardMetric::class;

    public function definition(): array
    {
        $metricKey = $this->faker->randomElement([
            'average_score',
            'completion_rate',
            'active_days',
            'attempt_count',
            'certificates_earned',
        ]);

        return [
            'user_id' => User::factory(),
            'lesson_id' => $this->faker->boolean(70) ? Lesson::factory() : null,
            'metric_key' => $metricKey,
            'numeric_value' => $this->faker->randomFloat(2, 0, 100),
            'meta' => [
                'source' => $this->faker->randomElement(['system', 'imported', 'manual']),
            ],
            'recorded_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
