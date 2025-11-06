export interface CreateModuleDTO {
  course_id: string;
  title: string;
  lessons: number;
  hours: number;
  minutes: number;
  completed?: boolean;
}

export interface UpdateModuleDTO {
  title?: string;
  lessons?: number;
  hours?: number;
  minutes?: number;
  completed?: boolean;
  completed_at?: string | null;
}

export interface ModuleResponse {
  id: string;
  title: string;
  lessons: number;
  hours: number;
  minutes: number;
  completed: boolean;
  completed_at: string | null;
}
