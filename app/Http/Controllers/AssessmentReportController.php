<?php

namespace App\Http\Controllers;

use App\Mail\AssessmentResultMail;
use App\Models\AssessmentResult;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Mail;

class AssessmentReportController extends Controller
{
    public function downloadReport(AssessmentResult $assessmentResult): Response
    {
        $assessmentResult->load(['assessment.course', 'user']);

        $pdf = Pdf::loadView('pdf.assessment-report', [
            'result' => $assessmentResult,
            'assessment' => $assessmentResult->assessment,
            'course' => $assessmentResult->assessment->course,
            'user' => $assessmentResult->user,
            'statistics' => $this->prepareStatistics($assessmentResult),
        ])->setPaper('a4');

        $filename = sprintf('assessment-report-%s.pdf', $assessmentResult->id);

        return new Response($pdf->stream($filename), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "inline; filename=\"{$filename}\"",
        ]);
    }

    public function downloadCertificate(AssessmentResult $assessmentResult): Response
    {
        $assessmentResult->load(['assessment.course', 'user']);

        if (! $assessmentResult->passed) {
            abort(403, __('This learner did not meet the passing score for a certificate.'));
        }

        $pdf = Pdf::loadView('pdf.certificate', [
            'result' => $assessmentResult,
            'assessment' => $assessmentResult->assessment,
            'course' => $assessmentResult->assessment->course,
            'user' => $assessmentResult->user,
        ])->setPaper('a4', 'landscape');

        $filename = sprintf('certificate-%s.pdf', $assessmentResult->id);

        return new Response($pdf->stream($filename), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "inline; filename=\"{$filename}\"",
        ]);
    }

    public function emailReport(Request $request, AssessmentResult $assessmentResult): JsonResponse
    {
        $validated = $request->validate([
            'emails' => ['required', 'array', 'min:1'],
            'emails.*' => ['email'],
            'type' => ['nullable', 'in:report,certificate,both'],
        ]);

        $type = $validated['type'] ?? 'report';
        $assessmentResult->load(['assessment.course', 'user']);

        $attachReport = in_array($type, ['report', 'both'], true);
        $attachCertificate = in_array($type, ['certificate', 'both'], true) && $assessmentResult->passed;

        if (! $attachReport && ! $attachCertificate) {
            abort(400, __('No PDF attachments can be generated with the provided parameters.'));
        }

        $attachments = [];

        if ($attachReport) {
            $attachments['report'] = Pdf::loadView('pdf.assessment-report', [
                'result' => $assessmentResult,
                'assessment' => $assessmentResult->assessment,
                'course' => $assessmentResult->assessment->course,
                'user' => $assessmentResult->user,
                'statistics' => $this->prepareStatistics($assessmentResult),
            ])->output();
        }

        if ($attachCertificate) {
            $attachments['certificate'] = Pdf::loadView('pdf.certificate', [
                'result' => $assessmentResult,
                'assessment' => $assessmentResult->assessment,
                'course' => $assessmentResult->assessment->course,
                'user' => $assessmentResult->user,
            ])->setPaper('a4', 'landscape')->output();
        }

        foreach ($validated['emails'] as $email) {
            Mail::to($email)->send(new AssessmentResultMail($assessmentResult, $attachments));
        }

        return response()->json([
            'message' => __('Assessment result PDFs queued for delivery.'),
            'sent_to' => $validated['emails'],
        ]);
    }

    protected function prepareStatistics(AssessmentResult $assessmentResult): array
    {
        $assessment = $assessmentResult->assessment;

        $allResults = $assessment->results()->with('user')->get();

        $scores = $allResults->pluck('percentage')->filter(static fn ($value) => $value !== null);
        $average = $scores->avg() ?? 0;
        $highest = $scores->max() ?? 0;
        $lowest = $scores->min() ?? 0;
        $median = $scores->median() ?? 0;

        $sortedResults = $allResults->sortByDesc('percentage')->values();
        $position = $sortedResults
            ->pluck('id')
            ->search($assessmentResult->id);
        $rank = $position === false ? 1 : $position + 1;
        $totalLearners = max($scores->count(), 1);

        $percentile = $totalLearners > 1
            ? round((1 - (($rank - 1) / $totalLearners)) * 100, 2)
            : 100;

        return [
            'average_percentage' => round($average, 2),
            'highest_percentage' => round($highest, 2),
            'lowest_percentage' => round($lowest, 2),
            'median_percentage' => round($median, 2),
            'rank' => $rank,
            'total_learners' => $totalLearners,
            'percentile' => $percentile,
            'passing_percentage' => $assessment->passingPercentage(),
        ];
    }
}
