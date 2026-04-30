import { Request } from 'express';

export type UserRole = 'admin' | 'instructor' | 'student';

export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
