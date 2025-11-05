import type { Course } from '@/types/Course';

export function getOverallProgress(courses: Course[]): {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  completedHours: number;
  overallProgress: number;
} {
  if (!courses || courses.length === 0) {
    return {
      totalCourses: 0,
      completedCourses: 0,
      totalHours: 0,
      completedHours: 0,
      overallProgress: 0,
    };
  }

  const totalCourses = courses.length;
  let completedCourses = 0;
  let totalHours = 0;
  let completedHours = 0;

  for (const course of courses) {
    if (course.progress === 100) completedCourses++;

    totalHours += course.total_hours;

    for (const module of course.modules) {
      if (module.completed) {
        completedHours += module.hours;
      }
    }
  }

  const overallProgress = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;

  return {
    totalCourses,
    completedCourses,
    totalHours,
    completedHours,
    overallProgress,
  };
}
