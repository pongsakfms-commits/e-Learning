import unittest

from quiz_system import (
    MatchingPair,
    MatchingQuestion,
    MultipleChoiceQuestion,
    QuestionType,
    TrueFalseQuestion,
)


class QuestionModelTests(unittest.TestCase):
    def test_multiple_choice_question(self) -> None:
        question = MultipleChoiceQuestion(
            id="mcq1",
            question_text="What is the capital of France?",
            options=["London", "Paris", "Berlin", "Madrid"],
            correct_answer=1,
            points=2.0,
        )

        self.assertEqual(question.question_type, QuestionType.MULTIPLE_CHOICE)
        self.assertTrue(question.check_answer(1))
        self.assertFalse(question.check_answer(0))
        self.assertFalse(question.check_answer(2))
        self.assertFalse(question.check_answer("Paris"))

    def test_true_false_question(self) -> None:
        question = TrueFalseQuestion(
            id="tf1",
            question_text="Python is a programming language.",
            correct_answer=True,
            points=1.0,
        )

        self.assertEqual(question.question_type, QuestionType.TRUE_FALSE)
        self.assertTrue(question.check_answer(True))
        self.assertFalse(question.check_answer(False))
        self.assertFalse(question.check_answer("True"))

    def test_matching_question(self) -> None:
        question = MatchingQuestion(
            id="match1",
            question_text="Match colors with their wavelengths.",
            pairs=[
                MatchingPair("Red", "700nm"),
                MatchingPair("Green", "550nm"),
                MatchingPair("Blue", "450nm"),
            ],
            points=3.0,
        )

        self.assertEqual(question.question_type, QuestionType.MATCHING)

        correct_answer = {"Red": "700nm", "Green": "550nm", "Blue": "450nm"}
        self.assertTrue(question.check_answer(correct_answer))

        wrong_answer = {"Red": "450nm", "Green": "550nm", "Blue": "700nm"}
        self.assertFalse(question.check_answer(wrong_answer))

        partial_answer = {"Red": "700nm"}
        self.assertFalse(question.check_answer(partial_answer))

        self.assertFalse(question.check_answer("not a dict"))

    def test_question_to_dict(self) -> None:
        mcq = MultipleChoiceQuestion(
            id="mcq1",
            question_text="Sample question?",
            options=["A", "B", "C"],
            correct_answer=1,
            points=5,
        )

        data_without_answer = mcq.to_dict(include_answer=False)
        self.assertNotIn("correct_answer", data_without_answer)
        self.assertEqual(data_without_answer["id"], "mcq1")
        self.assertEqual(data_without_answer["type"], "multiple_choice")

        data_with_answer = mcq.to_dict(include_answer=True)
        self.assertEqual(data_with_answer["correct_answer"], 1)


if __name__ == "__main__":
    unittest.main()
