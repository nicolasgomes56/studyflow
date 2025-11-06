import { queryClient } from '@/lib/queryClient';
import { coursesService } from '@/services/courses.service';
import type { Course } from '@/types/Course';
import type { UpdateCourseRequest } from '@/types/requests/course.request';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useOptimistic } from 'react';
import { toast } from 'sonner';

const COURSES_KEY = 'courses';

export function useCourses(courseId?: string) {
  const query = useQuery({
    queryKey: [COURSES_KEY],
    queryFn: coursesService.getCourses,
  });

  const [optimisticCourses, setOptimisticCourses] = useOptimistic(
    query.data ?? [],
    (state: Course[], { courseId, moduleId }: { courseId: string; moduleId: string }) => {
      return state.map((course) => {
        if (course.id !== courseId) return course;

        return {
          ...course,
          modules: course.modules.map((module) => {
            if (module.id !== moduleId) return module;

            return {
              ...module,
              completed: !module.completed,
              completed_at: !module.completed ? new Date().toISOString() : null,
            };
          }),
        };
      });
    }
  );

  const courseByIdQuery = useQuery({
    queryKey: [COURSES_KEY, courseId],
    queryFn: () => {
      if (!courseId) throw new Error('ID do curso é obrigatório');
      return coursesService.getCourseById(courseId);
    },
    enabled: !!courseId,
    select: (data) => ({
      ...data,
      formValues: {
        title: data.title,
        modules: data.modules.map((module) => ({
          id: module.id,
          title: module.title,
          lessons: module.lessons,
          hours: module.hours,
          minutes: module.minutes,
          completed: module.completed,
        })),
      },
    }),
  });

  const createMutation = useMutation({
    mutationFn: coursesService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
      toast.success('Curso criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar curso', {
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCourseRequest }) =>
      coursesService.updateCourse(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
      queryClient.invalidateQueries({ queryKey: [COURSES_KEY, variables.id] });
      toast.success('Curso atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar curso', {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: coursesService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
      toast.success('Curso removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover curso', {
        description: error.message,
      });
    },
  });

  const toggleModuleMutation = useMutation({
    mutationFn: async ({ courseId, moduleId }: { courseId: string; moduleId: string }) => {
      setOptimisticCourses({ courseId, moduleId });

      return coursesService.toggleModuleComplete(courseId, moduleId);
    },

    onError: (error: Error) => {
      toast.error('Erro ao atualizar módulo', {
        description: error.message,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
    },
  });

  return {
    courses: optimisticCourses,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    course: courseByIdQuery.data,
    courseFormValues: courseByIdQuery.data?.formValues,
    isCourseLoading: courseByIdQuery.isLoading,
    isCourseError: courseByIdQuery.isError,
    courseError: courseByIdQuery.error,

    createCourse: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateCourse: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteCourse: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    toggleModuleComplete: toggleModuleMutation.mutateAsync,
    isTogglingModule: toggleModuleMutation.isPending,
  };
}
