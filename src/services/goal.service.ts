import { goalsRepository } from '@/repositories/goals.repository';
import type { Goals } from '@/types/Goals';
import type { SaveGoalRequest } from '@/types/requests/goal.request';

export const goalService = {
  async getGoal(): Promise<Goals | null> {
    return goalsRepository.find();
  },

  async saveGoal(goal: SaveGoalRequest & { id?: string }): Promise<Goals> {
    return goalsRepository.upsert(goal);
  },
};
