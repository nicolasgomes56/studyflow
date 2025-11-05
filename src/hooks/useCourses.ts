import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { coursesService } from '@/services/courses.service';
import type { Course, CreateCourseReq, UpdateCourseReq } from '@/types/Course';

const COURSES_KEY = 'courses';

export function useCourses() {
  const query = useQuery({
    queryKey: [COURSES_KEY],
    queryFn: () => coursesService.getCourses(),
  });

  const createMutation = useMutation({
    mutationFn: (course: CreateCourseReq) => coursesService.createCourse(course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
      toast.success('Curso criado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao criar curso');
    },
  });

  // Mutation para atualizar curso
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCourseReq }) =>
      coursesService.updateCourse(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
      toast.success('Curso atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar curso: ${error.message}`);
    },
  });

  // Mutation para deletar curso
  const deleteMutation = useMutation({
    mutationFn: (id: string) => coursesService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
      toast.success('Curso removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover curso: ${error.message}`);
    },
  });

  // Mutation para toggle módulo
  const toggleModuleMutation = useMutation({
    mutationFn: ({ courseId, moduleId }: { courseId: string; moduleId: string }) =>
      coursesService.toggleModuleComplete(courseId, moduleId),

    onMutate: async ({ courseId, moduleId }) => {
      // Cancela qualquer refetch em andamento para não sobrescrever nossa atualização otimista
      await queryClient.cancelQueries({ queryKey: [COURSES_KEY] });

      // Salva o estado anterior (snapshot) para rollback em caso de erro
      const previousCourses = queryClient.getQueryData<Course[]>([COURSES_KEY]);

      // Atualiza otimisticamente o cache
      queryClient.setQueryData<Course[]>([COURSES_KEY], (oldCourses) => {
        if (!oldCourses) return oldCourses;

        return oldCourses.map((course) => {
          if (course.id !== courseId) return course;

          // Atualiza o módulo específico
          const updatedModules = course.modules.map((module) => {
            if (module.id !== moduleId) return module;

            return {
              ...module,
              completed: !module.completed,
              completed_at: !module.completed ? new Date().toISOString() : null,
            };
          });

          // Recalcula o progresso do curso
          const completedModules = updatedModules.filter((m) => m.completed).length;
          const totalModules = updatedModules.length;
          const progress =
            totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

          return {
            ...course,
            modules: updatedModules,
            progress,
          };
        });
      });

      return { previousCourses };
    },

    // Se der erro, reverte para o estado anterior
    onError: (error: Error, _variables, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData([COURSES_KEY], context.previousCourses);
      }
      toast.error(`Erro ao atualizar módulo: ${error.message}`);
    },
  });

  return {
    // Query
    courses: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // Mutations
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
