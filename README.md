# e-Learning Python Curriculum

A Laravel-ready data layer for an online Python learning platform. The repository now contains database migrations, Eloquent models, factories, and seeders that power lessons, assessments, certification, and analytics dashboards.

## Features

- **Comprehensive ERD** covering users, roles, lessons, sections, quizzes, questions, options, quiz attempts, answers, certificates, and dashboard metrics/logs. See [`docs/erd.md`](docs/erd.md) for details.
- **Migrations** that establish relationships, constraints, and sensible defaults for all entities.
- **Eloquent models** with expressive relationships for consuming lesson content, grading assessments, issuing certificates, and aggregating analytics.
- **Seeders** that bootstrap:
  - Nine Python lessons with structured sections and resources
  - Standard pre-test, post-test, and practice quizzes per lesson
  - Default administrator (`admin@example.com`) and primary learner (`std001@example.com`) accounts
  - Example quiz attempts, answers, certificates, and dashboard metrics for testing reports
- **Factories** for generating realistic demo data when running feature tests or expanding seed datasets.

## Usage

1. Install dependencies and configure your Laravel application as usual.
2. Run migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```
3. Log in with the seeded accounts or expand the dataset using the included factories.

### Seeded Credentials

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@example.com` | `Admin@12345` |
| Primary learner | `std001@example.com` | `Std001@12345` |

The seeded data provides a complete learning journey for `std001@example.com`, sample performance for additional learners, and dashboard metrics that mirror real-world analytics scenarios.
