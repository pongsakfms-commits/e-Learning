<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'description',
        'duration_minutes',
        'level',
        'prerequisite_lesson_id',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function sections(): HasMany
    {
        return $this->hasMany(Section::class)->orderBy('display_order');
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }

    public function prerequisite(): BelongsTo
    {
        return $this->belongsTo(self::class, 'prerequisite_lesson_id');
    }

    public function dependents(): HasMany
    {
        return $this->hasMany(self::class, 'prerequisite_lesson_id');
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function quizAttempts(): HasManyThrough
    {
        return $this->hasManyThrough(QuizAttempt::class, Quiz::class);
    }
}
