# PDF Test Reports and Certificates Feature

This document describes the PDF test report and certificate generation feature for the e-Learning platform.

## Features

### 1. Assessment Reports
- Individual score reports with detailed statistics
- Performance summary including score, percentage, grade, and rank
- Key statistics: average, median, highest, lowest scores
- Percentile ranking among all test-takers
- Professional PDF layout with tables and charts

### 2. Certificates
- Automatic certificate generation for passing students (≥70% by default)
- Professional certificate design with learner name, course, and assessment details
- Unique certificate ID for verification
- Landscape orientation for traditional certificate appearance

### 3. Delivery Options
- **Download**: Direct PDF download via web interface
- **Email**: Send reports and certificates to one or multiple email addresses
- Support for sending both report and certificate in a single email

## Installation and Setup

### 1. Package Installation
The Dompdf package is already installed via Composer:
```bash
composer require barryvdh/laravel-dompdf
```

### 2. Configuration
Configuration file is published at `config/dompdf.php`. Default settings are suitable for most use cases.

### 3. Database Schema
Run migrations to create the necessary database tables:
```bash
php artisan migrate
```

Tables created:
- `courses` - Course information
- `assessments` - Test/quiz definitions with passing criteria
- `assessment_results` - Individual test results and scores

### 4. Demo Data
Seed the database with sample data for testing:
```bash
php artisan db:seed --class=DemoDataSeeder
```

This creates:
- 10 sample students
- 3 courses
- 1 assessment with 10 results (mixed passing and failing)

## API Endpoints

### Download Assessment Report
```
GET /assessment-results/{assessmentResult}/report
```
Downloads the assessment report as PDF.

**Parameters:**
- `assessmentResult` - Assessment result ID

**Response:** PDF file

### Download Certificate
```
GET /assessment-results/{assessmentResult}/certificate
```
Downloads the certificate as PDF (only for passing students).

**Parameters:**
- `assessmentResult` - Assessment result ID

**Response:** PDF file or 403 error if student did not pass

### Email Report/Certificate
```
POST /assessment-results/{assessmentResult}/email
```
Sends assessment report and/or certificate via email.

**Parameters:**
- `assessmentResult` - Assessment result ID
- `emails` - Array of email addresses (required)
- `type` - Optional: 'report', 'certificate', or 'both' (default: 'report')

**Request Example:**
```json
{
  "emails": ["student@example.com", "admin@example.com"],
  "type": "both"
}
```

**Response:**
```json
{
  "message": "Assessment result PDFs queued for delivery.",
  "sent_to": ["student@example.com", "admin@example.com"]
}
```

## Usage Examples

### Download Report (PHP)
```php
use App\Models\AssessmentResult;

$result = AssessmentResult::find(1);
return redirect()->route('assessment-results.report', $result);
```

### Download Certificate (PHP)
```php
use App\Models\AssessmentResult;

$result = AssessmentResult::find(1);
if ($result->passed) {
    return redirect()->route('assessment-results.certificate', $result);
}
```

### Send Email (cURL)
```bash
curl -X POST http://localhost:8000/assessment-results/1/email \
  -H "Content-Type: application/json" \
  -d '{
    "emails": ["student@example.com"],
    "type": "both"
  }'
```

## Templates

### Assessment Report Template
Location: `resources/views/pdf/assessment-report.blade.php`

Features:
- Learner and course information
- Performance summary with score, percentage, grade
- Rank and percentile among peers
- Key statistics (average, median, highest, lowest)
- Professional styling with tables and badges

### Certificate Template
Location: `resources/views/pdf/certificate.blade.php`

Features:
- Elegant certificate design with border
- Recipient name prominently displayed
- Course and assessment details
- Score and grade
- Verification seal
- Certificate ID and issue date
- Landscape orientation

### Email Template
Location: `resources/views/emails/assessment-result.blade.php`

Features:
- Personalized greeting
- Summary of results
- Information about attachments
- Professional email layout using Laravel's built-in mail components

## Passing Criteria

Default passing score is 70% (configurable per assessment).

**Setting passing score:**
```php
$assessment = Assessment::create([
    'title' => 'Final Exam',
    'total_points' => 100,
    'passing_score' => 70,  // 70 points = 70%
    // ... other fields
]);
```

Only students who achieve the passing score can download/receive certificates.

## Statistics Calculation

The system automatically calculates comprehensive statistics for each assessment:

- **Average Score**: Mean of all student scores
- **Median Score**: Middle value of all scores
- **Highest Score**: Best performance
- **Lowest Score**: Lowest performance
- **Rank**: Student's position when sorted by score (descending)
- **Percentile**: Student's performance relative to peers

## Customization

### Modify PDF Appearance
Edit the Blade templates in `resources/views/pdf/`:
- Adjust CSS styles for different colors, fonts, layouts
- Add your organization's logo or branding
- Modify the data displayed in reports

### Change Passing Criteria
Modify the `passing_score` field in the `assessments` table or update the model's `passingPercentage()` method.

### Email Customization
Edit `resources/views/emails/assessment-result.blade.php` to customize:
- Email content and messaging
- Language and tone
- Additional information or links

### PDF Configuration
Edit `config/dompdf.php` to configure:
- Paper size and orientation
- Font directories
- Image paths
- DPI and rendering options

## Mail Configuration

Configure email settings in `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## Models

### Course
```php
$course->title
$course->description
$course->instructor
$course->duration_hours
$course->assessments  // Relationship to assessments
```

### Assessment
```php
$assessment->title
$assessment->total_points
$assessment->passing_score
$assessment->duration_minutes
$assessment->course  // Relationship to course
$assessment->results  // Relationship to results
$assessment->passingPercentage()  // Calculated passing percentage
```

### AssessmentResult
```php
$result->score
$result->total_points
$result->percentage
$result->passed  // Boolean
$result->time_spent_minutes
$result->completed_at
$result->assessment  // Relationship to assessment
$result->user  // Relationship to user
$result->scoreLabel()  // Format: "85 / 100"
$result->grade()  // Letter grade: A, B, C, D, F
$result->completionDate()  // Formatted date
```

## Error Handling

### Certificate Download for Non-Passing Students
Returns 403 Forbidden with message: "This learner did not meet the passing score for a certificate."

### Invalid Assessment Result
Returns 404 Not Found when assessment result doesn't exist.

### Email Validation
Validates email addresses before sending. Returns 422 Unprocessable Entity for invalid emails.

## Testing

You can test the feature using the demo data:

1. **Seed the database:**
   ```bash
   php artisan db:seed --class=DemoDataSeeder
   ```

2. **Find a passing result ID:**
   ```bash
   php artisan tinker
   > App\Models\AssessmentResult::where('passed', true)->first()->id
   ```

3. **Test the endpoints:**
   - Visit `http://localhost:8000/assessment-results/{id}/report`
   - Visit `http://localhost:8000/assessment-results/{id}/certificate`
   - POST to `http://localhost:8000/assessment-results/{id}/email`

## Localization

The feature supports localization. All user-facing text uses Laravel's `__()` helper:

```php
__('Certificate of Achievement')
__('Score')
__('Passed')
```

To add translations, create language files in `resources/lang/{locale}/`.

## Performance Considerations

- **PDF Generation**: Can be resource-intensive for large documents. Consider queuing for bulk operations.
- **Email Sending**: Use Laravel's queue system for sending multiple emails.
- **Caching**: Consider caching statistics that don't change frequently.

## Security

- Use authentication middleware to protect routes
- Validate that users can only access their own results (or admin can access all)
- Sanitize all user input before rendering in PDFs
- Use Laravel's CSRF protection for POST endpoints

## Future Enhancements

Potential improvements to consider:
- QR code on certificates for verification
- Digital signatures
- Bulk download for administrators
- Custom templates per course
- Multilingual certificates
- PDF watermarks
- Scheduled automated email delivery
- Analytics dashboard for assessment performance

## Support

For issues or questions:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Verify mail configuration in `.env`
3. Ensure migrations are up to date
4. Check Dompdf compatibility with your PHP version

## License

This feature is part of the e-Learning platform and follows the same license terms.
