"""Persistence layer for quiz attempts."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable, List, Optional, Protocol

from .attempts import AttemptStatus, QuizAttempt


class AttemptRepository(Protocol):
    """Abstract repository interface for quiz attempts."""

    def save_attempt(self, attempt: QuizAttempt) -> None:
        ...

    def get_attempt(self, attempt_id: str) -> Optional[QuizAttempt]:
        ...

    def list_attempts(self) -> List[QuizAttempt]:
        ...

    def list_attempts_by_quiz(self, quiz_id: str) -> List[QuizAttempt]:
        ...

    def get_attempts_by_user_and_quiz(self, user_id: str, quiz_id: str) -> List[QuizAttempt]:
        ...


class JsonAttemptRepository:
    """File-based repository storing attempts as JSON for easy reporting."""

    def __init__(self, storage_path: Path | str):
        self.storage_path = Path(storage_path)
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.storage_path.exists():
            self._write_attempts([])

    def save_attempt(self, attempt: QuizAttempt) -> None:
        attempts = self._read_attempts()
        updated = False
        for index, existing in enumerate(attempts):
            if existing.attempt_id == attempt.attempt_id:
                attempts[index] = attempt
                updated = True
                break
        if not updated:
            attempts.append(attempt)

        attempts = self._deduplicate_attempts(attempts)
        self._write_attempts(attempts)

    def get_attempt(self, attempt_id: str) -> Optional[QuizAttempt]:
        attempts = self._read_attempts()
        for attempt in attempts:
            if attempt.attempt_id == attempt_id:
                return attempt
        return None

    def list_attempts(self) -> List[QuizAttempt]:
        return self._read_attempts()

    def list_attempts_by_quiz(self, quiz_id: str) -> List[QuizAttempt]:
        return [attempt for attempt in self._read_attempts() if attempt.quiz_id == quiz_id]

    def get_attempts_by_user_and_quiz(self, user_id: str, quiz_id: str) -> List[QuizAttempt]:
        return [
            attempt
            for attempt in self._read_attempts()
            if attempt.quiz_id == quiz_id and attempt.user_id == user_id
        ]

    def _read_attempts(self) -> List[QuizAttempt]:
        if not self.storage_path.exists():
            return []

        data = json.loads(self.storage_path.read_text(encoding="utf-8"))
        return [QuizAttempt.from_dict(item) for item in data]

    def _write_attempts(self, attempts: Iterable[QuizAttempt]) -> None:
        attempt_dicts = [attempt.to_dict() for attempt in attempts]
        self.storage_path.write_text(
            json.dumps(attempt_dicts, ensure_ascii=False, indent=2), encoding="utf-8"
        )

    def _deduplicate_attempts(self, attempts: Iterable[QuizAttempt]) -> List[QuizAttempt]:
        """Ensure only the latest record for each attempt_id is persisted."""
        unique = {}
        for attempt in attempts:
            stored = unique.get(attempt.attempt_id)
            if stored is None or self._is_more_recent(attempt, stored):
                unique[attempt.attempt_id] = attempt
        return list(unique.values())

    @staticmethod
    def _is_more_recent(new_attempt: QuizAttempt, existing_attempt: QuizAttempt) -> bool:
        if new_attempt.submitted_at and existing_attempt.submitted_at:
            return new_attempt.submitted_at >= existing_attempt.submitted_at
        if new_attempt.submitted_at and not existing_attempt.submitted_at:
            return True
        if not new_attempt.submitted_at and existing_attempt.submitted_at:
            return False
        return new_attempt.started_at >= existing_attempt.started_at
