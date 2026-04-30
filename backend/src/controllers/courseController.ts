import { Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Course from '../models/Course';
import Progress from '../models/Progress';
import User from '../models/User';
import { AuthRequest } from '../types';
import { createError } from '../middleware/errorHandler';

export const generateThumbnail = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description } = req.body as { title: string; description: string };
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) return next(createError('AI service not configured', 503));

    const prompt = `Given this course title: "${title}" and description: "${description}", respond with ONLY 2-3 comma-separated keywords (no explanation, no punctuation except commas) that best represent the visual subject for a course thumbnail image. Example output: javascript,programming,code`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 30,
      }),
    });

    if (!response.ok) return next(createError('AI thumbnail generation failed', 502));

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const keywords = data.choices[0].message.content.trim().replace(/[^a-zA-Z0-9,\s]/g, '').replace(/\s+/g, '+');
    const thumbnailUrl = `https://source.unsplash.com/800x450/?${keywords}`;

    res.json({ success: true, thumbnailUrl, keywords });
  } catch (err) {
    next(err);
  }
};

export const getAllCourses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, category, level, page = 1, limit = 12 } = req.query;
    const filter: Record<string, unknown> = { isPublished: true };

    if (search) filter.$text = { $search: search as string };
    if (category) filter.category = category;
    if (level) filter.level = level;

    const skip = (Number(page) - 1) * Number(limit);
    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate('instructor', 'name avatar')
        .select('-lessons')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Course.countDocuments(filter),
    ]);

    res.json({ success: true, courses, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
};

export const getCourseById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name avatar bio');
    if (!course) return next(createError('Course not found', 404));
    res.json({ success: true, course });
  } catch (err) {
    next(err);
  }
};

export const createCourse = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    // Auto-assign order to lessons if not provided
    if (req.body.lessons) {
      req.body.lessons.forEach((lesson: any, index: number) => {
        if (!lesson.order) {
          lesson.order = index + 1;
        }
      });
    }

    const course = await Course.create({ ...req.body, instructor: req.user!.userId });
    res.status(201).json({ success: true, course });
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return next(createError('Course not found', 404));

    if (course.instructor.toString() !== req.user!.userId && req.user!.role !== 'admin') {
      return next(createError('Not authorized to update this course', 403));
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, course: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return next(createError('Course not found', 404));

    if (course.instructor.toString() !== req.user!.userId && req.user!.role !== 'admin') {
      return next(createError('Not authorized to delete this course', 403));
    }

    await Course.findByIdAndDelete(req.params.id);
    await Progress.deleteMany({ course: req.params.id });
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const enrollCourse = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || !course.isPublished) return next(createError('Course not found', 404));

    const userId = req.user!.userId;
    if (course.enrolledStudents.some(s => s.toString() === userId)) {
      return next(createError('Already enrolled in this course', 409));
    }

    await Promise.all([
      Course.findByIdAndUpdate(req.params.id, { $push: { enrolledStudents: userId } }),
      User.findByIdAndUpdate(userId, { $push: { enrolledCourses: course._id } }),
      Progress.create({ student: userId, course: course._id }),
    ]);

    res.json({ success: true, message: 'Enrolled successfully' });
  } catch (err) {
    next(err);
  }
};

export const addLesson = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return next(createError('Course not found', 404));

    if (course.instructor.toString() !== req.user!.userId && req.user!.role !== 'admin') {
      return next(createError('Not authorized', 403));
    }

    const order = course.lessons.length + 1;
    course.lessons.push({ ...req.body, order } as never);
    await course.save();

    res.status(201).json({ success: true, course });
  } catch (err) {
    next(err);
  }
};

export const getInstructorCourses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courses = await Course.find({ instructor: req.user!.userId })
      .select('-lessons')
      .sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (err) {
    next(err);
  }
};
