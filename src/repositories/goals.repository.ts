import { supabase } from '@/lib/supabase';
import type { UpsertGoalDTO } from '@/types/dtos/goal.dto';
import type { Goals } from '@/types/Goals';

export const goalsRepository = {
  async find(): Promise<Goals | null> {
    const { data, error } = await supabase
      .from('goals')
      .select('id, daily_hours, consider_weekends')
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async upsert(goal: UpsertGoalDTO): Promise<Goals> {
    const { data, error } = await supabase
      .from('goals')
      .upsert(goal)
      .select('id, daily_hours, consider_weekends')
      .single();

    if (error) throw error;
    return data;
  },
};
