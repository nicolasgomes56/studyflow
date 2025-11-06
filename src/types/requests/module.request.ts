export interface CreateModuleRequest {
  course_id: string;
  title: string;
  lessons: number;
  hours: number;
  minutes: number;
  completed?: boolean;
}

export interface UpdateModuleRequest {
  title?: string;
  lessons?: number;
  hours?: number;
  minutes?: number;
  completed?: boolean;
}

export interface BulkUpdateModulesRequest {
  moduleIds: string[];
  updates: UpdateModuleRequest;
}
