"""Core quiz engine implementing workflow for starting, taking, and submitting quizzes."""

from datetime import datetime, timezone
from typing import Any, Dict, Optional, Tuple
from uuid import uuid4

from .attempts import AnswerRecord, AttemptStatus, QuizAttempt
from .models import Quiz
from .repository import AttemptRepository


class QuizEngineError(Exception):
    """Base exception for quiz engine errors."""

    pass


class AttemptNotFoundError(QuizEngineError):
    """Raised when attempting to access a non-existent quiz attempt."""

    pass


class AttemptAlreadySubmittedError(QuizEngineError):
    """Raised when attempting to modify a submitted quiz attempt."""

    pass


class MaxAttemptsExceededError(QuizEngineError):
    """Raised when user has exhausted allowed attempts."""

    pass


class QuizEngine:
    """Orchestrates quiz lifecycle: start, take, submit, and retrieve results."""

    def __init__(self, repository: AttemptRepository):
        self.repository = repository

    def start_quiz(self, quiz: Quiz, user_id: str) -> QuizAttempt:
        """
        Start a new quiz attempt for a user.

        Args:
            quiz: The quiz to attempt
            user_id: ID of the user taking the quiz

        Returns:
            A new QuizAttempt instance

        Raises:
            MaxAttemptsExceededError: If the user has exceeded max attempts
        """
        if quiz.max_attempts is not None:
            previous_attempts = self.repository.get_attempts_by_user_and_quiz(
                user_id=user_id, quiz_id=quiz.id
            )
            submitted_attempts = [
                a for a in previous_attempts if a.status == AttemptStatus.SUBMITTED
            ]

            if len(submitted_attempts) >= quiz.max_attempts:
                raise MaxAttemptsExceededError(
                    f"User {user_id} has exceeded maximum attempts ({quiz.max_attempts}) for quiz {quiz.id}"
                )

        attempt = QuizAttempt(
            attempt_id=str(uuid4()),
            quiz_id=quiz.id,
            user_id=user_id,
            max_score=quiz.total_points,
            started_at=datetime.now(timezone.utc),
        )

        self.repository.save_attempt(attempt)
        return attempt

    def record_answer(self, attempt_id: str, question_id: str, response: Any) -> QuizAttempt:
        """
        Record an answer for a question in an in-progress attempt.

        Args:
            attempt_id: ID of the attempt
            question_id: ID of the question being answered
            response: The user's response

        Returns:
            Updated QuizAttempt

        Raises:
            AttemptNotFoundError: If attempt doesn't exist
            AttemptAlreadySubmittedError: If attempt is already submitted
        """
        attempt = self.repository.get_attempt(attempt_id)
        if attempt is None:
            raise AttemptNotFoundError(f"Attempt {attempt_id} not found")

        if attempt.status != AttemptStatus.IN_PROGRESS:
            raise AttemptAlreadySubmittedError(f"Attempt {attempt_id} is already finalized")

        attempt.record_response(question_id, response)
        self.repository.save_attempt(attempt)
        return attempt

    def submit_quiz(self, attempt_id: str, quiz: Quiz) -> QuizAttempt:
        """
        Submit and grade a quiz attempt.

        Args:
            attempt_id: ID of the attempt to submit
            quiz: The quiz being attempted

        Returns:
            Graded QuizAttempt

        Raises:
            AttemptNotFoundError: If attempt doesn't exist
            AttemptAlreadySubmittedError: If attempt is already submitted
        """
        attempt = self.repository.get_attempt(attempt_id)
        if attempt is None:
            raise AttemptNotFoundError(f"Attempt {attempt_id} not found")

        if attempt.status != AttemptStatus.IN_PROGRESS:
            raise AttemptAlreadySubmittedError(f"Attempt {attempt_id} is already finalized")

        answers, total_score, max_score = self._grade_attempt(quiz, attempt)

        passing_threshold = (quiz.passing_score / 100) * max_score
        passed = total_score >= passing_threshold

        attempt.finalize(
            answers=answers,
            score=total_score,
            max_score=max_score,
            passed=passed,
            submitted_at=datetime.now(timezone.utc),
        )

        self.repository.save_attempt(attempt)
        return attempt

    def _grade_attempt(
        self, quiz: Quiz, attempt: QuizAttempt
    ) -> Tuple[list[AnswerRecord], float, float]:
        """
        Grade all questions in an attempt.

        Returns:
            Tuple of (list of AnswerRecords, total score, max possible score)
        """
        answers = []
        total_score = 0.0
        max_score = 0.0

        for question in quiz.questions:
            response = attempt.responses.get(question.id)
            is_correct = False
            awarded_points = 0.0

            if response is not None:
                is_correct = question.check_answer(response)
                if is_correct:
                    awarded_points = question.points

            answer_record = AnswerRecord(
                question_id=question.id,
                response=response,
                awarded_points=awarded_points,
                max_points=question.points,
                is_correct=is_correct,
            )

            answers.append(answer_record)
            total_score += awarded_points
            max_score += question.points

        return answers, total_score, max_score

    def get_attempt(self, attempt_id: str) -> Optional[QuizAttempt]:
        """Retrieve a quiz attempt by ID."""
        return self.repository.get_attempt(attempt_id)

    def get_attempt_summary(self, attempt_id: str, quiz: Quiz) -> Dict[str, Any]:
        """
        Get a detailed summary of a quiz attempt including questions and answers.

        Args:
            attempt_id: ID of the attempt
            quiz: The quiz that was attempted

        Returns:
            Dictionary containing attempt details and graded questions

        Raises:
            AttemptNotFoundError: If attempt doesn't exist
        """
        attempt = self.repository.get_attempt(attempt_id)
        if attempt is None:
            raise AttemptNotFoundError(f"Attempt {attempt_id} not found")

        questions_with_answers = []
        for question in quiz.questions:
            answer = attempt.answers.get(question.id)
            question_data = question.to_dict(include_answer=True)

            if answer:
                question_data.update(
                    {
                        "user_response": answer.response,
                        "is_correct": answer.is_correct,
                        "awarded_points": answer.awarded_points,
                    }
                )
            else:
                question_data.update(
                    {
                        "user_response": None,
                        "is_correct": False,
                        "awarded_points": 0.0,
                    }
                )

            questions_with_answers.append(question_data)

        return {
            "attempt_id": attempt.attempt_id,
            "quiz_id": attempt.quiz_id,
            "user_id": attempt.user_id,
            "status": attempt.status.value,
            "score": attempt.score,
            "max_score": attempt.max_score,
            "percentage": (attempt.score / attempt.max_score * 100) if attempt.max_score > 0 else 0,
            "passed": attempt.passed,
            "passing_score": quiz.passing_score,
            "started_at": attempt.started_at.isoformat(),
            "submitted_at": attempt.submitted_at.isoformat() if attempt.submitted_at else None,
            "questions": questions_with_answers,
        }

    def cancel_attempt(self, attempt_id: str) -> QuizAttempt:
        """
        Cancel an in-progress attempt.

        Args:
            attempt_id: ID of the attempt to cancel

        Returns:
            Cancelled QuizAttempt

        Raises:
            AttemptNotFoundError: If attempt doesn't exist
            AttemptAlreadySubmittedError: If attempt is already submitted
        """
        attempt = self.repository.get_attempt(attempt_id)
        if attempt is None:
            raise AttemptNotFoundError(f"Attempt {attempt_id} not found")

        if attempt.status != AttemptStatus.IN_PROGRESS:
            raise AttemptAlreadySubmittedError(f"Attempt {attempt_id} is already finalized")

        attempt.status = AttemptStatus.CANCELLED
        self.repository.save_attempt(attempt)
        return attempt
