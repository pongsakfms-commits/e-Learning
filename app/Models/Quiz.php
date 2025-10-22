<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'lesson_id',
        'title',
        'type',
        'description',
        'time_limit_minutes',
        'passing_score',
        'max_attempts',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class)->orderBy('display_order');
    }

    public function quizAttempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function scopeType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
