import type { ModuleFormData } from '@/schemas/module.schema';
import type { Module } from '@/types/Module';

export function calculateTotalLessons(modules: Array<Module | ModuleFormData>): number {
  return modules.reduce((total, module) => total + (module.lessons || 0), 0);
}

export function calculateTotalHoursAndMinutes(modules: Array<Module | ModuleFormData>): {
  hours: number;
  minutes: number;
} {
  const totalMinutes = modules.reduce((total, module) => {
    const hours = (module.hours || 0) * 60;
    const minutes = module.minutes || 0;
    return total + hours + minutes;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

export function calculateCourseProgress(modules: Module[]): number {
  if (!modules || modules.length === 0) return 0;

  const completedModules = modules.filter((m) => m.completed).length;
  const totalModules = modules.length;

  return totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
}
