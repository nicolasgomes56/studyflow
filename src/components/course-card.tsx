import { useCourses } from '@/hooks/useCourses';
import type { Course } from '@/types/Course';
import {
  calculateCourseProgress,
  calculateTotalHoursAndMinutes,
  calculateTotalLessons,
} from '@/utils/modules';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  ClockIcon,
  ListIcon,
  Loader2,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2,
} from 'lucide-react';
import { memo, useState, useTransition } from 'react';
import { CourseDialog } from './course-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';

function CourseCardComponent({ course }: { course: Course }) {
  const { toggleModuleComplete, deleteCourse } = useCourses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { hours, minutes } = calculateTotalHoursAndMinutes(course.modules);
  const totalLessons = calculateTotalLessons(course.modules);
  const progress = calculateCourseProgress(course.modules);

  const handleToggleModule = (moduleId: string) => {
    startTransition(async () => {
      await toggleModuleComplete({ courseId: course.id, moduleId });
    });
  };

  const handleDeleteCourse = () => {
    startTransition(async () => {
      await deleteCourse(course.id);
      setIsDeleteDialogOpen(false);
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl">{course.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                {totalLessons > 0 && (
                  <>
                    <BookOpen className="size-4" />
                    {totalLessons} Aulas
                  </>
                )}
              </span>
              <span className="flex items-center gap-1">
                {(hours > 0 || minutes > 0) && (
                  <>
                    <ClockIcon className="size-4" />
                    {[hours > 0 && `${hours}h`, minutes > 0 && `${minutes}min`]
                      .filter(Boolean)
                      .join(' ')}
                  </>
                )}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                <PencilIcon className="h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardContent className="space-y-4 px-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              {course.modules.length > 0 && (
                <>
                  <ListIcon className="size-4" />
                  Módulos
                </>
              )}
              {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </h4>
            <ScrollArea className="h-80 w-full">
              <div className="space-y-2">
                {course.modules.map((module) => (
                  <div
                    key={module.id}
                    className="flex flex-col gap-2 p-3 rounded-lg border bg-muted/40 hover:bg-muted/60 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleModule(module.id)}
                      disabled={isPending}
                      className={`flex items-start gap-3 text-left w-full ${isPending ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      {module.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium text-sm ${module.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {module.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {module.lessons} aulas
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {[
                              module.hours > 0 && `${module.hours}h`,
                              module.minutes > 0 && `${module.minutes}min`,
                            ]
                              .filter(Boolean)
                              .join(' ') || null}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </CardHeader>
      <CourseDialog courseId={course.id} isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja deletar este curso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente o curso
              <strong> "{course.title}"</strong> e todos os seus módulos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? 'Deletando...' : 'Deletar Curso'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export const CourseCard = memo(CourseCardComponent, (prevProps, nextProps) => {
  if (prevProps.course.id !== nextProps.course.id) return false;
  if (prevProps.course === nextProps.course) return true;

  return (
    prevProps.course.title === nextProps.course.title &&
    prevProps.course.modules.length === nextProps.course.modules.length &&
    prevProps.course.modules.every((m, i) => {
      const nextModule = nextProps.course.modules[i];
      return (
        m.id === nextModule.id &&
        m.completed === nextModule.completed &&
        m.title === nextModule.title
      );
    })
  );
});
