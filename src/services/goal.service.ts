import { supabase } from '@/lib/supabase';
import type { Goals } from '@/types/Goals';

export const goalService = {
  getGoal: async () => {
    const { data, error } = await supabase.from('goals').select('*').limit(1).maybeSingle();

    if (error) throw error;
    return data;
  },

  createGoal: async (goal: Goals) => {
    const { data, error } = await supabase.from('goals').insert(goal).select().single();
    if (error) throw error;
    return data;
  },

  // Adicionar novo método para atualizar
  updateGoal: async (id: string, goal: Goals) => {
    const { data, error } = await supabase
      .from('goals')
      .update(goal)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
