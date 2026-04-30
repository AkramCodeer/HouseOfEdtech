export type UserRole = 'admin' | 'instructor' | 'student';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  enrolledCourses: string[] | Course[];
  createdAt: string;
}

export interface Lesson {
  _id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructor: User | string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  lessons: Lesson[];
  enrolledStudents: string[];
  tags: string[];
  isPublished: boolean;
  rating: number;
  totalRatings: number;
  createdAt: string;
}

export interface Progress {
  _id: string;
  student: string;
  course: Course | string;
  completedLessons: string[];
  completionPercentage: number;
  isCompleted: boolean;
  certificateIssued: boolean;
  lastAccessedAt: string;
}

export interface Question {
  _id: string;
  question: string;
  options: string[];
  explanation?: string;
}

export interface Quiz {
  _id: string;
  course: string;
  lesson?: string;
  title: string;
  questions: Question[];
  passingScore: number;
  isAIGenerated: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedCourses {
  courses: Course[];
  total: number;
  page: number;
  pages: number;
}
