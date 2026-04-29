import { http, HttpResponse } from 'msw';
import { mockDb } from './data';

export const handlers = [
  http.get('/api/courses', () => {
    return HttpResponse.json(mockDb.getCourses());
  }),

  http.get('/api/courses/:id', ({ params }) => {
    const course = mockDb.getCourseById(params.id as string);
    if (!course) {
      return HttpResponse.json({ message: 'Curso nao encontrado' }, { status: 404 });
    }
    return HttpResponse.json(course);
  }),

  http.post('/api/courses', async ({ request }) => {
    const body = (await request.json()) as { title: string };
    if (!body.title?.trim()) {
      return HttpResponse.json({ message: 'Titulo e obrigatorio' }, { status: 400 });
    }
    return HttpResponse.json(mockDb.createCourse(body.title), { status: 201 });
  }),

  http.patch('/api/courses/:id', async ({ params, request }) => {
    const payload = (await request.json()) as {
      title?: string;
      certificate_issued_at?: string | null;
      certificate_url?: string | null;
    };

    const updated = mockDb.updateCourse(params.id as string, payload);
    if (!updated) {
      return HttpResponse.json({ message: 'Curso nao encontrado' }, { status: 404 });
    }

    return HttpResponse.json(null, { status: 204 });
  }),

  http.delete('/api/courses/:id', ({ params }) => {
    const removed = mockDb.deleteCourse(params.id as string);
    if (!removed) {
      return HttpResponse.json({ message: 'Curso nao encontrado' }, { status: 404 });
    }

    return HttpResponse.json(null, { status: 204 });
  }),

  http.get('/api/modules', ({ request }) => {
    const url = new URL(request.url);
    const courseId = url.searchParams.get('courseId');
    if (!courseId) {
      return HttpResponse.json({ message: 'courseId e obrigatorio' }, { status: 400 });
    }
    return HttpResponse.json(mockDb.getModulesByCourseId(courseId));
  }),

  http.get('/api/modules/:id', ({ params }) => {
    const module = mockDb.getModuleById(params.id as string);
    if (!module) {
      return HttpResponse.json({ message: 'Modulo nao encontrado' }, { status: 404 });
    }
    const { course_id: _, ...rest } = module;
    return HttpResponse.json(rest);
  }),

  http.post('/api/modules/bulk', async ({ request }) => {
    const payload = (await request.json()) as Array<{
      course_id: string;
      title: string;
      lessons: number;
      hours: number;
      minutes: number;
      completed?: boolean;
    }>;

    const normalized = payload.map((module) => ({
      ...module,
      completed: module.completed ?? false,
    }));

    return HttpResponse.json(mockDb.createModules(normalized), { status: 201 });
  }),

  http.patch('/api/modules/:id', async ({ params, request }) => {
    const payload = (await request.json()) as {
      title?: string;
      lessons?: number;
      hours?: number;
      minutes?: number;
      completed?: boolean;
    };

    const updated = mockDb.updateModule(params.id as string, payload);
    if (!updated) {
      return HttpResponse.json({ message: 'Modulo nao encontrado' }, { status: 404 });
    }

    return HttpResponse.json(null, { status: 204 });
  }),

  http.delete('/api/modules', async ({ request }) => {
    const payload = (await request.json()) as { ids: string[] };
    mockDb.deleteModules(payload.ids ?? []);
    return HttpResponse.json(null, { status: 204 });
  }),

  http.post('/api/modules/:id/toggle', ({ params, request }) => {
    const url = new URL(request.url);
    const courseId = url.searchParams.get('courseId');
    const module = mockDb.getModuleById(params.id as string);
    if (!module || module.course_id !== courseId) {
      return HttpResponse.json({ message: 'Modulo nao encontrado' }, { status: 404 });
    }

    mockDb.updateModule(module.id, { completed: !module.completed });
    return HttpResponse.json(null, { status: 204 });
  }),

  http.get('/api/goals', () => {
    return HttpResponse.json(mockDb.getGoal());
  }),

  http.put('/api/goals', async ({ request }) => {
    const payload = (await request.json()) as {
      id?: string;
      daily_hours: number;
      consider_weekends: boolean;
    };
    return HttpResponse.json(mockDb.upsertGoal(payload));
  }),

  http.post('/api/storage/certificates', async ({ request }) => {
    const form = await request.formData();
    const courseId = form.get('courseId')?.toString();
    const file = form.get('file');

    if (!courseId || !(file instanceof File)) {
      return HttpResponse.json({ message: 'Dados de upload invalidos' }, { status: 400 });
    }

    const certificateUrl = URL.createObjectURL(file);
    return HttpResponse.json({ url: certificateUrl });
  }),

  http.delete('/api/storage/certificates', () => {
    return HttpResponse.json(null, { status: 204 });
  }),
];
