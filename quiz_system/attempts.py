"""Models describing quiz attempts and answer tracking."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, Iterable, List, Optional


class AttemptStatus(str, Enum):
    """Lifecycle states for a quiz attempt."""

    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    CANCELLED = "cancelled"


@dataclass
class AnswerRecord:
    """Represents a scored answer within a quiz attempt."""

    question_id: str
    response: Any
    awarded_points: float
    max_points: float
    is_correct: bool

    def to_dict(self) -> Dict[str, Any]:
        return {
            "question_id": self.question_id,
            "response": self.response,
            "awarded_points": self.awarded_points,
            "max_points": self.max_points,
            "is_correct": self.is_correct,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "AnswerRecord":
        return cls(
            question_id=data["question_id"],
            response=data.get("response"),
            awarded_points=float(data.get("awarded_points", 0.0)),
            max_points=float(data.get("max_points", 0.0)),
            is_correct=bool(data.get("is_correct", False)),
        )


@dataclass
class QuizAttempt:
    """Represents a user's attempt at a quiz."""

    attempt_id: str
    quiz_id: str
    user_id: str
    status: AttemptStatus = AttemptStatus.IN_PROGRESS
    responses: Dict[str, Any] = field(default_factory=dict)
    answers: Dict[str, AnswerRecord] = field(default_factory=dict)
    score: float = 0.0
    max_score: float = 0.0
    passed: bool = False
    started_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    submitted_at: Optional[datetime] = None

    def record_response(self, question_id: str, response: Any) -> None:
        """Record or overwrite a response for a question."""
        if self.status != AttemptStatus.IN_PROGRESS:
            raise ValueError("Cannot record responses on a finalized attempt.")
        self.responses[question_id] = response

    def clear_response(self, question_id: str) -> None:
        """Remove a response for a question."""
        if self.status != AttemptStatus.IN_PROGRESS:
            raise ValueError("Cannot modify responses on a finalized attempt.")
        self.responses.pop(question_id, None)

    def finalize(
        self,
        answers: Iterable[AnswerRecord],
        score: float,
        max_score: float,
        passed: bool,
        submitted_at: Optional[datetime] = None,
    ) -> None:
        """Finalize the attempt with graded answers."""
        self.answers = {answer.question_id: answer for answer in answers}
        self.score = score
        self.max_score = max_score
        self.passed = passed
        self.status = AttemptStatus.SUBMITTED
        self.submitted_at = submitted_at or datetime.now(timezone.utc)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "attempt_id": self.attempt_id,
            "quiz_id": self.quiz_id,
            "user_id": self.user_id,
            "status": self.status.value,
            "responses": self.responses,
            "answers": [answer.to_dict() for answer in self.answers.values()],
            "score": self.score,
            "max_score": self.max_score,
            "passed": self.passed,
            "started_at": self.started_at.isoformat(),
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "QuizAttempt":
        answers_data = data.get("answers", [])
        answers = {item["question_id"]: AnswerRecord.from_dict(item) for item in answers_data}

        started_at_raw = data.get("started_at")
        submitted_at_raw = data.get("submitted_at")

        started_at = (
            datetime.fromisoformat(started_at_raw)
            if started_at_raw
            else datetime.now(timezone.utc)
        )
        submitted_at = datetime.fromisoformat(submitted_at_raw) if submitted_at_raw else None

        return cls(
            attempt_id=data["attempt_id"],
            quiz_id=data["quiz_id"],
            user_id=data["user_id"],
            status=AttemptStatus(data.get("status", AttemptStatus.IN_PROGRESS)),
            responses=data.get("responses", {}),
            answers=answers,
            score=float(data.get("score", 0.0)),
            max_score=float(data.get("max_score", 0.0)),
            passed=bool(data.get("passed", False)),
            started_at=started_at,
            submitted_at=submitted_at,
        )
