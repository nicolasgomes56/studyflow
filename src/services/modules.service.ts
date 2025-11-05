import { supabase } from '@/lib/supabase';
import type { CreateModuleReq, Module, UpdateModuleReq } from '@/types/Module';

export const modulesService = {
  // GET - Listar todos os módulos de um curso
  async getModulesByCourse(courseId: string): Promise<Module[]> {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data || [];
  },

  // GET - Buscar um módulo específico
  async getModuleById(moduleId: string): Promise<Module> {
    const { data, error } = await supabase.from('modules').select('*').eq('id', moduleId).single();

    if (error) throw error;

    return data;
  },

  // POST - Criar novo módulo
  async createModule(module: CreateModuleReq): Promise<Module> {
    const { data, error } = await supabase
      .from('modules')
      .insert({
        course_id: module.course_id,
        title: module.title,
        lessons: module.lessons,
        hours: module.hours,
        minutes: module.minutes,
        completed: module.completed || false,
        completed_at: null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // PATCH - Atualizar módulo
  async updateModule(moduleId: string, input: UpdateModuleReq): Promise<Module> {
    const { data, error } = await supabase
      .from('modules')
      .update(input)
      .eq('id', moduleId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },

  // DELETE - Deletar módulo
  async deleteModule(moduleId: string): Promise<void> {
    const { error } = await supabase.from('modules').delete().eq('id', moduleId);
    if (error) throw error;
  },

  // PATCH - Toggle completado
  async toggleModuleComplete(moduleId: string, courseId: string): Promise<Module> {
    // Buscar estado atual
    const { data: module, error: fetchError } = await supabase
      .from('modules')
      .select('completed')
      .eq('id', moduleId)
      .eq('course_id', courseId)
      .single();

    if (fetchError) throw fetchError;

    // Inverter o estado
    const newCompleted = !module.completed;
    const { data, error: updateError } = await supabase
      .from('modules')
      .update({
        completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null,
      })
      .eq('id', moduleId)
      .eq('course_id', courseId)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      id: data.id,
      title: data.title,
      lessons: data.lessons,
      hours: data.hours,
      minutes: data.minutes,
      completed: data.completed,
      completed_at: data.completed_at,
    };
  },

  // PATCH - Marcar múltiplos módulos como completos/incompletos
  async bulkUpdateModules(moduleIds: string[], updates: UpdateModuleReq): Promise<Module[]> {
    const { data, error } = await supabase
      .from('modules')
      .update(updates)
      .in('id', moduleIds)
      .select();

    if (error) throw error;

    return data;
  },
};
