import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { modulesService } from '@/services/modules.service';
import type { CreateModuleReq, UpdateModuleReq } from '@/types/Module';

// Query keys
const getModulesKey = (courseId: string) => ['modules', courseId];
const getModuleKey = (moduleId: string) => ['module', moduleId];

export function useModules(courseId: string) {
  // Query para buscar módulos de um curso
  const query = useQuery({
    queryKey: getModulesKey(courseId),
    queryFn: () => modulesService.getModulesByCourse(courseId),
    enabled: !!courseId, // Só executa se courseId existir
  });

  // Mutation para criar módulo
  const createMutation = useMutation({
    mutationFn: (module: CreateModuleReq) => modulesService.createModule(module),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getModulesKey(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses'] }); // Invalida cursos também
      toast.success('Módulo adicionado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao adicionar módulo: ${error.message}`);
    },
  });

  // Mutation para atualizar módulo
  const updateMutation = useMutation({
    mutationFn: ({ moduleId, input }: { moduleId: string; input: UpdateModuleReq }) =>
      modulesService.updateModule(moduleId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getModulesKey(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Módulo atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar módulo: ${error.message}`);
    },
  });

  // Mutation para deletar módulo
  const deleteMutation = useMutation({
    mutationFn: (moduleId: string) => modulesService.deleteModule(moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getModulesKey(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Módulo removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover módulo: ${error.message}`);
    },
  });

  // Mutation para toggle módulo
  const toggleMutation = useMutation({
    mutationFn: (moduleId: string) => modulesService.toggleModuleComplete(moduleId, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getModulesKey(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Módulo atualizado!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar módulo: ${error.message}`);
    },
  });

  // Mutation para atualização em lote
  const bulkUpdateMutation = useMutation({
    mutationFn: ({ moduleIds, updates }: { moduleIds: string[]; updates: UpdateModuleReq }) =>
      modulesService.bulkUpdateModules(moduleIds, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getModulesKey(courseId) });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Módulos atualizados com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar módulos: ${error.message}`);
    },
  });

  return {
    // Query
    modules: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // Mutations
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

// Hook para buscar um módulo específico
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
