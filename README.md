# e-Learning 
e-Learning by pom

## Features

- 🔐 Google Sheets integration with Service Account authentication
- 📊 Automatic saving of learner data and scores to Google Sheets
- 🔄 Queue system with retry mechanism for failed API calls
- 📝 Comprehensive logging with Winston
- ⚙️ Environment-based configuration

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Google Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create a Service Account:
   - Navigate to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Give it a name and click "Create"
   - Grant it the "Editor" role
   - Click "Done"
5. Create a key for the Service Account:
   - Click on the service account you just created
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the key file

### 3. Create Google Spreadsheet

1. Create a new Google Spreadsheet
2. Share it with the Service Account email (found in the JSON key file)
3. Copy the Spreadsheet ID from the URL
   - URL format: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
4. Create two sheets in your spreadsheet:
   - `LearnerData` with headers: ID, Name, Email, Metadata
   - `Scores` with headers: Learner ID, Learner Name, Learner Email, Activity ID, Activity Title, Score, Max Score, Grade, Completed At, Learner Metadata, Activity Metadata, Score Metadata

### 4. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

Note: The `GOOGLE_PRIVATE_KEY` should include the full private key from your JSON file, with `\n` for newlines.

### 5. Build the Project

```bash
npm run build
```

## Usage

### Save Learner Result

```typescript
import { saveLearnerResult } from './index';
import { LearnerScorePayload } from './types';

const payload: LearnerScorePayload = {
  learner: {
    id: 'learner-001',
    name: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    metadata: {
      grade: '6',
      school: 'โรงเรียนตัวอย่าง'
    }
  },
  activity: {
    id: 'activity-001',
    title: 'แบบทดสอบคณิตศาสตร์ บทที่ 1',
    metadata: {
      subject: 'คณิตศาสตร์',
      chapter: 1
    }
  },
  score: {
    value: 85,
    max: 100,
    grade: 'A',
    metadata: {
      timeSpent: 1200,
      attempts: 1
    }
  },
  completedAt: new Date()
};

await saveLearnerResult(payload);
```

### Check Queue Status

```typescript
import { getQueueStatus } from './index';

const status = getQueueStatus();
console.log(`Queue length: ${status.length}`);
console.log(`Items:`, status.items);
```

### Run Example

```bash
npm run dev
```

Or compile and run:

```bash
npm run build
node dist/example.js
```

## Architecture

### Components

- **GoogleSheetsService**: Handles direct communication with Google Sheets API
  - Uses Service Account for authentication
  - Implements retry logic with exponential backoff
  - Logs all operations
  
- **QueueService**: Manages failed requests
  - Queues failed requests for retry
  - Implements exponential backoff strategy
  - Removes items after max retry attempts
  - Provides queue status monitoring

- **Logger**: Centralized logging with Winston
  - Logs to console and files
  - Different log levels (info, warn, error)
  - Structured logging with metadata

### Error Handling

1. **Immediate Retry**: Google Sheets API calls use `p-retry` for immediate retries with exponential backoff
2. **Queue Retry**: If all immediate retries fail, the request is added to a queue for later processing
3. **Max Attempts**: After 5 total failed attempts, the item is logged and removed from the queue
4. **Logging**: All failures are logged with full context for debugging

### Configuration

All configuration is managed through environment variables (`.env` file):

- `GOOGLE_SPREADSHEET_ID`: Target spreadsheet ID
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Service account email
- `GOOGLE_PRIVATE_KEY`: Service account private key
- `SHEET_NAME_LEARNER_DATA`: Name of learner data sheet (default: "LearnerData")
- `SHEET_NAME_SCORES`: Name of scores sheet (default: "Scores")
- `MAX_RETRY_ATTEMPTS`: Maximum retry attempts (default: 3)
- `RETRY_INITIAL_DELAY_MS`: Initial retry delay in milliseconds (default: 1000)

## Logs

Logs are written to:
- `error.log`: Error-level logs only
- `combined.log`: All logs
- Console: All logs with color formatting

## License

ISC
