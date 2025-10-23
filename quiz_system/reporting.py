"""Reporting utilities for analyzing quiz attempts and performance."""

from collections import defaultdict
from typing import Any, Dict, List, Optional

from .attempts import AttemptStatus, QuizAttempt
from .models import Quiz
from .repository import AttemptRepository


class QuizReport:
    """Generate reports and statistics from quiz attempts."""

    def __init__(self, repository: AttemptRepository):
        self.repository = repository

    def get_quiz_statistics(self, quiz_id: str) -> Dict[str, Any]:
        """
        Generate statistics for a quiz across all attempts.

        Args:
            quiz_id: ID of the quiz to analyze

        Returns:
            Dictionary with quiz statistics
        """
        attempts = self.repository.list_attempts_by_quiz(quiz_id)
        submitted_attempts = [a for a in attempts if a.status == AttemptStatus.SUBMITTED]

        if not submitted_attempts:
            return {
                "quiz_id": quiz_id,
                "total_attempts": 0,
                "completed_attempts": 0,
                "pass_count": 0,
                "fail_count": 0,
                "pass_rate": 0.0,
                "average_score": 0.0,
                "highest_score": 0.0,
                "lowest_score": 0.0,
            }

        total_attempts = len(attempts)
        completed_attempts = len(submitted_attempts)
        pass_count = sum(1 for a in submitted_attempts if a.passed)
        fail_count = completed_attempts - pass_count

        scores = [a.score for a in submitted_attempts]
        average_score = sum(scores) / len(scores) if scores else 0.0
        highest_score = max(scores) if scores else 0.0
        lowest_score = min(scores) if scores else 0.0

        pass_rate = (pass_count / completed_attempts * 100) if completed_attempts > 0 else 0.0

        return {
            "quiz_id": quiz_id,
            "total_attempts": total_attempts,
            "completed_attempts": completed_attempts,
            "pass_count": pass_count,
            "fail_count": fail_count,
            "pass_rate": pass_rate,
            "average_score": average_score,
            "highest_score": highest_score,
            "lowest_score": lowest_score,
        }

    def get_user_performance(self, user_id: str, quiz_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Get performance statistics for a specific user.

        Args:
            user_id: ID of the user
            quiz_id: Optional quiz ID to filter by

        Returns:
            Dictionary with user performance data
        """
        if quiz_id:
            attempts = self.repository.get_attempts_by_user_and_quiz(user_id, quiz_id)
        else:
            attempts = [a for a in self.repository.list_attempts() if a.user_id == user_id]

        submitted_attempts = [a for a in attempts if a.status == AttemptStatus.SUBMITTED]

        if not submitted_attempts:
            return {
                "user_id": user_id,
                "quiz_id": quiz_id,
                "total_attempts": 0,
                "completed_attempts": 0,
                "pass_count": 0,
                "fail_count": 0,
                "average_score": 0.0,
                "best_score": 0.0,
                "recent_attempts": [],
            }

        total_attempts = len(attempts)
        completed_attempts = len(submitted_attempts)
        pass_count = sum(1 for a in submitted_attempts if a.passed)
        fail_count = completed_attempts - pass_count

        scores = [a.score for a in submitted_attempts]
        average_score = sum(scores) / len(scores) if scores else 0.0
        best_score = max(scores) if scores else 0.0

        recent_attempts = sorted(submitted_attempts, key=lambda a: a.submitted_at or a.started_at, reverse=True)[:5]
        recent_attempts_data = [
            {
                "attempt_id": a.attempt_id,
                "quiz_id": a.quiz_id,
                "score": a.score,
                "max_score": a.max_score,
                "passed": a.passed,
                "submitted_at": a.submitted_at.isoformat() if a.submitted_at else None,
            }
            for a in recent_attempts
        ]

        return {
            "user_id": user_id,
            "quiz_id": quiz_id,
            "total_attempts": total_attempts,
            "completed_attempts": completed_attempts,
            "pass_count": pass_count,
            "fail_count": fail_count,
            "average_score": average_score,
            "best_score": best_score,
            "recent_attempts": recent_attempts_data,
        }

    def get_question_analytics(self, quiz: Quiz, attempts: Optional[List[QuizAttempt]] = None) -> Dict[str, Any]:
        """
        Analyze question difficulty based on attempt data.

        Args:
            quiz: The quiz to analyze
            attempts: Optional list of attempts to analyze (defaults to all attempts for the quiz)

        Returns:
            Dictionary mapping question IDs to their analytics
        """
        if attempts is None:
            attempts = self.repository.list_attempts_by_quiz(quiz.id)

        submitted_attempts = [a for a in attempts if a.status == AttemptStatus.SUBMITTED]

        question_stats = defaultdict(lambda: {
            "question_id": None,
            "total_attempts": 0,
            "correct_count": 0,
            "incorrect_count": 0,
            "accuracy_rate": 0.0,
        })

        for question in quiz.questions:
            question_stats[question.id]["question_id"] = question.id

        for attempt in submitted_attempts:
            for question_id, answer in attempt.answers.items():
                stats = question_stats[question_id]
                stats["total_attempts"] += 1
                if answer.is_correct:
                    stats["correct_count"] += 1
                else:
                    stats["incorrect_count"] += 1

        for question_id, stats in question_stats.items():
            if stats["total_attempts"] > 0:
                stats["accuracy_rate"] = (stats["correct_count"] / stats["total_attempts"]) * 100

        return dict(question_stats)
