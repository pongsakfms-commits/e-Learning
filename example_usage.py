"""Example script demonstrating the quiz workflow."""

from pathlib import Path

from quiz_system import (
    MatchingPair,
    MatchingQuestion,
    MultipleChoiceQuestion,
    Quiz,
    QuizEngine,
    QuizReport,
    TrueFalseQuestion,
    JsonAttemptRepository,
)


def build_sample_quiz() -> Quiz:
    questions = [
        MultipleChoiceQuestion(
            id="mcq-1",
            question_text="Which language is primarily used for data science?",
            options=["Java", "Python", "C++", "Go"],
            correct_answer=1,
            points=5,
            explanation="Python provides a rich ecosystem for data science, including libraries like pandas, NumPy, and scikit-learn.",
        ),
        TrueFalseQuestion(
            id="tf-1",
            question_text="The Earth is flat.",
            correct_answer=False,
            points=2,
            explanation="Scientific consensus shows the Earth is an oblate spheroid.",
        ),
        MatchingQuestion(
            id="match-1",
            question_text="Match the country with its capital city.",
            pairs=[
                MatchingPair("Thailand", "Bangkok"),
                MatchingPair("Japan", "Tokyo"),
                MatchingPair("France", "Paris"),
            ],
            points=3,
        ),
    ]

    return Quiz(
        id="quiz-001",
        title="General Knowledge Quiz",
        description="A short quiz covering mixed general knowledge topics.",
        questions=questions,
        passing_score=70.0,
        max_attempts=3,
    )


def main() -> None:
    quiz = build_sample_quiz()
    repository = JsonAttemptRepository(Path("data/attempts.json"))
    engine = QuizEngine(repository)
    report = QuizReport(repository)

    user_id = "user-123"

    # Start a new attempt
    attempt = engine.start_quiz(quiz=quiz, user_id=user_id)
    print(f"Started attempt {attempt.attempt_id} for user {user_id}\n")

    # Record answers
    engine.record_answer(attempt_id=attempt.attempt_id, question_id="mcq-1", response=1)
    engine.record_answer(attempt_id=attempt.attempt_id, question_id="tf-1", response=False)
    engine.record_answer(
        attempt_id=attempt.attempt_id,
        question_id="match-1",
        response={"Thailand": "Bangkok", "Japan": "Tokyo", "France": "Paris"},
    )

    # Submit the quiz
    graded_attempt = engine.submit_quiz(attempt_id=attempt.attempt_id, quiz=quiz)
    summary = engine.get_attempt_summary(attempt_id=graded_attempt.attempt_id, quiz=quiz)

    print("Attempt Summary:")
    print(summary)

    quiz_stats = report.get_quiz_statistics(quiz_id=quiz.id)
    print("\nQuiz Statistics:")
    print(quiz_stats)

    user_stats = report.get_user_performance(user_id=user_id, quiz_id=quiz.id)
    print("\nUser Performance:")
    print(user_stats)


if __name__ == "__main__":
    main()
