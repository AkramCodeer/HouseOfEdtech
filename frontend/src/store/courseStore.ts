import { create } from 'zustand';
import { Course, PaginatedCourses } from '@/lib/types';
import api from '@/lib/axios';

interface CourseFilters {
  search?: string;
  category?: string;
  level?: string;
  page?: number;
}

interface CourseState {
  courses: Course[];
  total: number;
  pages: number;
  currentPage: number;
  isLoading: boolean;
  selectedCourse: Course | null;
  fetchCourses: (filters?: CourseFilters) => Promise<void>;
  fetchCourseById: (id: string) => Promise<void>;
  enrollInCourse: (id: string) => Promise<void>;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  total: 0,
  pages: 1,
  currentPage: 1,
  isLoading: false,
  selectedCourse: null,

  fetchCourses: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<PaginatedCourses>('/courses', { params: filters });
      set({
        courses: data.courses,
        total: data.total,
        pages: data.pages,
        currentPage: data.page,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchCourseById: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/courses/${id}`);
      set({ selectedCourse: data.course, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  enrollInCourse: async (id) => {
    await api.post(`/courses/${id}/enroll`);
  },
}));
