import { api } from '@/lib/axios';
import type { Course } from '@/types/Course';
import type { ICourseResp } from '@/types/responses/course.response';
import type {
  ICreateCoursePayloadReq,
  ICreateCourseReq,
  IUpdateCoursePayloadReq,
  IUpdateCourseReq,
} from '@/types/requests/course.request';
import type { Module } from '@/types/Module';
import type { ICreateModuleReq, IUpdateModuleReq } from '@/types/requests/module.request';

const sortModules = (modules: Module[]) =>
  [...modules].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

export const coursesService = {
  async getCourses(): Promise<Course[]> {
    const { data } = await api.get<Course[]>('/courses');
    return data.map((course) => ({ ...course, modules: sortModules(course.modules) }));
  },

  async getCourseById(id: string): Promise<Course> {
    const { data } = await api.get<Course>(`/courses/${id}`);
    return { ...data, modules: sortModules(data.modules) };
  },

  async createCourse(input: ICreateCourseReq): Promise<Course> {
    const { modules, ...courseData } = input;

    const payload: ICreateCoursePayloadReq = { title: courseData.title };
    const { data: course } = await api.post<ICourseResp>('/courses', payload);

    if (modules && modules.length > 0) {
      const modulesToCreate: ICreateModuleReq[] = modules.map((m) => ({
        course_id: course.id,
        title: m.title,
        lessons: m.lessons,
        hours: m.hours,
        minutes: m.minutes,
        completed: m.completed ?? false,
      }));

      await api.post('/modules/bulk', modulesToCreate);
    }

    return this.getCourseById(course.id);
  },

  async updateCourse(id: string, input: IUpdateCourseReq): Promise<Course> {
    const { modules, ...courseData } = input;

    if (Object.keys(courseData).length > 0) {
      const payload: IUpdateCoursePayloadReq = { title: courseData.title };
      await api.patch(`/courses/${id}`, payload);
    }

    if (modules && modules.length > 0) {
      const { data: existingModules } = await api.get<Module[]>(`/modules?courseId=${id}`);
      const existingIds = existingModules.map((m) => m.id);

      const modulesToUpdate = modules.filter((m) => m.id);
      const modulesToCreate = modules.filter((m) => !m.id);
      const updatedIds = modulesToUpdate.map((m) => m.id as string);
      const modulesToDelete = existingIds.filter((id) => !updatedIds.includes(id));

      await Promise.all([
        modulesToDelete.length > 0 ? api.delete('/modules', { data: { ids: modulesToDelete } }) : null,
        modulesToCreate.length > 0
          ? api.post(
              '/modules/bulk',
              modulesToCreate.map((m) => ({
                course_id: id,
                title: m.title,
                lessons: m.lessons,
                hours: m.hours,
                minutes: m.minutes,
                completed: m.completed ?? false,
              }))
            )
          : null,
        modulesToUpdate.length > 0
          ? Promise.all(
              modulesToUpdate.map((m) => {
                const payload: IUpdateModuleReq = {
                  title: m.title,
                  lessons: m.lessons,
                  hours: m.hours,
                  minutes: m.minutes,
                  completed: m.completed,
                };
                return api.patch(`/modules/${m.id as string}`, payload);
              })
            )
          : null,
      ]);
    }

    return this.getCourseById(id);
  },

  async deleteCourse(id: string): Promise<void> {
    await api.delete(`/courses/${id}`);
  },

  async toggleModuleComplete(courseId: string, moduleId: string): Promise<void> {
    await api.post(`/modules/${moduleId}/toggle?courseId=${courseId}`);
  },
};
