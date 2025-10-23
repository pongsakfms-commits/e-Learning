<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class AdminController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', User::class);

        $admins = User::where('role', User::ROLE_ADMIN)
            ->orderBy('name')
            ->paginate(10);

        return view('admin.admins.index', [
            'admins' => $admins,
            'roleLabels' => User::availableRoles(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', User::class);

        return view('admin.admins.create', [
            'availableRoles' => User::availableRoles(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'role' => ['required', Rule::in(array_keys(User::availableRoles()))],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('admin.admins.index')
            ->with('success', 'Admin created successfully.');
    }

    public function edit(User $admin)
    {
        $this->authorize('update', $admin);

        return view('admin.admins.edit', [
            'admin' => $admin,
            'availableRoles' => User::availableRoles(),
        ]);
    }

    public function update(Request $request, User $admin)
    {
        $this->authorize('update', $admin);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $admin->id],
            'role' => ['required', Rule::in(array_keys(User::availableRoles()))],
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
        ]);

        $admin->name = $validated['name'];
        $admin->email = $validated['email'];
        $admin->role = $validated['role'];

        if (!empty($validated['password'])) {
            $admin->password = Hash::make($validated['password']);
        }

        $admin->save();

        return redirect()->route('admin.admins.index')
            ->with('success', 'Admin updated successfully.');
    }

    public function destroy(User $admin)
    {
        $this->authorize('delete', $admin);

        $admin->delete();

        return redirect()->route('admin.admins.index')
            ->with('success', 'Admin deleted successfully.');
    }
}
