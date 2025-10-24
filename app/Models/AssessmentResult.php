<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentResult extends Model
{
    protected $fillable = [
        'assessment_id',
        'user_id',
        'score',
        'total_points',
        'percentage',
        'passed',
        'time_spent_minutes',
        'completed_at',
    ];

    protected $casts = [
        'percentage' => 'float',
        'passed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scoreLabel(): string
    {
        return sprintf('%d / %d', $this->score, $this->total_points);
    }

    public function completionDate(): ?string
    {
        return $this->completed_at?->format('d M Y H:i');
    }

    public function grade(): string
    {
        return match (true) {
            $this->percentage >= 90 => 'A',
            $this->percentage >= 80 => 'B',
            $this->percentage >= 70 => 'C',
            $this->percentage >= 60 => 'D',
            default => 'F',
        };
    }
}
