import { Router } from 'express';
import { getProgress, markLessonComplete, getAllProgress } from '../controllers/progressController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', getAllProgress);
router.get('/:courseId', getProgress);
router.post('/:courseId/lessons/:lessonId/complete', authorize('student'), markLessonComplete);

export default router;
