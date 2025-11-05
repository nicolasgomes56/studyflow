import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2,
} from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import type { Course } from '@/types/Course';
import { formatDuration } from '@/utils';
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

export function CourseCard({ course }: { course: Course }) {
  const { toggleModuleComplete, deleteCourse } = useCourses();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl">{course.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="size-4" />
                {course.total_lessons} Aulas
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-4" />
                {course.total_hours}h
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
              <DropdownMenuItem>
                <PencilIcon className="h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => deleteCourse(course.id)}
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
              <span className="font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Módulos</h4>
            <div className="space-y-2">
              {course.modules.map((module) => (
                <div
                  key={module.id}
                  className="flex flex-col gap-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() =>
                      toggleModuleComplete({ courseId: course.id, moduleId: module.id })
                    }
                    className="flex items-start gap-3 text-left w-full"
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
                          {formatDuration(module.hours)}
                        </Badge>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
