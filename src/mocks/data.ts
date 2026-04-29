import type { Course, Goals, Module } from '@/types';

type ModuleRecord = Module & { course_id: string };

const now = new Date().toISOString();

let courses: Course[] = [
  {
    id: crypto.randomUUID(),
    title: 'React Avancado',
    created_at: now,
    certificate_issued_at: null,
    certificate_url: null,
    modules: [],
  },
];

let modules: ModuleRecord[] = [
  {
    id: crypto.randomUUID(),
    course_id: courses[0].id,
    title: 'Fundamentos',
    lessons: 12,
    hours: 4,
    minutes: 30,
    completed: false,
    created_at: now,
  },
];

courses = courses.map((course) => ({
  ...course,
  modules: modules
    .filter((module) => module.course_id === course.id)
    .map(({ course_id: _, ...module }) => module),
}));

let goals: Goals | null = null;

export const mockDb = {
  getCourses(): Course[] {
    return courses.map((course) => ({
      ...course,
      modules: modules
        .filter((module) => module.course_id === course.id)
        .map(({ course_id: _, ...module }) => module)
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
    }));
  },
  getCourseById(id: string): Course | null {
    const course = courses.find((item) => item.id === id);
    if (!course) return null;

    return {
      ...course,
      modules: modules
        .filter((module) => module.course_id === id)
        .map(({ course_id: _, ...module }) => module)
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
    };
  },
  createCourse(title: string): Pick<Course, 'id' | 'title' | 'created_at'> {
    const course = {
      id: crypto.randomUUID(),
      title,
      created_at: new Date().toISOString(),
      certificate_issued_at: null,
      certificate_url: null,
      modules: [],
    };
    courses.push(course);
    return {
      id: course.id,
      title: course.title,
      created_at: course.created_at,
    };
  },
  updateCourse(
    id: string,
    payload: Partial<
      Pick<Course, 'title' | 'certificate_issued_at' | 'certificate_url'>
    >
  ): boolean {
    const index = courses.findIndex((course) => course.id === id);
    if (index < 0) return false;

    courses[index] = {
      ...courses[index],
      ...payload,
    };
    return true;
  },
  deleteCourse(id: string): boolean {
    const previousLength = courses.length;
    courses = courses.filter((course) => course.id !== id);
    modules = modules.filter((module) => module.course_id !== id);
    return courses.length < previousLength;
  },
  getModulesByCourseId(courseId: string): Module[] {
    return modules
      .filter((module) => module.course_id === courseId)
      .map(({ course_id: _, ...module }) => module)
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
  },
  getModuleById(id: string): ModuleRecord | null {
    return modules.find((module) => module.id === id) ?? null;
  },
  createModules(
    payload: Array<Omit<ModuleRecord, 'id' | 'created_at'>>
  ): Module[] {
    const created = payload.map((module) => ({
      ...module,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }));

    modules.push(...created);
    return created.map(({ course_id: _, ...module }) => module);
  },
  updateModule(
    id: string,
    payload: Partial<Pick<Module, 'title' | 'lessons' | 'hours' | 'minutes' | 'completed'>>
  ): boolean {
    const index = modules.findIndex((module) => module.id === id);
    if (index < 0) return false;

    modules[index] = {
      ...modules[index],
      ...payload,
    };
    return true;
  },
  deleteModules(ids: string[]): void {
    modules = modules.filter((module) => !ids.includes(module.id));
  },
  getGoal(): Goals | null {
    return goals;
  },
  upsertGoal(payload: { id?: string; daily_hours: number; consider_weekends: boolean }): Goals {
    goals = {
      id: payload.id ?? goals?.id ?? crypto.randomUUID(),
      daily_hours: payload.daily_hours,
      consider_weekends: payload.consider_weekends,
    };
    return goals;
  },
};
