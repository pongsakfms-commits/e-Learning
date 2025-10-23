# e-Learning Authentication & Authorization

This Laravel application provides session-based authentication with role-aware dashboards for **students** and **administrators**.

## Features

- Laravel Breeze Blade scaffolding for login, registration and password management.
- Role-based access control via a custom `role` middleware.
- Distinct dashboards for students and admins with automatic login redirects.
- Password hashing handled by Laravel's hashing facilities.
- Database seeders that provision one administrator and one student test account.
- Admin management CRUD with permissions to prevent self-edit scenarios.

## Getting Started

### Prerequisites

- PHP 8.3+
- Composer
- Node.js 20+

### Installation

```bash
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
npm install
npm run dev # optional – run Vite for asset bundling
```

The database seeder creates the following users (passwords are hashed automatically during seeding):

| Role   | Email               | Password |
|--------|---------------------|----------|
| Admin  | admin@example.com   | password |
| Student| student@example.com | password |

## Usage

- Visit `/login` to authenticate. After login, users are redirected to the dashboard that matches their role.
- Admin pages are available under `/admin/*` and are protected by the `role:admin` middleware.
- Student pages live under `/student/*` and are protected by `role:student` middleware.

## Testing

```bash
php artisan test
```

The feature test suite covers authentication flows, role-based redirects and authorization guards.
