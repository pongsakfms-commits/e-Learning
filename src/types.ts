export interface Learner {
  id: string;
  name: string;
  email?: string;
  metadata?: Record<string, any>;
}

export interface Activity {
  id: string;
  title: string;
  metadata?: Record<string, any>;
}

export interface Score {
  value: number;
  max?: number;
  grade?: string;
  metadata?: Record<string, any>;
}

export interface LearnerScorePayload {
  learner: Learner;
  activity: Activity;
  score: Score;
  completedAt: Date;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  worksheetLearnerData: string;
  worksheetScores: string;
  serviceAccountEmail: string;
  privateKey: string;
  maxRetryAttempts: number;
  retryInitialDelayMs: number;
}
