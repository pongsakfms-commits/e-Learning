# e-Learning Quiz System

A comprehensive quiz and exercise system with support for multiple question types, automated scoring, and detailed reporting.

## Features

### Quiz Workflow
- **Start**: Initialize a new quiz attempt for a user
- **Take**: Record answers to questions during the attempt
- **Submit**: Finalize and automatically grade the attempt
- **Results**: View detailed results with correct answers and explanations

### Supported Question Types
1. **Multiple Choice**: Select one correct answer from multiple options
2. **True/False**: Binary choice questions
3. **Matching**: Match items from two lists (e.g., countries to capitals)

### Scoring & Analytics
- Automatic score calculation
- Pass/fail determination based on configurable passing score
- Prevent duplicate attempts tracking
- Comprehensive reporting:
  - Quiz statistics (pass rate, average scores)
  - User performance tracking
  - Question analytics (difficulty analysis)

### Data Persistence
- JSON-based storage for easy reporting and auditing
- Automatic deduplication to prevent data inconsistencies
- Immutable attempt records after submission

## Installation

No external dependencies required - uses only Python standard library.

```bash
# Clone the repository
git clone <repository-url>
cd e-Learning-pom

# Run example
python example_usage.py

# Run tests
python -m unittest discover tests/
```

## Usage

### Quick Start

```python
from pathlib import Path
from quiz_system import (
    Quiz,
    MultipleChoiceQuestion,
    TrueFalseQuestion,
    MatchingQuestion,
    MatchingPair,
    QuizEngine,
    JsonAttemptRepository,
)

# Create a quiz
quiz = Quiz(
    id="quiz-001",
    title="Sample Quiz",
    description="A demonstration quiz",
    questions=[
        MultipleChoiceQuestion(
            id="q1",
            question_text="What is 2 + 2?",
            options=["3", "4", "5", "6"],
            correct_answer=1,
            points=10,
        ),
        TrueFalseQuestion(
            id="q2",
            question_text="Python is a programming language.",
            correct_answer=True,
            points=5,
        ),
        MatchingQuestion(
            id="q3",
            question_text="Match countries to capitals.",
            pairs=[
                MatchingPair("Thailand", "Bangkok"),
                MatchingPair("Japan", "Tokyo"),
            ],
            points=10,
        ),
    ],
    passing_score=70.0,
    max_attempts=3,
)

# Initialize the engine
repository = JsonAttemptRepository(Path("data/attempts.json"))
engine = QuizEngine(repository)

# Start a quiz attempt
attempt = engine.start_quiz(quiz=quiz, user_id="student-123")

# Record answers
engine.record_answer(attempt.attempt_id, "q1", 1)  # Correct answer (index 1 = "4")
engine.record_answer(attempt.attempt_id, "q2", True)
engine.record_answer(attempt.attempt_id, "q3", {"Thailand": "Bangkok", "Japan": "Tokyo"})

# Submit and grade
graded_attempt = engine.submit_quiz(attempt.attempt_id, quiz)

# View results
summary = engine.get_attempt_summary(graded_attempt.attempt_id, quiz)
print(f"Score: {summary['score']}/{summary['max_score']}")
print(f"Passed: {summary['passed']}")
```

### Reporting

```python
from quiz_system import QuizReport

report = QuizReport(repository)

# Get quiz statistics
stats = report.get_quiz_statistics(quiz_id="quiz-001")
print(f"Pass rate: {stats['pass_rate']:.1f}%")
print(f"Average score: {stats['average_score']:.1f}")

# Get user performance
user_stats = report.get_user_performance(user_id="student-123", quiz_id="quiz-001")
print(f"User attempts: {user_stats['completed_attempts']}")
print(f"Best score: {user_stats['best_score']}")

# Analyze question difficulty
question_analytics = report.get_question_analytics(quiz)
for qid, analytics in question_analytics.items():
    print(f"Question {qid}: {analytics['accuracy_rate']:.1f}% accuracy")
```

## Architecture

### Core Components

1. **Models** (`models.py`): Define quiz and question structures
   - `Quiz`: Container for questions with configuration
   - `MultipleChoiceQuestion`, `TrueFalseQuestion`, `MatchingQuestion`: Question types
   - Each question type implements `check_answer()` for validation

2. **Attempts** (`attempts.py`): Track quiz attempt lifecycle
   - `QuizAttempt`: Stores user responses and graded results
   - `AnswerRecord`: Individual answer with scoring
   - `AttemptStatus`: Workflow states (IN_PROGRESS, SUBMITTED, CANCELLED)

3. **Engine** (`engine.py`): Business logic for quiz workflow
   - `start_quiz()`: Create new attempt with validation
   - `record_answer()`: Save user responses
   - `submit_quiz()`: Grade and finalize attempt
   - `get_attempt_summary()`: Detailed results view

4. **Repository** (`repository.py`): Data persistence layer
   - `JsonAttemptRepository`: JSON file-based storage
   - Automatic deduplication prevents data corruption
   - Easy to extend for database backends

5. **Reporting** (`reporting.py`): Analytics and statistics
   - Quiz-level statistics
   - User performance tracking
   - Question difficulty analysis

### Data Flow

```
User Action          → Engine Method      → Repository        → Storage
─────────────────────────────────────────────────────────────────────
Start Quiz          → start_quiz()       → save_attempt()    → JSON
Answer Question     → record_answer()    → save_attempt()    → JSON
Submit Quiz         → submit_quiz()      → save_attempt()    → JSON
View Results        → get_attempt_summary() → get_attempt() → JSON
```

## Design Decisions

### Deduplication Strategy
The system uses attempt_id as the unique identifier and automatically deduplicates records when saving. The most recent version (by submitted_at or started_at) is kept, preventing data inconsistencies in reports.

### Immutability
Once a quiz attempt is submitted, it becomes immutable. This ensures:
- Audit trail integrity
- Reliable reporting
- No accidental modifications

### Question Type Validation
Each question type implements its own `check_answer()` method, making it easy to add new question types without modifying the engine.

### JSON Storage
Using JSON for storage provides:
- Human-readable format for debugging
- Easy integration with reporting tools
- Simple backup and versioning
- Can be easily migrated to a database later

## Testing

Run the test suite:

```bash
python -m unittest discover tests/ -v
```

Tests cover:
- Question type validation
- Quiz workflow (start → take → submit → results)
- Max attempts enforcement
- Deduplication logic
- Reporting accuracy

## Future Enhancements

Potential additions:
- Time limit enforcement
- Partial credit for matching questions
- Question randomization
- Answer shuffling
- Multi-language support
- Database backend (PostgreSQL, MySQL)
- REST API layer
- Web interface

## License

This project is part of the e-Learning platform by pom.
