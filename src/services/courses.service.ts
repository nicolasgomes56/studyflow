import { coursesRepository } from '@/repositories/courses.repository';
import { modulesRepository } from '@/repositories/modules.repository';
import type { Course } from '@/types/Course';
import type { CreateCourseRequest, UpdateCourseRequest } from '@/types/requests/course.request';

export const coursesService = {
  async getCourses(): Promise<Course[]> {
    return coursesRepository.findAll();
  },

  async getCourseById(id: string): Promise<Course> {
    return coursesRepository.findById(id);
  },

  async createCourse(input: CreateCourseRequest): Promise<Course> {
    const { modules, ...courseData } = input;

    const course = await coursesRepository.create(courseData);

    if (modules && modules.length > 0) {
      const modulesToCreate = modules.map((m) => ({
        course_id: course.id,
        title: m.title,
        lessons: m.lessons,
        hours: m.hours,
        minutes: m.minutes,
        completed: m.completed ?? false,
      }));

      await modulesRepository.createMany(modulesToCreate);
    }

    return coursesRepository.findById(course.id);
  },

  async updateCourse(id: string, input: UpdateCourseRequest): Promise<Course> {
    const { modules, ...courseData } = input;

    if (Object.keys(courseData).length > 0) {
      await coursesRepository.update(id, courseData);
    }

    if (modules && modules.length > 0) {
      const existingModules = await modulesRepository.findByCourseId(id);
      const existingIds = existingModules.map((m) => m.id);

      const modulesToUpdate = modules.filter((m) => m.id);
      const modulesToCreate = modules.filter((m) => !m.id);
      const updatedIds = modulesToUpdate.map((m) => m.id as string);
      const modulesToDelete = existingIds.filter((id) => !updatedIds.includes(id));

      await Promise.all([
        modulesToDelete.length > 0 ? modulesRepository.deleteMany(modulesToDelete) : Promise.resolve(),
        modulesToCreate.length > 0
          ? modulesRepository.createMany(
              modulesToCreate.map((m) => ({
                course_id: id,
                title: m.title,
                lessons: m.lessons,
                hours: m.hours,
                minutes: m.minutes,
                completed: m.completed ?? false,
              }))
            )
          : Promise.resolve(),
        modulesToUpdate.length > 0
          ? modulesRepository.updateMany(
              modulesToUpdate.map((m) => ({
                id: m.id as string,
                title: m.title,
                lessons: m.lessons,
                hours: m.hours,
                minutes: m.minutes,
                completed: m.completed,
              }))
            )
          : Promise.resolve(),
      ]);
    }

    return coursesRepository.findById(id);
  },

  async deleteCourse(id: string): Promise<void> {
    await coursesRepository.delete(id);
  },

  async toggleModuleComplete(courseId: string, moduleId: string): Promise<void> {
    await modulesRepository.toggleComplete(moduleId, courseId);
  },
};
