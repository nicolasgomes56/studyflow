export interface CreateCourseRequest {
  title: string;
  modules?: Array<{
    title: string;
    lessons: number;
    hours: number;
    minutes: number;
    completed?: boolean;
  }>;
}

export interface UpdateCourseRequest {
  title?: string;
  modules?: Array<{
    id?: string;
    title: string;
    lessons: number;
    hours: number;
    minutes: number;
    completed?: boolean;
  }>;
}
