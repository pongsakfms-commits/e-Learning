export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  examType?: string;
}

export interface ScoreDistributionBin {
  label: string;
  range: [number, number];
  count: number;
}

export interface DashboardMetrics {
  filterSummary: {
    startDate?: string;
    endDate?: string;
    examType?: string;
    totalRecords: number;
  };
  totals: {
    totalLearners: number;
    filteredLearners: number;
    learnersCompletedExam: number;
    attempts: number;
  };
  scores: {
    average: number | null;
    median: number | null;
    standardDeviation: number | null;
    min: number | null;
    max: number | null;
  };
  passRatio: number | null;
  proficiencyLevels: Record<string, number>;
  scoreDistribution: ScoreDistributionBin[];
}

export interface ExamResult {
  attemptId: string;
  learnerId: string;
  learnerName: string;
  examId: string;
  examTitle: string;
  examType: string;
  score: number;
  maxScore: number;
  passed: boolean;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  completedAt: string; // ISO
}
