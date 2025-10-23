@csrf

<div class="mb-4">
    <x-input-label for="name" :value="__('Name')" />
    <x-text-input id="name" name="name" type="text" class="mt-1 block w-full" :value="old('name', $admin->name ?? '')" required autofocus />
    <x-input-error :messages="$errors->get('name')" class="mt-2" />
</div>

<div class="mb-4">
    <x-input-label for="email" :value="__('Email')" />
    <x-text-input id="email" name="email" type="email" class="mt-1 block w-full" :value="old('email', $admin->email ?? '')" required />
    <x-input-error :messages="$errors->get('email')" class="mt-2" />
</div>

<div class="mb-4">
    <x-input-label for="role" :value="__('Role')" />
    <select id="role" name="role" class="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" required>
        @foreach($availableRoles ?? [] as $roleKey => $roleLabel)
            <option value="{{ $roleKey }}" @selected(old('role', $admin->role ?? \App\Models\User::ROLE_ADMIN) === $roleKey)>
                {{ $roleLabel }}
            </option>
        @endforeach
    </select>
    <x-input-error :messages="$errors->get('role')" class="mt-2" />
</div>

<div class="mb-4">
    <x-input-label for="password" :value="__('Password')" />
    <x-text-input id="password" name="password" type="password" class="mt-1 block w-full" @if($isEdit ?? false) autocomplete="new-password" @endif @if(!($isEdit ?? false)) required @endif />
    <x-input-error :messages="$errors->get('password')" class="mt-2" />
    @if($isEdit ?? false)
        <p class="mt-1 text-sm text-gray-600">{{ __('Leave blank to keep current password') }}</p>
    @endif
</div>

<div class="mb-4">
    <x-input-label for="password_confirmation" :value="__('Confirm Password')" />
    <x-text-input id="password_confirmation" name="password_confirmation" type="password" class="mt-1 block w-full" @if(!($isEdit ?? false)) required @endif />
</div>

<div class="flex justify-end space-x-2">
    <a href="{{ route('admin.admins.index') }}" class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
        {{ __('Cancel') }}
    </a>
    <x-primary-button>
        {{ $submitLabel }}
    </x-primary-button>
</div>
