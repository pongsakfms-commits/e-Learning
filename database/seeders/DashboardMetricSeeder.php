<?php

namespace Database\Seeders;

use App\Models\DashboardMetric;
use App\Models\DashboardMetricLog;
use App\Models\Lesson;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DashboardMetricSeeder extends Seeder
{
    public function run(): void
    {
        $students = User::query()
            ->where('email', '!=', 'admin@example.com')
            ->get();

        $lessons = Lesson::query()->orderBy('display_order')->get();

        foreach ($students as $student) {
            foreach ($lessons as $lesson) {
                $attempts = QuizAttempt::query()
                    ->where('user_id', $student->id)
                    ->whereHas('quiz', fn ($query) => $query->where('lesson_id', $lesson->id))
                    ->get();

                if ($attempts->isEmpty()) {
                    continue;
                }

                $averageScore = round($attempts->avg('percentage'), 2);
                $passed = $attempts->where('is_passed', true)->count();
                $total = $attempts->count();

                $metric = DashboardMetric::query()->updateOrCreate(
                    [
                        'user_id' => $student->id,
                        'lesson_id' => $lesson->id,
                        'metric_key' => 'average_score',
                        'recorded_at' => $this->metricRecordedAt($lesson->display_order),
                    ],
                    [
                        'numeric_value' => $averageScore,
                        'meta' => [
                            'attempts' => $total,
                            'successful_attempts' => $passed,
                        ],
                    ]
                );

                DashboardMetricLog::query()->create([
                    'dashboard_metric_id' => $metric->id,
                    'previous_value' => max(0, $averageScore - random_int(5, 15)),
                    'new_value' => $averageScore,
                    'change_reason' => 'Automated recalculation after new quiz attempts.',
                    'meta' => [
                        'attempts_considered' => $total,
                        'generated_at' => now()->toDateTimeString(),
                    ],
                    'changed_at' => now(),
                ]);

                $completionMetric = DashboardMetric::query()->updateOrCreate(
                    [
                        'user_id' => $student->id,
                        'lesson_id' => $lesson->id,
                        'metric_key' => 'completion_rate',
                        'recorded_at' => $this->metricRecordedAt($lesson->display_order, 1),
                    ],
                    [
                        'numeric_value' => round(($passed / max(1, $total)) * 100, 2),
                        'meta' => [
                            'attempts' => $total,
                            'completed' => $passed,
                        ],
                    ]
                );

                DashboardMetricLog::query()->create([
                    'dashboard_metric_id' => $completionMetric->id,
                    'previous_value' => max(0, $completionMetric->numeric_value - random_int(1, 10)),
                    'new_value' => $completionMetric->numeric_value,
                    'change_reason' => 'Completion rate updated after learner activity.',
                    'meta' => [
                        'source' => 'system',
                    ],
                    'changed_at' => now(),
                ]);
            }
        }

        $this->seedGlobalMetrics();
    }

    protected function seedGlobalMetrics(): void
    {
        $globalAverage = round(QuizAttempt::query()->avg('percentage') ?? 0, 2);
        $totalAttempts = QuizAttempt::query()->count();

        $metric = DashboardMetric::query()->updateOrCreate(
            [
                'user_id' => null,
                'lesson_id' => null,
                'metric_key' => 'platform_average_score',
                'recorded_at' => now()->startOfDay(),
            ],
            [
                'numeric_value' => $globalAverage,
                'meta' => [
                    'total_attempts' => $totalAttempts,
                ],
            ]
        );

        DashboardMetricLog::query()->create([
            'dashboard_metric_id' => $metric->id,
            'previous_value' => max(0, $globalAverage - random_int(2, 8)),
            'new_value' => $globalAverage,
            'change_reason' => 'Daily platform average recomputed.',
            'meta' => [
                'attempts' => $totalAttempts,
            ],
            'changed_at' => now(),
        ]);
    }

    protected function metricRecordedAt(int $offset, int $deltaDays = 0): Carbon
    {
        $base = now()->startOfDay()->subDays(max(0, 5 - $offset));

        return (clone $base)->addDays($deltaDays);
    }
}
