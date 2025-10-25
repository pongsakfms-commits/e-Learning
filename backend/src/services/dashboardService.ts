import { parseISO, isAfter, isBefore, endOfDay, startOfDay } from 'date-fns';
import { dashboardCache, generateCacheKey } from '../config/cache';
import { examResults } from '../models/examResults';
import {
  DashboardFilters,
  DashboardMetrics,
  ExamResult,
  ScoreDistributionBin,
} from '../types/dashboard';
import {
  calculateMean,
  calculateMedian,
  calculateStandardDeviation,
  calculateMinMax,
} from '../utils/statistics';

const buildScoreDistribution = (results: ExamResult[]): ScoreDistributionBin[] => {
  const bins: ScoreDistributionBin[] = [
    { label: '0-20', range: [0, 20], count: 0 },
    { label: '21-40', range: [21, 40], count: 0 },
    { label: '41-60', range: [41, 60], count: 0 },
    { label: '61-80', range: [61, 80], count: 0 },
    { label: '81-90', range: [81, 90], count: 0 },
    { label: '91-100', range: [91, 100], count: 0 },
  ];

  results.forEach(result => {
    const score = (result.score / result.maxScore) * 100;
    const matchingBin = bins.find(bin => score >= bin.range[0] && score <= bin.range[1]);
    if (matchingBin) {
      matchingBin.count += 1;
    }
  });

  return bins;
};

const filterResults = (filters: DashboardFilters): ExamResult[] => {
  const { startDate, endDate, examType } = filters;

  return examResults.filter(result => {
    const completedAt = parseISO(result.completedAt);
    let isValid = true;

    if (startDate) {
      const start = startOfDay(parseISO(startDate));
      isValid = isValid && !isBefore(completedAt, start);
    }

    if (endDate) {
      const end = endOfDay(parseISO(endDate));
      isValid = isValid && !isAfter(completedAt, end);
    }

    if (examType) {
      isValid = isValid && result.examType === examType;
    }

    return isValid;
  });
};

const buildProficiencyLevels = (results: ExamResult[]): Record<string, number> => {
  return results.reduce<Record<string, number>>((acc, curr) => {
    acc[curr.proficiencyLevel] = (acc[curr.proficiencyLevel] || 0) + 1;
    return acc;
  }, {});
};

export const getDashboardMetrics = (filters: DashboardFilters): DashboardMetrics => {
  const cacheKey = generateCacheKey('dashboard-overview', filters);
  const cached = dashboardCache.get<DashboardMetrics>(cacheKey);
  if (cached) {
    return cached;
  }

  const filteredResults = filterResults(filters);
  const totalUniqueLearners = new Set(examResults.map(result => result.learnerId)).size;
  const distinctLearners = new Set(filteredResults.map(result => result.learnerId));
  const learnersCompletedExam = new Set(
    filteredResults.filter(result => result.passed).map(result => result.learnerId)
  ).size;
  const attempts = filteredResults.length;
  const scores = filteredResults.map(result => (result.score / result.maxScore) * 100);

  const average = calculateMean(scores);
  const median = calculateMedian(scores);
  const stdDev = calculateStandardDeviation(scores);
  const { min, max } = calculateMinMax(scores);

  const passCount = filteredResults.filter(result => result.passed).length;
  const passRatio = attempts > 0 ? passCount / attempts : null;

  const metrics: DashboardMetrics = {
    filterSummary: {
      startDate: filters.startDate,
      endDate: filters.endDate,
      examType: filters.examType,
      totalRecords: attempts,
    },
    totals: {
      totalLearners: totalUniqueLearners,
      filteredLearners: distinctLearners.size,
      learnersCompletedExam,
      attempts,
    },
    scores: {
      average,
      median,
      standardDeviation: stdDev,
      min,
      max,
    },
    passRatio,
    proficiencyLevels: buildProficiencyLevels(filteredResults),
    scoreDistribution: buildScoreDistribution(filteredResults),
  };

  dashboardCache.set(cacheKey, metrics);
  return metrics;
};
