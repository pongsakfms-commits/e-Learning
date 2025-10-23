"""Data models for quiz questions and quizzes."""

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional, Union


class QuestionType(Enum):
    """Types of questions supported by the quiz system."""

    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    MATCHING = "matching"


@dataclass
class MultipleChoiceQuestion:
    """Multiple choice question with one correct answer."""

    id: str
    question_text: str
    options: List[str]
    correct_answer: int
    points: float = 1.0
    explanation: Optional[str] = None

    @property
    def question_type(self) -> QuestionType:
        return QuestionType.MULTIPLE_CHOICE

    def check_answer(self, answer: Any) -> bool:
        """Check if the provided answer is correct."""
        if not isinstance(answer, int):
            return False
        return answer == self.correct_answer

    def to_dict(self, include_answer: bool = False) -> Dict[str, Any]:
        """Convert question to dictionary, optionally including the correct answer."""
        data = {
            "id": self.id,
            "type": self.question_type.value,
            "question_text": self.question_text,
            "options": self.options,
            "points": self.points,
            "explanation": self.explanation,
        }
        if include_answer:
            data["correct_answer"] = self.correct_answer
        return data


@dataclass
class TrueFalseQuestion:
    """True/False question."""

    id: str
    question_text: str
    correct_answer: bool
    points: float = 1.0
    explanation: Optional[str] = None

    @property
    def question_type(self) -> QuestionType:
        return QuestionType.TRUE_FALSE

    def check_answer(self, answer: Any) -> bool:
        """Check if the provided answer is correct."""
        if not isinstance(answer, bool):
            return False
        return answer == self.correct_answer

    def to_dict(self, include_answer: bool = False) -> Dict[str, Any]:
        """Convert question to dictionary, optionally including the correct answer."""
        data = {
            "id": self.id,
            "type": self.question_type.value,
            "question_text": self.question_text,
            "points": self.points,
            "explanation": self.explanation,
        }
        if include_answer:
            data["correct_answer"] = self.correct_answer
        return data


@dataclass
class MatchingPair:
    """A single matching pair."""

    left: str
    right: str


@dataclass
class MatchingQuestion:
    """Matching question where items from the left must be matched to items on the right."""

    id: str
    question_text: str
    pairs: List[MatchingPair]
    points: float = 1.0
    explanation: Optional[str] = None

    @property
    def question_type(self) -> QuestionType:
        return QuestionType.MATCHING

    def check_answer(self, answer: Any) -> bool:
        """
        Check if the provided answer is correct.
        Answer should be a dict mapping left items to right items.
        """
        if not isinstance(answer, dict):
            return False

        correct_mapping = {pair.left: pair.right for pair in self.pairs}

        if set(answer.keys()) != set(correct_mapping.keys()):
            return False

        for left, right in answer.items():
            if correct_mapping.get(left) != right:
                return False

        return True

    def to_dict(self, include_answer: bool = False) -> Dict[str, Any]:
        """Convert question to dictionary, optionally including the correct answer."""
        left_items = [pair.left for pair in self.pairs]
        right_items = [pair.right for pair in self.pairs]

        data = {
            "id": self.id,
            "type": self.question_type.value,
            "question_text": self.question_text,
            "left_items": left_items,
            "right_items": right_items,
            "points": self.points,
            "explanation": self.explanation,
        }
        if include_answer:
            data["correct_pairs"] = {pair.left: pair.right for pair in self.pairs}
        return data


Question = Union[MultipleChoiceQuestion, TrueFalseQuestion, MatchingQuestion]


@dataclass
class Quiz:
    """A quiz containing multiple questions."""

    id: str
    title: str
    description: str
    questions: List[Question]
    passing_score: float = 70.0
    time_limit_minutes: Optional[int] = None
    max_attempts: Optional[int] = None

    @property
    def total_points(self) -> float:
        """Calculate the total points available in this quiz."""
        return sum(q.points for q in self.questions)

    def get_question(self, question_id: str) -> Optional[Question]:
        """Get a specific question by ID."""
        for question in self.questions:
            if question.id == question_id:
                return question
        return None

    def to_dict(self, include_answers: bool = False) -> Dict[str, Any]:
        """Convert quiz to dictionary."""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "questions": [q.to_dict(include_answer=include_answers) for q in self.questions],
            "total_points": self.total_points,
            "passing_score": self.passing_score,
            "time_limit_minutes": self.time_limit_minutes,
            "max_attempts": self.max_attempts,
        }
