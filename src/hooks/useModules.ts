import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { modulesService } from '@/services/modules.service';
import type { CreateModuleRequest, UpdateModuleRequest } from '@/types/requests/module.request';

const getModulesKey = (courseId: string) => ['modules', courseId];
const getModuleKey = (moduleId: string) => ['module', moduleId];

export function useModules(courseId: string) {
  const query = useQuery({
    queryKey: getModulesKey(courseId),
    queryFn: () => modulesService.getModulesByCourse(courseId),
    enabled: !!courseId,
  });

  const createMutation = useMutation({
    mutationFn: (module: CreateModuleRequest) => modulesService.createModule(module),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getModulesKey(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Módulo adicionado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao adicionar módulo', {
        description: error.message,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ moduleId, input }: { moduleId: string; input: UpdateModuleRequest }) =>
      modulesService.updateModule(moduleId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getModulesKey(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Módulo atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar módulo', {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (moduleId: string) => modulesService.deleteModule(moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getModulesKey(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Módulo removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover módulo', {
        description: error.message,
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (moduleId: string) => modulesService.toggleModuleComplete(moduleId, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getModulesKey(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Módulo atualizado!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar módulo', {
        description: error.message,
      });
    },
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: ({ moduleIds, updates }: { moduleIds: string[]; updates: UpdateModuleRequest }) =>
      modulesService.bulkUpdateModules({ moduleIds, updates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getModulesKey(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Módulos atualizados com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar módulos', {
        description: error.message,
      });
    },
  });

  return {
    modules: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    createModule: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateModule: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteModule: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    toggleModule: toggleMutation.mutateAsync,
    isToggling: toggleMutation.isPending,

    bulkUpdateModules: bulkUpdateMutation.mutateAsync,
    isBulkUpdating: bulkUpdateMutation.isPending,
  };
}

export function useModule(moduleId: string) {
  const query = useQuery({
    queryKey: getModuleKey(moduleId),
    queryFn: () => modulesService.getModuleById(moduleId),
    enabled: !!moduleId,
  });

  return {
    module: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
