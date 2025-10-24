# e-Learning Platform

This repository contains the e-Learning platform with support for generating PDF-based assessment reports and certificates for learners.

## Key Features

- **PDF Assessment Reports** – Generate detailed performance reports for each learner, including statistics such as percentile, rank, and average scores.
- **Certificates of Achievement** – Automatically generate certificates for learners who meet the passing threshold (default 70%).
- **Email Delivery** – Send PDF reports and certificates directly to learners or administrators via email.
- **Demo Data Seeder** – Populate the database with sample courses, assessments, learners, and results for testing and demonstration.

## Getting Started

### Requirements

- PHP 8.2+
- Composer
- SQLite/MySQL/PostgreSQL (SQLite used by default)
- Node.js & npm (for frontend asset pipelines if required)

### Installation

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Update your `.env` file with the correct database and mail settings. For local development with SQLite, ensure the database file exists:

```bash
touch database/database.sqlite
```

### Database

Run the migrations to create the required tables:

```bash
php artisan migrate
```

Seed demo data for quick testing:

```bash
php artisan db:seed --class=DemoDataSeeder
```

This creates sample learners, courses, an assessment, and populated assessment results.

### PDF Generation

We use the [barryvdh/laravel-dompdf](https://github.com/barryvdh/laravel-dompdf) package. Configuration is available in `config/dompdf.php`.

### Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/assessment-results/{assessmentResult}/report` | GET | Download the learner's assessment report |
| `/assessment-results/{assessmentResult}/certificate` | GET | Download the learner's certificate (only if passed) |
| `/assessment-results/{assessmentResult}/email` | POST | Email the report and/or certificate |

Refer to [README_PDF_REPORTS.md](README_PDF_REPORTS.md) for detailed documentation of the feature set, template customization, and API usage examples.

## Development

### Running the Application

```bash
php artisan serve
```

(Optional) Run the queue worker if you configure mail to queue:

```bash
php artisan queue:work
```

### Testing

Run the automated test suite:

```bash
php artisan test
```

## License

This project is open source software released under the [MIT license](LICENSE).
