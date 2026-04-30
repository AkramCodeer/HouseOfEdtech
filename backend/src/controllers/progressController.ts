import { Response, NextFunction } from 'express';
import Progress from '../models/Progress';
import Course from '../models/Course';
import { AuthRequest } from '../types';
import { createError } from '../middleware/errorHandler';

export const getProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const progress = await Progress.findOne({
      student: req.user!.userId,
      course: req.params.courseId,
    }).populate('course', 'title thumbnail lessons');

    if (!progress) return next(createError('Progress not found', 404));
    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
};

export const markLessonComplete = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { courseId, lessonId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return next(createError('Course not found', 404));

    const progress = await Progress.findOne({ student: req.user!.userId, course: courseId });
    if (!progress) return next(createError('Not enrolled in this course', 403));

    const alreadyCompleted = progress.completedLessons.some(l => l.toString() === lessonId);
    if (!alreadyCompleted) {
      progress.completedLessons.push(new (require('mongoose').Types.ObjectId)(lessonId));
    }

    const totalLessons = course.lessons.length;
    progress.completionPercentage = totalLessons > 0
      ? Math.round((progress.completedLessons.length / totalLessons) * 100)
      : 0;
    progress.isCompleted = progress.completionPercentage === 100;
    progress.lastAccessedAt = new Date();

    await progress.save();
    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
};

export const getAllProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const progresses = await Progress.find({ student: req.user!.userId })
      .populate('course', 'title thumbnail instructor')
      .sort({ lastAccessedAt: -1 });
    res.json({ success: true, progresses });
  } catch (err) {
    next(err);
  }
};
