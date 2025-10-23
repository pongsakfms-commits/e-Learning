import tempfile
import unittest
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
from quiz_system.engine import MaxAttemptsExceededError


def build_quiz() -> Quiz:
    questions = [
        MultipleChoiceQuestion(
            id="q1",
            question_text="What is 2 + 2?",
            options=["3", "4", "5", "6"],
            correct_answer=1,
            points=5,
        ),
        TrueFalseQuestion(
            id="q2",
            question_text="The sky is blue.",
            correct_answer=True,
            points=3,
        ),
        MatchingQuestion(
            id="q3",
            question_text="Match the animal to its sound.",
            pairs=[
                MatchingPair("Dog", "Bark"),
                MatchingPair("Cat", "Meow"),
                MatchingPair("Cow", "Moo"),
            ],
            points=4,
        ),
    ]

    return Quiz(
        id="math-quiz",
        title="Math and Nature Quiz",
        description="Mixed question types",
        questions=questions,
        passing_score=75.0,
        max_attempts=2,
    )


class QuizEngineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        storage_path = Path(self.temp_dir.name) / "attempts.json"
        self.repository = JsonAttemptRepository(storage_path)
        self.quiz = build_quiz()
        self.engine = QuizEngine(self.repository)
        self.report = QuizReport(self.repository)

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_quiz_workflow(self) -> None:
        attempt = self.engine.start_quiz(quiz=self.quiz, user_id="student1")
        self.assertEqual(attempt.quiz_id, self.quiz.id)
        self.assertEqual(attempt.status.value, "in_progress")

        self.engine.record_answer(attempt.attempt_id, "q1", 1)
        self.engine.record_answer(attempt.attempt_id, "q2", True)
        self.engine.record_answer(
            attempt.attempt_id,
            "q3",
            {"Dog": "Bark", "Cat": "Meow", "Cow": "Moo"},
        )

        graded_attempt = self.engine.submit_quiz(attempt.attempt_id, self.quiz)

        self.assertEqual(graded_attempt.status.value, "submitted")
        self.assertEqual(graded_attempt.score, self.quiz.total_points)
        self.assertTrue(graded_attempt.passed)

        summary = self.engine.get_attempt_summary(graded_attempt.attempt_id, self.quiz)
        self.assertTrue(summary["passed"])
        self.assertEqual(summary["score"], self.quiz.total_points)

    def test_max_attempts_enforced(self) -> None:
        first_attempt = self.engine.start_quiz(self.quiz, user_id="student1")
        self.engine.submit_quiz(first_attempt.attempt_id, self.quiz)

        second_attempt = self.engine.start_quiz(self.quiz, user_id="student1")
        self.engine.submit_quiz(second_attempt.attempt_id, self.quiz)

        with self.assertRaises(MaxAttemptsExceededError):
            self.engine.start_quiz(self.quiz, user_id="student1")

    def test_reporting_metrics(self) -> None:
        attempt1 = self.engine.start_quiz(self.quiz, user_id="student1")
        self.engine.record_answer(attempt1.attempt_id, "q1", 0)
        self.engine.record_answer(attempt1.attempt_id, "q2", False)
        self.engine.record_answer(
            attempt1.attempt_id,
            "q3",
            {"Dog": "Meow", "Cat": "Bark", "Cow": "Moo"},
        )
        self.engine.submit_quiz(attempt1.attempt_id, self.quiz)

        attempt2 = self.engine.start_quiz(self.quiz, user_id="student2")
        self.engine.record_answer(attempt2.attempt_id, "q1", 1)
        self.engine.record_answer(attempt2.attempt_id, "q2", True)
        self.engine.record_answer(
            attempt2.attempt_id,
            "q3",
            {"Dog": "Bark", "Cat": "Meow", "Cow": "Moo"},
        )
        self.engine.submit_quiz(attempt2.attempt_id, self.quiz)

        stats = self.report.get_quiz_statistics(self.quiz.id)
        self.assertEqual(stats["total_attempts"], 2)
        self.assertEqual(stats["pass_count"], 1)
        self.assertEqual(stats["fail_count"], 1)
        self.assertEqual(stats["completed_attempts"], 2)

        user_stats = self.report.get_user_performance(user_id="student2", quiz_id=self.quiz.id)
        self.assertEqual(user_stats["pass_count"], 1)
        self.assertEqual(user_stats["completed_attempts"], 1)


if __name__ == "__main__":
    unittest.main()
