export interface CreateCourseDTO {
  title: string;
}

export interface UpdateCourseDTO {
  title?: string;
  certificate_issued_at?: string | null;
  certificate_url?: string | null;
}

export interface CourseResponse {
  id: string;
  title: string;
  created_at: string;
}
