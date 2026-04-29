import { api } from '@/lib/axios';
import type { Module } from '@/types/Module';
import type {
  IBulkUpdateModulesReq,
  ICreateModuleReq,
  IUpdateModuleReq,
} from '@/types/requests/module.request';

export const modulesService = {
  async getModulesByCourse(courseId: string): Promise<Module[]> {
    const { data } = await api.get<Module[]>(`/modules?courseId=${courseId}`);
    return data;
  },

  async getModuleById(moduleId: string): Promise<Module> {
    const { data } = await api.get<Module>(`/modules/${moduleId}`);
    return data;
  },

  async createModule(input: ICreateModuleReq): Promise<Module> {
    const { data: modules } = await api.post<Module[]>('/modules/bulk', [
      {
        course_id: input.course_id,
        title: input.title,
        lessons: input.lessons,
        hours: input.hours,
        minutes: input.minutes,
        completed: input.completed ?? false,
      },
    ]);

    return modules[0];
  },

  async updateModule(moduleId: string, input: IUpdateModuleReq): Promise<Module> {
    await api.patch(`/modules/${moduleId}`, input);
    return this.getModuleById(moduleId);
  },

  async deleteModule(moduleId: string): Promise<void> {
    await api.delete('/modules', { data: { ids: [moduleId] } });
  },

  async toggleModuleComplete(moduleId: string, courseId: string): Promise<Module> {
    await api.post(`/modules/${moduleId}/toggle?courseId=${courseId}`);
    return this.getModuleById(moduleId);
  },

  async bulkUpdateModules(request: IBulkUpdateModulesReq): Promise<Module[]> {
    const { moduleIds, updates } = request;

    await Promise.all(moduleIds.map((id) => api.patch(`/modules/${id}`, updates)));
    return Promise.all(moduleIds.map((id) => this.getModuleById(id)));
  },
};
