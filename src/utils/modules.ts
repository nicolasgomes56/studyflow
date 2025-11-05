import type { ModuleFormData } from '@/schemas/module.schema';
import { minutesToHours } from './time';

/**
 * Converte minutos em horas e retorna o total de horas de um módulo
 */
export function calculateModuleTotalHours(hours: number, minutes: number): number {
  return minutesToHours(hours, minutes);
}

/**
 * Processa um módulo convertendo minutos em horas
 */
export function processModuleForSubmission(module: ModuleFormData) {
  const totalHours = calculateModuleTotalHours(module.hours || 0, module.minutes || 0);
  return {
    title: module.title,
    lessons: module.lessons,
    hours: Math.round(totalHours * 100) / 100, // Arredondar para 2 casas decimais
    completed: module.completed,
  };
}

/**
 * Calcula o total de horas de todos os módulos
 */
export function calculateTotalHours(modules: ModuleFormData[]): number {
  return modules.reduce((total, module) => {
    const moduleHours = calculateModuleTotalHours(module.hours || 0, module.minutes || 0);
    return total + moduleHours;
  }, 0);
}

/**
 * Calcula o total de aulas de todos os módulos
 */
export function calculateTotalLessons(modules: ModuleFormData[]): number {
  return modules.reduce((total, module) => total + (module.lessons || 0), 0);
}

/**
 * Processa todos os módulos para submissão
 */
export function processModulesForSubmission(modules: ModuleFormData[]) {
  return modules.map(processModuleForSubmission);
}
