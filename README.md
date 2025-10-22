# E-Learning Platform

A Laravel 12 starter project prepared for building an e-learning system. The repository comes with the baseline Laravel folder structure, PSR-4 autoload configuration, and core dependencies such as Fortify, Breeze, DOMPDF, and Google API client ready for further development.

## Prerequisites

Make sure the following tools are installed locally:

- PHP 8.2 or higher with required extensions (OpenSSL, PDO, Mbstring, Tokenizer, XML, Ctype, JSON, BCMath)
- [Composer](https://getcomposer.org/)
- Node.js 18+ and npm (for handling front-end assets)
- A database server (MySQL or MariaDB recommended)

## Getting Started

```bash
# 1. Clone the repository
git clone <repository-url>
cd <repository-directory>

# 2. Install PHP dependencies
composer install

# 3. Copy environment template and generate the application key
cp .env.example .env
php artisan key:generate

# 4. Update the .env file with your database, mail, and Google API credentials

# 5. Run database migrations (create the database first if it does not exist)
php artisan migrate

# 6. Install front-end dependencies (optional at this stage)
npm install
npm run dev

# 7. Start the local development server
php artisan serve
```

## Environment Configuration

The `.env.example` file contains a prepared configuration for:

### Database

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=elearning
DB_USERNAME=elearning_user
DB_PASSWORD=
```

Create the database (e.g., `elearning`) and supply the actual credentials in your `.env` file before running migrations.

### Mail

```
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="no-reply@elearning.local"
MAIL_FROM_NAME="${APP_NAME}"
```

Update the values to match the mail provider you use in development or production.

### Google API

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"
GOOGLE_APPLICATION_NAME="${APP_NAME}"
GOOGLE_API_KEY=
```

Generate credentials in the Google Cloud Console and provide the values to enable Google-based integrations (for example, Google Classroom connectivity or OAuth login).

## Included Packages

- **Laravel Fortify** – authentication backend services
- **Laravel Breeze** – lightweight frontend scaffolding for Fortify (install using `php artisan breeze:install` when ready)
- **barryvdh/laravel-dompdf** – PDF generation utilities
- **google/apiclient** – official Google API PHP client

These packages are installed but not yet configured, allowing the team to wire them up as the e-learning modules are developed.

## Next Steps

- Configure authentication flows (e.g., run `php artisan breeze:install` for starter UI scaffolding).
- Define course, lesson, and enrollment domain models.
- Add seeders and factories for initial data.
- Integrate Google services as needed (such as Classroom synchronization or Calendar events).

Happy building!
