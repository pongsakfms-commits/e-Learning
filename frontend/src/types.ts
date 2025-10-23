export interface Student {
  id: number;
  name: string;
  email: string;
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
}

export interface AttemptSummary {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  quizId: number;
  quizTitle: string;
  startedAt: string;
  completedAt: string | null;
  score: number;
  maxScore: number;
  percentage: number;
  status: string;
  attemptCount: number;
  lastAuditNote?: string | null;
  lastAuditAt?: string | null;
}

export interface AttemptDetail {
  id: number;
  student: Student;
  quiz: Quiz;
  startedAt: string;
  completedAt: string | null;
  score: number;
  maxScore: number;
  percentage: number;
  status: string;
  answers: Array<{
    id: number;
    question: string;
    learnerAnswer: string | null;
    correctAnswer: string | null;
    isCorrect: boolean;
    points: number;
    maxPoints: number;
  }>;
  auditLog: Array<{
    id: number;
    action: string;
    note: string | null;
    previousScore: number | null;
    newScore: number | null;
    actor: string | null;
    createdAt: string;
  }>;
}
