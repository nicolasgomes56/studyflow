import { useGoal } from '@/hooks/useGoal';
import type { Goals } from '@/types/Goals';
import { Target } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
  const { goal, saveGoal, isSaving, isLoading } = useGoal();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<Goals>({
    defaultValues: {
      daily_hours: goal?.daily_hours ?? 0,
      consider_weekends: goal?.consider_weekends ?? true,
    },
  });

  const onSubmit = async (data: Goals) => {
    await saveGoal(data);
    setOpen(false);
  };

  const handleClose = () => {
    reset({
      daily_hours: 0,
      consider_weekends: false,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open && !isLoading} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Target className="h-4 w-4" />
          Meta: {goal?.daily_hours}h/dia
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 py-4">
            <DialogHeader>
              <DialogTitle>Configurar Meta de Estudos</DialogTitle>
              <DialogDescription>
                Defina quantas horas por dia você pretende estudar para receber insights
                personalizados.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="daily-hours">Horas por dia</Label>
              <Input
                id="daily-hours"
                type="number"
                validation={errors.daily_hours}
                {...register('daily_hours')}
              />
              <p className="text-xs text-muted-foreground">
                Quantas horas você consegue dedicar aos estudos por dia?
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="weekends">Estudar nos fins de semana</Label>
                <p className="text-xs text-muted-foreground">Incluir sábado e domingo no cálculo</p>
              </div>
              <Controller
                name="consider_weekends"
                control={control}
                render={({ field }) => (
                  <Switch id="weekends" checked={field.value} onCheckedChange={field.onChange} />
                )}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar Meta'}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
