import { queryClient } from '@/lib/queryClient';
import { goalService } from '@/services/goal.service';
import type { Goals } from '@/types/Goals';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useGoal() {
  const query = useQuery<Goals>({
    queryKey: ['goal'],
    queryFn: () => goalService.getGoal(),
  });

  // Mutation inteligente que cria ou atualiza dependendo se já existe
  const upsertMutation = useMutation({
    mutationFn: async (goal: Goals) => {
      // Se já existe um goal, atualiza. Senão, cria
      if (query.data?.id) {
        return goalService.updateGoal(query.data.id, goal);
      }
      return goalService.createGoal(goal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal'] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    // Query
    goal: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    // Mutations
    saveGoal: upsertMutation.mutateAsync, // Nome mais apropriado
    isSaving: upsertMutation.isPending,
  };
}
