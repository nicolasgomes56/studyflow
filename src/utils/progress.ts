import type { Course } from '@/types/Course';

export function getOverallProgress(courses: Course[]): {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  totalMinutes: number;
  completedHours: number;
  completedMinutes: number;
  overallProgress: number;
} {
  if (!courses || courses.length === 0) {
    return {
      totalCourses: 0,
      completedCourses: 0,
      totalHours: 0,
      totalMinutes: 0,
      completedHours: 0,
      completedMinutes: 0,
      overallProgress: 0,
    };
  }

  const totalCourses = courses.length;
  let completedCourses = 0;
  let totalMins = 0;
  let completedMins = 0;

  for (const course of courses) {
    const allModulesCompleted =
      course.modules.length > 0 && course.modules.every((m) => m.completed);
    if (allModulesCompleted) completedCourses++;

    for (const module of course.modules) {
      totalMins += module.hours * 60 + (module.minutes || 0);

      if (module.completed) {
        completedMins += module.hours * 60 + (module.minutes || 0);
      }
    }
  }

  const overallProgress = totalMins > 0 ? Math.round((completedMins / totalMins) * 100) : 0;

  return {
    totalCourses,
    completedCourses,
    totalHours: Math.floor(totalMins / 60),
    totalMinutes: totalMins % 60,
    completedHours: Math.floor(completedMins / 60),
    completedMinutes: completedMins % 60,
    overallProgress,
  };
}
