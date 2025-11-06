import { supabase } from '@/lib/supabase';
import type { CreateModuleDTO, UpdateModuleDTO } from '@/types/dtos/module.dto';
import type { Module } from '@/types/Module';

export const modulesRepository = {
  async findByCourseId(courseId: string): Promise<Module[]> {
    const { data, error } = await supabase
      .from('modules')
      .select('id, title, lessons, hours, minutes, completed, completed_at')
      .eq('course_id', courseId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as Module[];
  },

  async findById(id: string): Promise<Module> {
    const { data, error } = await supabase
      .from('modules')
      .select('id, title, lessons, hours, minutes, completed, completed_at')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Module;
  },

  async createMany(modules: CreateModuleDTO[]): Promise<Module[]> {
    if (modules.length === 0) return [];

    const { data, error } = await supabase
      .from('modules')
      .insert(modules)
      .select('id, title, lessons, hours, minutes, completed, completed_at');

    if (error) throw error;
    return data as Module[];
  },

  async update(id: string, module: UpdateModuleDTO): Promise<void> {
    const { error } = await supabase.from('modules').update(module).eq('id', id);

    if (error) throw error;
  },

  async updateMany(modules: Array<{ id: string } & UpdateModuleDTO>): Promise<void> {
    if (modules.length === 0) return;

    const updates = modules.map((module) => {
      const { id, ...data } = module;
      return supabase.from('modules').update(data).eq('id', id);
    });

    const results = await Promise.all(updates);
    const errors = results.filter((r) => r.error);
    if (errors.length > 0) throw errors[0].error;
  },

  async deleteMany(ids: string[]): Promise<void> {
    if (ids.length === 0) return;

    const { error } = await supabase.from('modules').delete().in('id', ids);

    if (error) throw error;
  },

  async toggleComplete(id: string, courseId: string): Promise<void> {
    const { data: module, error: fetchError } = await supabase
      .from('modules')
      .select('completed')
      .eq('id', id)
      .eq('course_id', courseId)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from('modules')
      .update({
        completed: !module.completed,
        completed_at: !module.completed ? new Date().toISOString() : null,
      })
      .eq('id', id);

    if (updateError) throw updateError;
  },
};
