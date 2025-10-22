<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DashboardMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lesson_id',
        'metric_key',
        'numeric_value',
        'meta',
        'recorded_at',
    ];

    protected $casts = [
        'meta' => 'array',
        'recorded_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(DashboardMetricLog::class);
    }
}
