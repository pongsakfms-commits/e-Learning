<?php

namespace App\Support;

use App\Models\User;

trait RedirectsToRoleDashboard
{
    protected function intendedDashboardRoute(?User $user): string
    {
        return match ($user?->role) {
            'admin' => route('admin.dashboard', absolute: false),
            default => route('student.dashboard', absolute: false),
        };
    }
}
