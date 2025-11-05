import type { Module } from './Module';

export interface Course {
  id: string;
  title: string;
  modules: Module[];
  total_hours: number;
  total_lessons: number;
  progress: number;
  created_at: string;
}

export interface CreateCourseReq {
  title: string;
  total_hours: number;
  total_lessons: number;
  modules?: Array<{
    title: string;
    lessons: number;
    hours: number;
    completed?: boolean;
    completedAt?: Date | null;
  }>;
}

export interface UpdateCourseReq {
  title?: string;
  total_hours?: number;
  total_lessons?: number;
}
