<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function view(User $user, User $model): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function create(User $user): bool
    {
        return $user->role === User::ROLE_ADMIN;
    }

    public function update(User $user, User $model): bool
    {
        if ($user->role !== User::ROLE_ADMIN) {
            return false;
        }

        if ($user->id === $model->id) {
            return false;
        }

        if ($model->role !== User::ROLE_ADMIN) {
            return false;
        }

        return true;
    }

    public function delete(User $user, User $model): bool
    {
        if ($user->role !== User::ROLE_ADMIN) {
            return false;
        }

        if ($user->id === $model->id) {
            return false;
        }

        if ($model->role !== User::ROLE_ADMIN) {
            return false;
        }

        return true;
    }
}
