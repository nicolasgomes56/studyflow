export interface UpsertGoalDTO {
  id?: string;
  daily_hours: number;
  consider_weekends: boolean;
}

export interface GoalResponse {
  id: string;
  daily_hours: number;
  consider_weekends: boolean;
}
