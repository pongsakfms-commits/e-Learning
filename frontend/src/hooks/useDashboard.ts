import { useState, useEffect } from 'react';
import { DashboardMetrics, DashboardFilterState } from '../types/dashboard';

export const useDashboard = (filters: DashboardFilterState) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.examType) params.append('examType', filters.examType);

        const queryString = params.toString();
        const url = queryString
          ? `/api/admin/dashboard/overview?${queryString}`
          : '/api/admin/dashboard/overview';

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard metrics');
        }

        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [filters.startDate, filters.endDate, filters.examType]);

  return { metrics, loading, error };
};
