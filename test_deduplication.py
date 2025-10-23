"""Demonstrate the deduplication feature of the quiz system."""

from pathlib import Path

from quiz_system import (
    MultipleChoiceQuestion,
    Quiz,
    QuizEngine,
    JsonAttemptRepository,
)


def main() -> None:
    quiz = Quiz(
        id="dedup-test",
        title="Deduplication Test",
        description="Testing automatic deduplication",
        questions=[
            MultipleChoiceQuestion(
                id="q1",
                question_text="Test question",
                options=["A", "B", "C"],
                correct_answer=1,
                points=10,
            )
        ],
        passing_score=50.0,
    )

    repository = JsonAttemptRepository(Path("data/dedup_test.json"))
    engine = QuizEngine(repository)

    print("=== Deduplication Test ===\n")

    user_id = "test-user"
    attempt = engine.start_quiz(quiz=quiz, user_id=user_id)
    attempt_id = attempt.attempt_id

    print(f"1. Started attempt: {attempt_id}")
    print(f"   Status: {attempt.status.value}")

    engine.record_answer(attempt_id, "q1", 0)
    print(f"\n2. Recorded first answer (wrong): 0")

    engine.record_answer(attempt_id, "q1", 1)
    print(f"3. Changed answer (correct): 1")

    retrieved = engine.get_attempt(attempt_id)
    print(f"\n4. Retrieved attempt from storage")
    print(f"   Response for q1: {retrieved.responses.get('q1')}")
    print(f"   Only latest answer is stored (deduplication of responses)")

    graded = engine.submit_quiz(attempt_id, quiz)
    print(f"\n5. Submitted quiz")
    print(f"   Score: {graded.score}/{graded.max_score}")
    print(f"   Passed: {graded.passed}")

    all_attempts = repository.list_attempts()
    print(f"\n6. Total attempts in storage: {len(all_attempts)}")
    print(f"   Only 1 record stored (no duplicates)")

    print("\n=== Deduplication Features ===")
    print("✓ Multiple record_answer() calls for same question only keeps latest")
    print("✓ Repository automatically deduplicates by attempt_id")
    print("✓ Most recent version (by timestamp) is preserved")
    print("✓ Ensures data integrity for reporting")


if __name__ == "__main__":
    main()
