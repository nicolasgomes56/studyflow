import { api } from '@/lib/axios';
import type { Goals } from '@/types/Goals';
import type { IUpsertGoalReq } from '@/types/requests/goal.request';

export const goalService = {
  async getGoal(): Promise<Goals | null> {
    const { data } = await api.get<Goals | null>('/goals');
    return data;
  },

  async saveGoal(goal: IUpsertGoalReq): Promise<Goals> {
    const { data } = await api.put<Goals>('/goals', goal);
    return data;
  },
};
