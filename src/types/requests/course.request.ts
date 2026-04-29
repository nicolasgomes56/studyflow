export interface ICreateCourseReq {
  title: string;
  modules?: Array<{
    title: string;
    lessons: number;
    hours: number;
    minutes: number;
    completed?: boolean;
  }>;
}

export interface IUpdateCourseReq {
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

export interface ICreateCoursePayloadReq {
  title: string;
}

export interface IUpdateCoursePayloadReq {
  title?: string;
  certificate_issued_at?: string | null;
  certificate_url?: string | null;
}
