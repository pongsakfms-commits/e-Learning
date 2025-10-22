<?php

namespace Database\Seeders;

use App\Models\Answer;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class QuizPerformanceSeeder extends Seeder
{
    public function run(): void
    {
        $primaryStudent = User::query()->where('email', 'std001@example.com')->first();
        $otherStudents = User::query()
            ->where('email', '!=', 'admin@example.com')
            ->where('email', '!=', 'std001@example.com')
            ->get();

        $lessons = Lesson::query()
            ->with(['quizzes.questions.options'])
            ->orderBy('display_order')
            ->get();

        foreach ($lessons as $lesson) {
            foreach ($lesson->quizzes as $quiz) {
                if ($primaryStudent) {
                    $this->seedDeterministicAttempt($primaryStudent, $quiz);
                }

                foreach ($otherStudents as $otherStudent) {
                    if ($quiz->type !== 'post_test') {
                        continue;
                    }

                    $this->seedRandomisedAttempt($otherStudent, $quiz);
                }
            }
        }
    }

    protected function seedDeterministicAttempt(User $student, Quiz $quiz): void
    {
        $accuracyMap = [
            'pre_test' => 0.5,
            'post_test' => 0.92,
            'exercise' => 0.8,
        ];

        $questions = $quiz->questions;
        $maxScore = $questions->sum('points');
        $correctCountTarget = (int) round($questions->count() * ($accuracyMap[$quiz->type] ?? 0.75));

        $attempt = QuizAttempt::query()->firstOrNew([
            'quiz_id' => $quiz->id,
            'user_id' => $student->id,
            'attempt_number' => 1,
        ]);

        $awardedScore = 0;
        $correctSoFar = 0;

        $start = Carbon::now()->subDays(random_int(10, 30))->addMinutes(random_int(5, 90));
        $end = (clone $start)->addMinutes(random_int(10, 40));

        $attempt->fill([
            'status' => 'completed',
            'started_at' => $start,
            'completed_at' => $end,
        ]);
        $attempt->save();

        foreach ($questions as $index => $question) {
            $shouldBeCorrect = $correctSoFar < $correctCountTarget;
            $selectedOption = $shouldBeCorrect
                ? $question->options->firstWhere('is_correct', true)
                : $question->options->firstWhere('is_correct', false);

            if (!$selectedOption) {
                $selectedOption = $question->options->first();
            }

            $isCorrect = (bool) $selectedOption?->is_correct;
            $questionScore = $isCorrect ? ($question->points ?? 1) : 0;

            if ($isCorrect) {
                $correctSoFar++;
            }

            $awardedScore += $questionScore;

            Answer::query()->updateOrCreate(
                [
                    'quiz_attempt_id' => $attempt->id,
                    'question_id' => $question->id,
                ],
                [
                    'option_id' => $selectedOption?->id,
                    'answer_text' => null,
                    'is_correct' => $isCorrect,
                    'awarded_score' => $questionScore,
                ]
            );
        }

        $attempt->fill([
            'score' => $awardedScore,
            'max_score' => $maxScore,
            'percentage' => $maxScore > 0 ? round(($awardedScore / $maxScore) * 100, 2) : 0,
            'status' => $awardedScore >= ($quiz->passing_score * $maxScore / 100) ? 'passed' : 'failed',
            'is_passed' => $awardedScore >= ($quiz->passing_score * $maxScore / 100),
            'time_spent_seconds' => $attempt->completed_at?->diffInSeconds($attempt->started_at) ?? null,
        ]);

        $attempt->save();
    }

    protected function seedRandomisedAttempt(User $student, Quiz $quiz): void
    {
        $existing = QuizAttempt::query()->where([
            'quiz_id' => $quiz->id,
            'user_id' => $student->id,
            'attempt_number' => 1,
        ])->exists();

        if ($existing) {
            return;
        }

        $questions = $quiz->questions;
        $maxScore = $questions->sum('points');
        $awardedScore = 0;

        $start = Carbon::now()->subDays(random_int(15, 45))->addMinutes(random_int(5, 90));
        $end = (clone $start)->addMinutes(random_int(10, 50));

        $attempt = QuizAttempt::query()->create([
            'quiz_id' => $quiz->id,
            'user_id' => $student->id,
            'attempt_number' => 1,
            'status' => 'completed',
            'started_at' => $start,
            'completed_at' => $end,
        ]);

        foreach ($questions as $question) {
            $shouldBeCorrect = (bool) random_int(0, 1);
            $selectedOption = $shouldBeCorrect
                ? $question->options->firstWhere('is_correct', true)
                : $question->options->firstWhere('is_correct', false);

            if (!$selectedOption) {
                $selectedOption = $question->options->first();
            }

            $isCorrect = (bool) $selectedOption?->is_correct;
            $questionScore = $isCorrect ? ($question->points ?? 1) : 0;
            $awardedScore += $questionScore;

            Answer::query()->create([
                'quiz_attempt_id' => $attempt->id,
                'question_id' => $question->id,
                'option_id' => $selectedOption?->id,
                'answer_text' => null,
                'is_correct' => $isCorrect,
                'awarded_score' => $questionScore,
            ]);
        }

        $attempt->update([
            'score' => $awardedScore,
            'max_score' => $maxScore,
            'percentage' => $maxScore > 0 ? round(($awardedScore / $maxScore) * 100, 2) : 0,
            'status' => $awardedScore >= ($quiz->passing_score * $maxScore / 100) ? 'passed' : 'failed',
            'is_passed' => $awardedScore >= ($quiz->passing_score * $maxScore / 100),
            'time_spent_seconds' => $attempt->completed_at?->diffInSeconds($attempt->started_at) ?? null,
        ]);
    }
}
