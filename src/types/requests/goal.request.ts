export interface ISaveGoalReq {
  daily_hours: number;
  consider_weekends: boolean;
}

export interface IUpsertGoalReq extends ISaveGoalReq {
  id?: string;
}
