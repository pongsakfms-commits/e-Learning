export const calculateMean = (values: number[]): number | null => {
  if (values.length === 0) return null;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
};

export const calculateMedian = (values: number[]): number | null => {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
};

export const calculateStandardDeviation = (values: number[]): number | null => {
  if (values.length < 2) return null;
  const mean = calculateMean(values);
  if (mean === null) return null;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
};

export const calculateMinMax = (values: number[]): { min: number | null; max: number | null } => {
  if (values.length === 0) return { min: null, max: null };
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
};
