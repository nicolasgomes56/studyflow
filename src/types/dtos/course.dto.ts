export interface CreateCourseDTO {
  title: string;
}

export interface UpdateCourseDTO {
  title?: string;
}

export interface CourseResponse {
  id: string;
  title: string;
  created_at: string;
}
