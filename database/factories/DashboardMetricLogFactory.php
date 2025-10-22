<?php

namespace Database\Factories;

use App\Models\DashboardMetric;
use App\Models\DashboardMetricLog;
use Illuminate\Database\Eloquent\Factories\Factory;

class DashboardMetricLogFactory extends Factory
{
    protected $model = DashboardMetricLog::class;

    public function definition(): array
    {
        $previous = $this->faker->randomFloat(2, 0, 100);
        $new = $this->faker->randomFloat(2, 0, 100);

        return [
            'dashboard_metric_id' => DashboardMetric::factory(),
            'previous_value' => $previous,
            'new_value' => $new,
            'change_reason' => $this->faker->sentence(6),
            'meta' => [
                'trigger' => $this->faker->randomElement(['auto_update', 'manual_adjustment', 'system_migration']),
            ],
            'changed_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
