export interface Module {
  id: string;
  title: string;
  lessons: number;
  hours: number;
  minutes: number;
  completed: boolean;
  completed_at?: string | null;
}

export interface CreateModuleReq {
  course_id: string;
  title: string;
  lessons: number;
  hours: number;
  minutes: number;
  completed?: boolean;
}

export interface UpdateModuleReq {
  title?: string;
  lessons?: number;
  hours?: number;
  minutes?: number;
  completed?: boolean;
  completed_at?: string | null;
}
