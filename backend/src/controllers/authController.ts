import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { AuthRequest } from '../types';
import { createError } from '../middleware/errorHandler';

const signToken = (userId: string, role: string, email: string): string => {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign({ userId, role, email }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions);
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError('Email already registered', 409));
    }

    const safeRole = role === 'instructor' ? 'instructor' : 'student';
    const user = await User.create({ name, email, password, role: safeRole });
    const token = signToken(user._id.toString(), user.role, user.email);

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(createError('Invalid email or password', 401));
    }

    const token = signToken(user._id.toString(), user.role, user.email);
    res.json({ success: true, token, user });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId).populate('enrolledCourses', 'title thumbnail');
    if (!user) return next(createError('User not found', 404));
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!.userId,
      { name, bio, avatar },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};
