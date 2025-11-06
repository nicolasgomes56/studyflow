import { useCourses } from '@/hooks/useCourses';
import { useGoal } from '@/hooks/useGoal';
import { formatMinutesToHoursAndMinutes } from '@/utils';
import { addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, Loader2, TrendingUp } from 'lucide-react';
import { useDeferredValue, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function InsightsPanel() {
  const { courses } = useCourses();
  const { goal } = useGoal();

  const deferredCourses = useDeferredValue(courses);

  const activeCourses = useMemo(
    () =>
      deferredCourses.filter(
        (course) => !(course.modules.length > 0 && course.modules.every((m) => m.completed))
      ),
    [deferredCourses]
  );

  const isCalculating = courses !== deferredCourses;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Previsões de Conclusão
          {isCalculating && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-auto" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={`space-y-4 transition-opacity ${isCalculating ? 'opacity-70' : 'opacity-100'}`}
      >
        {activeCourses.length > 0 ? (
          activeCourses.map((course) => {
            const remainingMinutes = course.modules
              .filter((m) => !m.completed)
              .reduce((sum, m) => {
                const hours = (m.hours || 0) * 60;
                const minutes = m.minutes || 0;
                return sum + hours + minutes;
              }, 0);

            const remainingHoursDecimal = remainingMinutes / 60;
            const dailyHours = goal?.daily_hours ?? 1;
            const estimatedDays = Math.ceil(remainingHoursDecimal / dailyHours);

            return (
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
                      {formatMinutesToHoursAndMinutes(remainingMinutes)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Dias estimados</span>
                    </div>
                    <p className="font-semibold">{estimatedDays} dias</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Previsão de conclusão</p>
                  <p className="font-medium">
                    {format(addDays(new Date(), estimatedDays), "d 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">Você concluiu todos os seus cursos!</p>
        )}
      </CardContent>
    </Card>
  );
}
