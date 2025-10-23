"""Tests for seeder question banks."""

import unittest
from seeders import (
    build_pre_test_quiz,
    build_post_test_quiz,
    build_true_false_quiz,
    build_matching_quiz,
)


class SeederTests(unittest.TestCase):
    """Test cases for seeded question banks."""

    def test_pre_test_quiz(self):
        """Test Pre-test quiz has correct structure."""
        quiz = build_pre_test_quiz()
        
        self.assertEqual(quiz.id, "pre-test-001")
        self.assertEqual(len(quiz.questions), 20)
        self.assertEqual(quiz.total_points, 100)
        self.assertEqual(quiz.passing_score, 70.0)
        self.assertEqual(quiz.max_attempts, 1)
        
        for question in quiz.questions:
            self.assertEqual(question.points, 5)
            self.assertIsNotNone(question.explanation)
            self.assertTrue(0 <= question.correct_answer < len(question.options))

    def test_post_test_quiz(self):
        """Test Post-test quiz has correct structure."""
        quiz = build_post_test_quiz()
        
        self.assertEqual(quiz.id, "post-test-001")
        self.assertEqual(len(quiz.questions), 20)
        self.assertEqual(quiz.total_points, 100)
        self.assertEqual(quiz.passing_score, 80.0)
        self.assertEqual(quiz.max_attempts, 1)
        
        for question in quiz.questions:
            self.assertEqual(question.points, 5)
            self.assertIsNotNone(question.explanation)
            self.assertTrue(0 <= question.correct_answer < len(question.options))

    def test_true_false_quiz(self):
        """Test True/False quiz has correct structure."""
        quiz = build_true_false_quiz()
        
        self.assertEqual(quiz.id, "true-false-001")
        self.assertEqual(len(quiz.questions), 10)
        self.assertEqual(quiz.total_points, 20)
        self.assertEqual(quiz.passing_score, 70.0)
        self.assertEqual(quiz.max_attempts, 2)
        
        for question in quiz.questions:
            self.assertEqual(question.points, 2)
            self.assertIsNotNone(question.explanation)
            self.assertIsInstance(question.correct_answer, bool)

    def test_matching_quiz(self):
        """Test Matching quiz has correct structure."""
        quiz = build_matching_quiz()
        
        self.assertEqual(quiz.id, "matching-001")
        self.assertEqual(len(quiz.questions), 5)
        self.assertEqual(quiz.total_points, 20)
        self.assertEqual(quiz.passing_score, 70.0)
        self.assertEqual(quiz.max_attempts, 2)
        
        for question in quiz.questions:
            self.assertEqual(question.points, 4)
            self.assertEqual(len(question.pairs), 4)
            self.assertIsNotNone(question.explanation)

    def test_all_questions_have_unique_ids(self):
        """Test that all question IDs are unique across all quizzes."""
        all_quizzes = [
            build_pre_test_quiz(),
            build_post_test_quiz(),
            build_true_false_quiz(),
            build_matching_quiz(),
        ]
        
        all_ids = []
        for quiz in all_quizzes:
            for question in quiz.questions:
                all_ids.append(question.id)
        
        self.assertEqual(len(all_ids), len(set(all_ids)), "Duplicate question IDs found")

    def test_total_question_count(self):
        """Test that total questions match the requirement."""
        pre_test = build_pre_test_quiz()
        post_test = build_post_test_quiz()
        tf_quiz = build_true_false_quiz()
        matching_quiz = build_matching_quiz()
        
        total_questions = (
            len(pre_test.questions) +
            len(post_test.questions) +
            len(tf_quiz.questions) +
            len(matching_quiz.questions)
        )
        
        self.assertEqual(total_questions, 55, "Total should be 55 questions")

    def test_answer_validation(self):
        """Test that all questions can validate correct answers."""
        all_quizzes = [
            build_pre_test_quiz(),
            build_post_test_quiz(),
            build_true_false_quiz(),
            build_matching_quiz(),
        ]
        
        for quiz in all_quizzes:
            for question in quiz.questions:
                question_type = question.question_type.value
                
                if question_type == "multiple_choice":
                    self.assertTrue(question.check_answer(question.correct_answer))
                    self.assertFalse(question.check_answer(-1))
                
                elif question_type == "true_false":
                    self.assertTrue(question.check_answer(question.correct_answer))
                    self.assertFalse(question.check_answer(not question.correct_answer))
                
                elif question_type == "matching":
                    correct_mapping = {pair.left: pair.right for pair in question.pairs}
                    self.assertTrue(question.check_answer(correct_mapping))
                    self.assertFalse(question.check_answer({}))


if __name__ == "__main__":
    unittest.main()
