export interface ICreateModuleReq {
  course_id: string;
  title: string;
  lessons: number;
  hours: number;
  minutes: number;
  completed?: boolean;
}

export interface IUpdateModuleReq {
  title?: string;
  lessons?: number;
  hours?: number;
  minutes?: number;
  completed?: boolean;
}

export interface IBulkUpdateModulesReq {
  moduleIds: string[];
  updates: IUpdateModuleReq;
}
