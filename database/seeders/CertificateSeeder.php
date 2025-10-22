<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\Lesson;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::query()->where('email', 'std001@example.com')->first();

        if (!$student) {
            return;
        }

        $lessons = Lesson::query()
            ->orderBy('display_order')
            ->take(3)
            ->get();

        foreach ($lessons as $lesson) {
            Certificate::query()->updateOrCreate(
                [
                    'user_id' => $student->id,
                    'lesson_id' => $lesson->id,
                ],
                [
                    'certificate_code' => strtoupper(Str::random(12)),
                    'status' => 'issued',
                    'score' => 95,
                    'issued_at' => now()->subDays(3 - $lesson->display_order),
                    'expires_at' => null,
                    'metadata' => [
                        'generated_by' => 'system',
                        'note' => 'Auto-issued after post-test completion.',
                    ],
                ]
            );
        }
    }
}
