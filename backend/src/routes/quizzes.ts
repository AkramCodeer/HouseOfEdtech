import { Router } from 'express';
import { getQuizById, getQuizzesByCourse, createQuiz, submitQuiz, generateAIQuiz } from '../controllers/quizController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/course/:courseId', authenticate, getQuizzesByCourse);
router.post('/course/:courseId', authenticate, authorize('instructor', 'admin'), createQuiz);
router.post('/course/:courseId/generate-ai', authenticate, authorize('instructor', 'admin'), generateAIQuiz);
router.get('/:quizId', authenticate, getQuizById);
router.post('/:quizId/submit', authenticate, submitQuiz);

export default router;
