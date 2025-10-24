<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ __('Assessment Report') }}</title>
    <style>
        @page { margin: 24mm 20mm; }
        body { font-family: 'DejaVu Sans', sans-serif; color: #2b2b2b; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { font-size: 22px; margin: 0; color: #1b365d; text-transform: uppercase; letter-spacing: 3px; }
        .header p { margin: 4px 0; }
        .section { margin-bottom: 14px; }
        .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #1b365d; border-bottom: 1px solid #c7d1dc; padding-bottom: 4px; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px 10px; border-bottom: 1px solid #ecf0f5; vertical-align: top; }
        th { text-align: left; color: #1b365d; background: #f5f7fa; font-weight: 600; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 30px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
        .badge-success { background: #d6f5dc; color: #237d36; }
        .badge-danger { background: #ffe0e0; color: #b30021; }
        .highlight { font-size: 32px; font-weight: 700; color: #0a8754; margin: 0; }
        .muted { color: #6f7782; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .card { border: 1px solid #dfe4ea; border-radius: 8px; padding: 12px; background: #ffffff; }
        .card h4 { margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; color: #6f7782; letter-spacing: 1px; }
        .card p { margin: 0; font-size: 14px; font-weight: 600; color: #2b2b2b; }
        .footer { margin-top: 24px; font-size: 10px; text-align: center; color: #9aa3ad; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ config('app.name') }}</h1>
        <p>{{ __('Individual Assessment Report') }}</p>
        <p class="muted">{{ $result->completed_at?->format('d F Y, H:i') ?? __('Pending completion') }}</p>
    </div>

    <div class="section">
        <h2 class="section-title">{{ __('Learner Information') }}</h2>
        <table>
            <tr>
                <th>{{ __('Learner') }}</th>
                <td>{{ $user->name }}</td>
                <th>{{ __('Email') }}</th>
                <td>{{ $user->email }}</td>
            </tr>
            <tr>
                <th>{{ __('Course') }}</th>
                <td>{{ $course->title }}</td>
                <th>{{ __('Instructor') }}</th>
                <td>{{ $course->instructor ?? __('N/A') }}</td>
            </tr>
            <tr>
                <th>{{ __('Assessment') }}</th>
                <td>{{ $assessment->title }}</td>
                <th>{{ __('Duration') }}</th>
                <td>{{ $assessment->duration_minutes ? __(':minutes minutes', ['minutes' => $assessment->duration_minutes]) : __('Self-paced') }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2 class="section-title">{{ __('Performance Summary') }}</h2>
        <div class="grid">
            <div class="card" style="grid-column: span 2; text-align:center;">
                <h4>{{ __('Score') }}</h4>
                <p class="highlight">{{ $result->scoreLabel() }} ({{ number_format($result->percentage, 2) }}%)</p>
                <span class="badge {{ $result->passed ? 'badge-success' : 'badge-danger' }}">
                    {{ $result->passed ? __('Passed') : __('Not Passed') }}
                </span>
            </div>
            <div class="card">
                <h4>{{ __('Grade') }}</h4>
                <p>{{ $result->grade() }}</p>
            </div>
            <div class="card">
                <h4>{{ __('Time Spent') }}</h4>
                <p>{{ $result->time_spent_minutes ? __(':minutes minutes', ['minutes' => $result->time_spent_minutes]) : __('Not recorded') }}</p>
            </div>
            <div class="card">
                <h4>{{ __('Percentile') }}</h4>
                <p>{{ number_format($statistics['percentile'], 2) }}%</p>
            </div>
            <div class="card">
                <h4>{{ __('Rank') }}</h4>
                <p>{{ $statistics['rank'] }} / {{ $statistics['total_learners'] }}</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2 class="section-title">{{ __('Key Statistics') }}</h2>
        <table>
            <tr>
                <th>{{ __('Average Score') }}</th>
                <td>{{ number_format($statistics['average_percentage'], 2) }}%</td>
                <th>{{ __('Median Score') }}</th>
                <td>{{ number_format($statistics['median_percentage'], 2) }}%</td>
            </tr>
            <tr>
                <th>{{ __('Highest Score') }}</th>
                <td>{{ number_format($statistics['highest_percentage'], 2) }}%</td>
                <th>{{ __('Lowest Score') }}</th>
                <td>{{ number_format($statistics['lowest_percentage'], 2) }}%</td>
            </tr>
            <tr>
                <th>{{ __('Passing Threshold') }}</th>
                <td colspan="3">{{ number_format($statistics['passing_percentage'], 2) }}%</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2 class="section-title">{{ __('Additional Notes') }}</h2>
        <p class="muted">
            {{ __('This report is generated electronically. Contact your instructor or program administrator if you have questions about your performance or feedback related to this assessment.') }}
        </p>
    </div>

    <div class="footer">
        {{ __('Generated on :date by :app', ['date' => now()->format('d F Y H:i'), 'app' => config('app.name')]) }}
    </div>
</body>
</html>
