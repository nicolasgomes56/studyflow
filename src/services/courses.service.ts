import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { Course, CreateCourseReq, UpdateCourseReq } from '@/types/Course';
import type { Module } from '@/types/Module';

export const coursesService = {
  // GET - Listar todos os cursos
  async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*, modules(*)')
      .order('created_at', { ascending: true });

    if (error) {
      toast.error('Erro ao listar cursos', {
        description: error.message,
      });
      return [];
    }

    return data;
  },

  // POST - Criar um novo curso
  async createCourse(course: CreateCourseReq): Promise<Course> {
    // Separar modules do objeto course antes de inserir
    const { modules, ...courseData } = course;

    const { data, error } = await supabase.from('courses').insert(courseData).select().single();

    if (error) {
      toast.error('Erro ao criar curso', {
        description: error.message,
      });
      throw error;
    }

    // Inserir os módulos do curso
    if (modules && modules.length > 0) {
      const modulesMap = modules.map((module) => ({
        ...module,
        course_id: data.id,
      }));

      const { error: modulesError } = await supabase.from('modules').insert(modulesMap).select();

      if (modulesError) throw modulesError;

      // Buscar curso completo com módulos
      const { data: fullCourse, error: fetchError } = await supabase
        .from('courses')
        .select('*, modules(*)')
        .eq('id', data.id)
        .single();

      if (fetchError) throw fetchError;

      return {
        id: fullCourse.id,
        title: fullCourse.title,
        total_hours: fullCourse.total_hours,
        total_lessons: fullCourse.total_lessons,
        progress: fullCourse.progress,
        created_at: fullCourse.created_at,
        modules: (fullCourse.modules || []).map((mod: Module) => ({
          id: mod.id,
          title: mod.title,
          lessons: mod.lessons,
          hours: mod.hours,
          minutes: mod.minutes,
          completed: mod.completed,
          completed_at: mod.completed_at,
        })),
      };
    }

    return data;
  },

  // PATCH - Atualizar curso
  async updateCourse(id: string, input: UpdateCourseReq): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .update(input)
      .eq('id', id)
      .select('*, modules(*)')
      .single();

    if (error) {
      toast.error('Erro ao atualizar curso', {
        description: error.message,
      });
    }

    return {
      id: data.id,
      title: data.title,
      total_hours: data.total_hours,
      total_lessons: data.total_lessons,
      progress: data.progress,
      created_at: data.created_at,
      modules: (data.modules || []).map((mod: any) => ({
        id: mod.id,
        title: mod.title,
        lessons: mod.lessons,
        hours: mod.hours,
        completed: mod.completed,
        completed_at: mod.completed_at,
      })),
    };
  },

  // DELETE - Deletar curso
  async deleteCourse(id: string): Promise<void> {
    // Primeiro deletar todos os módulos do curso
    const { error: modulesError } = await supabase.from('modules').delete().eq('course_id', id);

    if (modulesError) {
      toast.error('Erro ao deletar módulos', {
        description: modulesError.message,
      });
      throw modulesError;
    }

    // Depois deletar o curso
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) {
      toast.error('Erro ao deletar curso', {
        description: error.message,
      });
      throw error;
    }
  },

  // PATCH - Toggle módulo completado
  async toggleModuleComplete(courseId: string, moduleId: string): Promise<void> {
    // Primeiro buscar o estado atual
    const { data: module, error: fetchError } = await supabase
      .from('modules')
      .select('completed')
      .eq('id', moduleId)
      .eq('course_id', courseId)
      .single();

    if (fetchError) throw fetchError;

    // Inverter o estado
    const { error: updateError } = await supabase
      .from('modules')
      .update({
        completed: !module.completed,
        completed_at: !module.completed ? new Date().toISOString() : null,
      })
      .eq('id', moduleId)
      .eq('course_id', courseId);

    if (updateError) throw updateError;
  },
};
