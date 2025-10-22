<?php

namespace Database\Factories;

use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class LessonFactory extends Factory
{
    protected $model = Lesson::class;

    public function definition(): array
    {
        $title = $this->faker->unique()->sentence(3);

        return [
            'slug' => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1, 999),
            'title' => $title,
            'description' => $this->faker->paragraph(),
            'duration_minutes' => $this->faker->numberBetween(30, 180),
            'level' => $this->faker->numberBetween(1, 5),
            'display_order' => $this->faker->numberBetween(1, 50),
            'is_active' => true,
        ];
    }
}
