<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assessment extends Model
{
    protected $fillable = [
        'course_id',
        'title',
        'description',
        'total_points',
        'passing_score',
        'duration_minutes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(AssessmentResult::class);
    }

    public function passingPercentage(): float
    {
        return ($this->passing_score / max($this->total_points, 1)) * 100;
    }
}
