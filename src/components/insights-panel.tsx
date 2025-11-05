import { addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { formatDuration } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function InsightsPanel() {
  const { courses } = useCourses();
  const activeCourses = courses.filter((course) => course.progress !== 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Previsões de Conclusão
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeCourses.map((course) => (
          <div key={course.id} className="p-4 rounded-lg border bg-card space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold">{course.title}</h4>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Horas restantes</span>
                </div>
                <p className="font-semibold">
                  {formatDuration(course.total_hours - course.progress)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Dias estimados</span>
                </div>
                <p className="font-semibold">
                  {Math.ceil((course.total_hours - course.progress) / (course.total_hours / 24))}{' '}
                  dias
                </p>
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">Previsão de conclusão</p>
              <p className="font-medium">
                {format(
                  addDays(
                    new Date(),
                    Math.ceil((course.total_hours - course.progress) / (course.total_hours / 24))
                  ),
                  "d 'de' MMMM 'de' yyyy",
                  { locale: ptBR }
                )}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
