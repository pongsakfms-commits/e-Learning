<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DashboardMetricLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'dashboard_metric_id',
        'previous_value',
        'new_value',
        'change_reason',
        'meta',
        'changed_at',
    ];

    protected $casts = [
        'meta' => 'array',
        'changed_at' => 'datetime',
    ];

    public function metric(): BelongsTo
    {
        return $this->belongsTo(DashboardMetric::class, 'dashboard_metric_id');
    }
}
