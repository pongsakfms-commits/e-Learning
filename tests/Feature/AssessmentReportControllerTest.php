<?php

namespace Tests\Feature;

use App\Mail\AssessmentResultMail;
use App\Models\Assessment;
use App\Models\AssessmentResult;
use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class AssessmentReportControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_allows_downloading_an_assessment_report(): void
    {
        $assessmentResult = $this->createAssessmentResult(passed: true);

        $response = $this->get(route('assessment-results.report', $assessmentResult));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/pdf');
        $this->assertStringContainsString('%PDF', $response->getContent());
    }

    public function test_it_prevents_certificate_download_for_non_passing_scores(): void
    {
        $assessmentResult = $this->createAssessmentResult(passed: false, percentage: 60);

        $response = $this->get(route('assessment-results.certificate', $assessmentResult));

        $response->assertForbidden();
    }

    public function test_it_can_email_reports_and_certificates(): void
    {
        Mail::fake();

        $assessmentResult = $this->createAssessmentResult(passed: true);
        $payload = [
            'emails' => ['learner@example.com', 'admin@example.com'],
            'type' => 'both',
        ];

        $response = $this->postJson(route('assessment-results.email', $assessmentResult), $payload);

        $response->assertOk()->assertJsonFragment([
            'message' => 'Assessment result PDFs queued for delivery.',
        ]);

        Mail::assertSent(AssessmentResultMail::class, 2);
    }

    private function createAssessmentResult(bool $passed, ?float $percentage = null): AssessmentResult
    {
        $course = Course::create([
            'title' => 'Advanced Algorithms',
            'description' => 'Explore complex algorithmic strategies.',
            'instructor' => 'Dr. Ada Lovelace',
            'duration_hours' => 48,
            'is_active' => true,
        ]);

        $assessment = Assessment::create([
            'course_id' => $course->id,
            'title' => 'Final Assessment',
            'description' => 'Comprehensive coverage of the course.',
            'total_points' => 100,
            'passing_score' => 70,
            'duration_minutes' => 120,
            'is_active' => true,
        ]);

        $user = User::factory()->create();

        $scorePercentage = $percentage ?? ($passed ? 85 : 55);
        $score = (int) round(($assessment->total_points * $scorePercentage) / 100);

        return AssessmentResult::create([
            'assessment_id' => $assessment->id,
            'user_id' => $user->id,
            'score' => $score,
            'total_points' => $assessment->total_points,
            'percentage' => $scorePercentage,
            'passed' => $passed,
            'time_spent_minutes' => 90,
            'completed_at' => now(),
        ]);
    }
}
