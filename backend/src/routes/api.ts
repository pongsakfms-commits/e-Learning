import { Router } from 'express';
import { getAdminDashboard } from '../controllers/dashboardController';

const router = Router();

router.get('/admin/dashboard/overview', getAdminDashboard);

export default router;
