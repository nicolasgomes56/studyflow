import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import { useTransition } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { queryClient } from '@/lib/queryClient';
import { type CourseFormData, courseFormSchema } from '@/schemas/course.schema';
import { coursesService } from '@/services/courses.service';
import type { IUpdateCourseReq } from '@/types/requests/course.request';
import { toast } from 'sonner';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

interface CourseDialogProps {
  courseId?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDialog({ courseId, isOpen, onOpenChange }: CourseDialogProps) {
  const courseByIdQuery = useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => {
      if (!courseId) throw new Error('ID do curso é obrigatório');
      return coursesService.getCourseById(courseId);
    },
    enabled: !!courseId,
    select: (data) => ({
      title: data.title,
      modules: data.modules.map((module) => ({
        id: module.id,
        title: module.title,
        lessons: module.lessons,
        hours: module.hours,
        minutes: module.minutes,
        completed: module.completed,
      })),
    }),
  });

  const createMutation = useMutation({
    mutationFn: coursesService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Curso criado com sucesso!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: IUpdateCourseReq }) =>
      coursesService.updateCourse(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', variables.id] });
      toast.success('Curso atualizado com sucesso!');
    },
  });

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    values: courseByIdQuery.data ?? { title: '', modules: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'modules' });

  const onSubmit = (data: CourseFormData) => {
    startTransition(async () => {
      const action = courseId
        ? updateMutation.mutateAsync({ id: courseId, input: data })
        : createMutation.mutateAsync(data);

      await action;
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>{courseId ? 'Editar Curso' : 'Novo Curso'}</DialogTitle>
          <DialogDescription>
            Adicione um curso e seus módulos para começar a organizar seus estudos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Título do Curso</Label>
            <Input
              id='title'
              {...register('title')}
              validation={errors.title}
              placeholder='Ex: React Avançado'
            />
          </div>

          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Label>Módulos</Label>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() =>
                  append({ title: '', lessons: 0, hours: 0, minutes: 0, completed: false })
                }
                className='gap-2'
              >
                <Plus className='h-4 w-4' />
                Adicionar Módulo
              </Button>
            </div>

            {fields.length === 0 ? (
              <p className='text-sm text-muted-foreground text-center py-4'>
                Nenhum módulo adicionado. Clique em "Adicionar Módulo" para começar.
              </p>
            ) : (
              <ScrollArea className='h-[400px] w-full'>
                <div className='space-y-3'>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className='flex-1 items-start p-4 border rounded-lg bg-card space-y-3'
                    >
                      <div className='flex items-center justify-between gap-2'>
                        <Label>Título do módulo</Label>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon-sm'
                          onClick={() => remove(index)}
                          className='text-destructive hover:text-destructive shrink-0'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='space-y-2'>
                        <Input
                          placeholder='Título do módulo'
                          {...register(`modules.${index}.title`)}
                          validation={errors.modules?.[index]?.title}
                        />
                      </div>
                      <div className='grid grid-cols-3 gap-3'>
                        <div className='space-y-2'>
                          <Label>Aulas</Label>
                          <Input
                            type='number'
                            {...register(`modules.${index}.lessons`, {
                              valueAsNumber: true,
                            })}
                            validation={errors.modules?.[index]?.lessons}
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label>Horas</Label>
                          <Input
                            type='number'
                            {...register(`modules.${index}.hours`, {
                              valueAsNumber: true,
                            })}
                            validation={errors.modules?.[index]?.hours}
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label>Minutos</Label>
                          <Input
                            type='number'
                            {...register(`modules.${index}.minutes`, {
                              valueAsNumber: true,
                            })}
                            validation={errors.modules?.[index]?.minutes}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar Curso'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
