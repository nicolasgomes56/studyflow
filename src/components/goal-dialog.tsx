import { useMutation, useQuery } from '@tanstack/react-query';
import { Target } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { queryClient } from '@/lib/queryClient';
import { goalService } from '@/services/goal.service';
import type { ISaveGoalReq } from '@/types/requests/goal.request';
import { toast } from 'sonner';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

export function GoalDialog() {
  const [open, setOpen] = useState(false);
  const { data: goal, isLoading } = useQuery({
    queryKey: ['goal'],
    queryFn: goalService.getGoal,
  });
  const saveGoalMutation = useMutation({
    mutationFn: goalService.saveGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal'] });
      toast.success('Meta salva com sucesso!');
    },
  });
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<ISaveGoalReq>({
    values: goal
      ? { daily_hours: goal.daily_hours, consider_weekends: goal.consider_weekends }
      : { daily_hours: 1, consider_weekends: true },
  });

  const onSubmit = (data: ISaveGoalReq) => {
    startTransition(async () => {
      await saveGoalMutation.mutateAsync({
        ...data,
        id: goal?.id,
      });
      setOpen(false);
    });
  };

  return (
    <Dialog open={open && !isLoading} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' className='gap-2 bg-transparent'>
          <Target className='h-4 w-4' />
          Meta: {goal?.daily_hours}h/dia
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-6 py-4'>
            <DialogHeader>
              <DialogTitle>Configurar Meta de Estudos</DialogTitle>
              <DialogDescription>
                Defina quantas horas por dia você pretende estudar para receber insights
                personalizados.
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-2'>
              <Label htmlFor='daily-hours'>Horas por dia</Label>
              <Input
                id='daily-hours'
                type='number'
                validation={errors.daily_hours}
                {...register('daily_hours')}
              />
              <p className='text-xs text-muted-foreground'>
                Quantas horas você consegue dedicar aos estudos por dia?
              </p>
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='weekends'>Estudar nos fins de semana</Label>
                <p className='text-xs text-muted-foreground'>Incluir sábado e domingo no cálculo</p>
              </div>
              <Controller
                name='consider_weekends'
                control={control}
                render={({ field }) => (
                  <Switch id='weekends' checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>

            <DialogFooter>
              <Button
                variant='outline'
                type='button'
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar Meta'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
