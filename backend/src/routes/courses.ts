import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  addLesson,
  getInstructorCourses,
} from '../controllers/courseController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getAllCourses);
router.get('/my-courses', authenticate, authorize('instructor', 'admin'), getInstructorCourses);
router.get('/:id', getCourseById);

router.post('/', authenticate, authorize('instructor', 'admin'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
], createCourse);

router.put('/:id', authenticate, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', authenticate, authorize('instructor', 'admin'), deleteCourse);
router.post('/:id/enroll', authenticate, authorize('student'), enrollCourse);
router.post('/:id/lessons', authenticate, authorize('instructor', 'admin'), addLesson);

export default router;
