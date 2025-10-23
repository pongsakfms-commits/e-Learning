"""Example script demonstrating Pre-test usage."""

from pathlib import Path
from uuid import uuid4
from quiz_system import QuizEngine, QuizReport, JsonAttemptRepository
from seeders import build_pre_test_quiz


def main() -> None:
    quiz = build_pre_test_quiz()
    repository = JsonAttemptRepository(Path("data/attempts.json"))
    engine = QuizEngine(repository)
    report = QuizReport(repository)

    user_id = f"student-{uuid4()}"

    print(f"Quiz: {quiz.title}")
    print(f"Description: {quiz.description}")
    print(f"Total Questions: {len(quiz.questions)}")
    print(f"Total Points: {quiz.total_points}")
    print(f"Passing Score: {quiz.passing_score}%")
    print(f"Time Limit: {quiz.time_limit_minutes} minutes\n")

    attempt = engine.start_quiz(quiz=quiz, user_id=user_id)
    print(f"Started attempt {attempt.attempt_id} for user {user_id}\n")

    print("Answering first 5 questions correctly...\n")
    for i, question in enumerate(quiz.questions[:5]):
        print(f"Q{i+1}: {question.question_text}")
        engine.record_answer(
            attempt_id=attempt.attempt_id,
            question_id=question.id,
            response=question.correct_answer
        )

    print("\nLeaving remaining questions unanswered...\n")

    graded_attempt = engine.submit_quiz(attempt_id=attempt.attempt_id, quiz=quiz)
    summary = engine.get_attempt_summary(attempt_id=graded_attempt.attempt_id, quiz=quiz)

    print("=" * 80)
    print("ATTEMPT SUMMARY")
    print("=" * 80)
    print(f"Score: {summary['score']}/{summary['max_score']} ({summary['percentage']:.1f}%)")
    print(f"Status: {'PASSED ✓' if summary['passed'] else 'FAILED ✗'}")
    print(f"Passing Score Required: {summary['passing_score']}%")
    print(f"Started: {summary['started_at']}")
    print(f"Submitted: {summary['submitted_at']}")
    print("=" * 80)

    print("\nQuestion Results:")
    print("-" * 80)
    for i, q in enumerate(summary['questions'], 1):
        status = "✓" if q['is_correct'] else "✗"
        print(f"{i}. {status} {q['question_text'][:60]}...")
        print(f"   Points: {q['awarded_points']}/{q['points']}")

    quiz_stats = report.get_quiz_statistics(quiz_id=quiz.id)
    print("\n" + "=" * 80)
    print("QUIZ STATISTICS")
    print("=" * 80)
    print(f"Total Attempts: {quiz_stats['total_attempts']}")
    print(f"Completed Attempts: {quiz_stats['completed_attempts']}")
    print(f"Pass Rate: {quiz_stats['pass_rate']:.1f}%")
    print(f"Average Score: {quiz_stats['average_score']:.1f}")
    print("=" * 80)


if __name__ == "__main__":
    main()
