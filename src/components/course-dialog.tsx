import { useCourses } from '@/hooks/useCourses';
import { type CourseFormData, courseFormSchema } from '@/schemas/course.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
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
  const { createCourse, isCreating, updateCourse, isUpdating, courseFormValues } =
    useCourses(courseId);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: courseFormValues ?? {
      title: '',
      modules: [],
    },
    values: courseFormValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'modules',
  });

  const onSubmit = async (data: CourseFormData) => {
    if (courseId) {
      await updateCourse({
        id: courseId,
        input: {
          title: data.title,
          modules: data.modules,
        },
      });
    } else {
      await createCourse({
        title: data.title,
        modules: data.modules,
      });
    }

    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    if (!courseId) {
      reset({ title: '', modules: [] });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{courseId ? 'Editar Curso' : 'Novo Curso'}</DialogTitle>
          <DialogDescription>
            Adicione um curso e seus módulos para começar a organizar seus estudos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Curso</Label>
            <Input
              id="title"
              {...register('title')}
              validation={errors.title}
              placeholder="Ex: React Avançado"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Módulos</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    title: '',
                    lessons: 0,
                    hours: 0,
                    minutes: 0,
                    completed: false,
                  })
                }
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Módulo
              </Button>
            </div>

            {fields.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum módulo adicionado. Clique em "Adicionar Módulo" para começar.
              </p>
            ) : (
              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex-1 items-start p-4 border rounded-lg bg-card space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Label>Título do módulo</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => remove(index)}
                          className="text-destructive hover:text-destructive shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Input
                          placeholder="Título do módulo"
                          {...register(`modules.${index}.title`)}
                          validation={errors.modules?.[index]?.title}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label>Aulas</Label>
                          <Input
                            type="number"
                            {...register(`modules.${index}.lessons`, {
                              valueAsNumber: true,
                            })}
                            validation={errors.modules?.[index]?.lessons}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Horas</Label>
                          <Input
                            type="number"
                            {...register(`modules.${index}.hours`, {
                              valueAsNumber: true,
                            })}
                            validation={errors.modules?.[index]?.hours}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Minutos</Label>
                          <Input
                            type="number"
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
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Salvando...' : 'Salvar Curso'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
