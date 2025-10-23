# Development Guide

## Quick Start

### First Time Setup

```bash
# Install dependencies for both backend and frontend
npm run setup

# Seed the database with sample data
npm run seed
```

### Running the Application

You'll need **two terminals**:

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

Then open your browser to: **http://localhost:5173**

## Project Details

### Backend (Port 4000)
- **Framework**: Express + TypeScript
- **Database**: SQLite (file-based at `backend/data/elearning.db`)
- **Main Files**:
  - `backend/src/index.ts` - Server entry point
  - `backend/src/routes/scores.ts` - API endpoints for score management
  - `backend/src/db/database.ts` - Database connection
  - `backend/src/db/migrate.ts` - Database schema
  - `backend/src/db/seed.ts` - Sample data

### Frontend (Port 5173)
- **Framework**: React 18 + TypeScript + Vite
- **Main Files**:
  - `frontend/src/main.tsx` - App entry point
  - `frontend/src/App.tsx` - Main app with routing
  - `frontend/src/components/ScoresOverview.tsx` - Main score management page
  - `frontend/src/components/AttemptDetailModal.tsx` - Detail view modal
  - `frontend/src/api.ts` - API client functions
  - `frontend/src/styles.css` - All styles

## Features Implemented

### 1. Scores Overview Page
- **Filter by**:
  - Student (dropdown)
  - Quiz (dropdown)
  - Date range (start and end date)
  - Search text (name/email/quiz title)
- **Display**:
  - Student name and email
  - Quiz title and attempt number
  - Date/time of attempt
  - Score with percentage
  - Status badge
  - Last audit note (if any)

### 2. Attempt Detail View
- Student information
- Quiz information
- Score information
- All questions with:
  - Learner's answer
  - Correct answer
  - Points earned
  - Correctness indicator
- Full audit log history

### 3. Score Editing
- Edit score with validation
- Add optional note explaining the change
- Automatically logs to audit trail
- Shows previous and new score

### 4. Note/Comment System
- Add notes to any attempt
- Notes appear in audit log
- Last note shown in overview table

### 5. Report Export
- Download student report as CSV
- Available when filtered by specific student
- Includes all attempts for that student

## Database Schema

### students
- `id` - Primary key
- `name` - Student name
- `email` - Student email (unique)

### quizzes
- `id` - Primary key
- `title` - Quiz title
- `description` - Quiz description

### attempts
- `id` - Primary key
- `student_id` - Foreign key to students
- `quiz_id` - Foreign key to quizzes
- `started_at` - Timestamp when started
- `completed_at` - Timestamp when completed
- `score` - Points earned
- `max_score` - Maximum possible points
- `status` - 'completed' or 'in-progress'

### attempt_answers
- `id` - Primary key
- `attempt_id` - Foreign key to attempts
- `question` - Question text
- `learner_answer` - What the student answered
- `correct_answer` - The correct answer
- `is_correct` - Boolean (0 or 1)
- `points` - Points earned for this question
- `max_points` - Maximum points for this question

### audit_logs
- `id` - Primary key
- `attempt_id` - Foreign key to attempts
- `action` - Type of action ('score_updated', 'note_added')
- `note` - Text note/comment
- `previous_score` - Old score (for score updates)
- `new_score` - New score (for score updates)
- `created_at` - Timestamp
- `actor` - Who made the change (default: 'admin')

## API Endpoints

All admin endpoints are prefixed with `/api/admin`:

- `GET /attempts` - List all attempts with filters
- `GET /attempts/:id` - Get single attempt details
- `PATCH /attempts/:id/score` - Update score
- `POST /attempts/:id/note` - Add note
- `GET /students` - List all students
- `GET /quizzes` - List all quizzes
- `GET /report/:studentId` - Get student report (JSON)
- `GET /report/:studentId/export` - Download CSV report

## Sample Data

The seed script creates:
- 4 students (Thai names)
- 3 quizzes (Math, English, Science)
- 4 completed attempts with answers

## Troubleshooting

### Database issues
```bash
# Delete and recreate database
rm backend/data/elearning.db*
npm run seed
```

### Port already in use
- Backend: Change port in `backend/src/index.ts`
- Frontend: Change port in `frontend/vite.config.ts`

### Dependencies not installed
```bash
npm run setup
```
