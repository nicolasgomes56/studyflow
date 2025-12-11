import { supabase } from '@/lib/supabase';
import type { Course } from '@/types/Course';
import type { CourseResponse, CreateCourseDTO, UpdateCourseDTO } from '@/types/dtos/course.dto';

export const coursesRepository = {
  async findAll(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select(
        'id, title, created_at, certificate_issued_at, certificate_url, modules(id, title, lessons, hours, minutes, completed, created_at)'
      )
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Ordenar os módulos por created_at para garantir ordem consistente
    const courses = (data as Course[]).map((course) => ({
      ...course,
      modules: course.modules.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    }));

    return courses;
  },

  async findById(id: string): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .select(
        'id, title, created_at, certificate_issued_at, certificate_url, modules(id, title, lessons, hours, minutes, completed, created_at)'
      )
      .eq('id', id)
      .single();

    if (error) throw error;

    // Ordenar os módulos por created_at para garantir ordem consistente
    return {
      ...data,
      modules: data.modules.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    } as Course;
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
    const { error } = await supabase.from('courses').update(course).eq('id', id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('courses').delete().eq('id', id);

    if (error) throw error;
  },
};
