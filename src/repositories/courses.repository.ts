import { supabase } from '@/lib/supabase';
import type { Course } from '@/types/Course';
import type { CreateCourseDTO, UpdateCourseDTO, CourseResponse } from '@/types/dtos/course.dto';

export const coursesRepository = {
  async findAll(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, created_at, modules(id, title, lessons, hours, minutes, completed, completed_at)')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Course[];
  },

  async findById(id: string): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, created_at, modules(id, title, lessons, hours, minutes, completed, completed_at)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Course;
  },

  async create(course: CreateCourseDTO): Promise<CourseResponse> {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select('id, title, created_at')
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, course: UpdateCourseDTO): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .update(course)
      .eq('id', id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

