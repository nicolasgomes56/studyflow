import { queryClient } from '@/lib/queryClient';
import { goalService } from '@/services/goal.service';
import type { Goals } from '@/types/Goals';
import type { SaveGoalRequest } from '@/types/requests/goal.request';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const GOAL_KEY = 'goal';

export function useGoal() {
  const query = useQuery<Goals | null>({
    queryKey: [GOAL_KEY],
    queryFn: goalService.getGoal,
  });

  const upsertMutation = useMutation({
    mutationFn: async (goal: SaveGoalRequest) => {
      return goalService.saveGoal({
        ...goal,
        id: query.data?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GOAL_KEY] });
      toast.success('Meta salva com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao salvar meta', {
        description: error.message,
      });
    },
  });

  return {
    goal: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,

    saveGoal: upsertMutation.mutateAsync,
    isSaving: upsertMutation.isPending,
  };
}
