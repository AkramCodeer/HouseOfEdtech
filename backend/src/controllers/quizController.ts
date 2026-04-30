import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Quiz, QuizAttempt } from '../models/Quiz';
import Course from '../models/Course';
import { AuthRequest } from '../types';
import { createError } from '../middleware/errorHandler';

export const getQuizzesByCourse = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courseId = String(req.params.courseId);
    const quizzes = await Quiz.find({ course: new mongoose.Types.ObjectId(courseId) }).select('-questions.correctAnswer');
    res.json({ success: true, quizzes });
  } catch (err) {
    next(err);
  }
};

export const createQuiz = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courseId = String(req.params.courseId);
    const course = await Course.findById(courseId);
    if (!course) return next(createError('Course not found', 404));

    if (course.instructor.toString() !== req.user!.userId && req.user!.role !== 'admin') {
      return next(createError('Not authorized', 403));
    }

    const quiz = await Quiz.create({ ...req.body, course: new mongoose.Types.ObjectId(courseId) });
    res.status(201).json({ success: true, quiz });
  } catch (err) {
    next(err);
  }
};

export const submitQuiz = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const quizId = String(req.params.quizId);
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return next(createError('Quiz not found', 404));

    const { answers } = req.body as { answers: number[] };
    let correct = 0;

    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const attempt = await QuizAttempt.create({
      student: req.user!.userId,
      quiz: quiz._id,
      answers,
      score,
      passed,
    });

    const feedback = quiz.questions.map((q, i) => ({
      question: q.question,
      yourAnswer: answers[i],
      correctAnswer: q.correctAnswer,
      isCorrect: answers[i] === q.correctAnswer,
      explanation: q.explanation,
    }));

    res.json({ success: true, score, passed, attempt, feedback });
  } catch (err) {
    next(err);
  }
};

export const generateAIQuiz = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const courseId = String(req.params.courseId);
    const course = await Course.findById(courseId);
    if (!course) return next(createError('Course not found', 404));

    if (course.instructor.toString() !== req.user!.userId && req.user!.role !== 'admin') {
      return next(createError('Not authorized', 403));
    }

    const { lessonContent, numQuestions = 5 } = req.body;
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) return next(createError('AI service not configured', 503));

    const prompt = `Generate ${numQuestions} multiple choice questions from this lesson content.
Return a JSON array with this exact format:
[{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": "..."
}]
Lesson content: ${lessonContent}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) return next(createError('AI generation failed', 502));

    const data = await response.json() as { choices: Array<{ message: { content: string } }> };
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return next(createError('Failed to parse AI response', 502));

    const questions = JSON.parse(jsonMatch[0]);
    const quiz = await Quiz.create({
      course: new mongoose.Types.ObjectId(courseId),
      title: `AI Generated Quiz - ${course.title}`,
      questions,
      isAIGenerated: true,
    });

    res.status(201).json({ success: true, quiz });
  } catch (err) {
    next(err);
  }
};
