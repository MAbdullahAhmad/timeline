import { Router } from 'express';
import { getRootsHandler, getItemHandler, getChildrenHandler } from '../controllers/timelineController.js';

const router = Router();

router.get('/roots', getRootsHandler);
router.get('/items/:id', getItemHandler);
router.get('/items/:id/children', getChildrenHandler);

export default router;
