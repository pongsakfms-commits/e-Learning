import { Request, Response } from 'express';
import { getDashboardMetrics } from '../services/dashboardService';
import { DashboardFilters } from '../types/dashboard';

export const getAdminDashboard = (req: Request, res: Response): void => {
  try {
    const { startDate, endDate, examType } = req.query;

    const filters: DashboardFilters = {
      startDate: startDate as string | undefined,
      endDate: endDate as string | undefined,
      examType: examType as string | undefined,
    };

    const metrics = getDashboardMetrics(filters);
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
