import { Router } from 'express';
import timelineRoutes from './timelineRoutes.js';
import { getHealth } from '../controllers/timelineController.js';

const router = Router();

router.get('/health', getHealth);
router.use('/timeline', timelineRoutes);

export default router;
