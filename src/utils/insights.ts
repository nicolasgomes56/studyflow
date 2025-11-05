import type { Course } from '@/types/Course';
import type { CourseInsight } from '@/types/CourseInsight';
import type { StudyGoal } from '@/types/Goals';

export function calculateInsights(courses: Course[], studyGoal: StudyGoal | null): CourseInsight[] {
  if (!studyGoal) return [];

  const insights: CourseInsight[] = [];

  for (const course of courses) {
    const completedModules = course.modules.filter((m) => m.completed).length;
    const totalModules = course.modules.length;

    if (completedModules === totalModules) continue;

    const remainingHours = course.modules
      .filter((m) => !m.completed)
      .reduce((sum, m) => sum + m.hours, 0);

    const daysToComplete = Math.ceil(remainingHours / studyGoal.dailyHours);

    insights.push({
      courseId: course.id,
      courseName: course.title,
      remainingHours,
      daysToComplete,
      estimatedCompletionDate: new Date(
        Date.now() + daysToComplete * 24 * 60 * 60 * 1000
      ).toLocaleDateString('pt-BR'),
    });
  }

  return insights.sort((a, b) => a.daysToComplete - b.daysToComplete);
}
