import { modulesRepository } from '@/repositories/modules.repository';
import type { Module } from '@/types/Module';
import type {
  BulkUpdateModulesRequest,
  CreateModuleRequest,
  UpdateModuleRequest,
} from '@/types/requests/module.request';

export const modulesService = {
  async getModulesByCourse(courseId: string): Promise<Module[]> {
    return modulesRepository.findByCourseId(courseId);
  },

  async getModuleById(moduleId: string): Promise<Module> {
    return modulesRepository.findById(moduleId);
  },

  async createModule(input: CreateModuleRequest): Promise<Module> {
    const modules = await modulesRepository.createMany([
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

  async updateModule(moduleId: string, input: UpdateModuleRequest): Promise<Module> {
    await modulesRepository.update(moduleId, input);
    return modulesRepository.findById(moduleId);
  },

  async deleteModule(moduleId: string): Promise<void> {
    await modulesRepository.deleteMany([moduleId]);
  },

  async toggleModuleComplete(moduleId: string, courseId: string): Promise<Module> {
    await modulesRepository.toggleComplete(moduleId, courseId);
    return modulesRepository.findById(moduleId);
  },

  async bulkUpdateModules(request: BulkUpdateModulesRequest): Promise<Module[]> {
    const { moduleIds, updates } = request;

    const modulesToUpdate = moduleIds.map((id) => ({
      id,
      ...updates,
    }));

    await modulesRepository.updateMany(modulesToUpdate);

    return Promise.all(moduleIds.map((id) => modulesRepository.findById(id)));
  },
};
