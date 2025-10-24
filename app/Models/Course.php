<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    protected $fillable = [
        'title',
        'description',
        'instructor',
        'duration_hours',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function assessments(): HasMany
    {
        return $this->hasMany(Assessment::class);
    }
}
