import { useCourses } from '@/hooks/useCourses';
import { getOverallProgress } from '@/utils';
import NumberFlow from '@number-flow/react';
import { Award, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { useDeferredValue, useMemo } from 'react';
import { BorderBeam } from './ui/border-beam';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const STAT_CONFIG = {
  courses: {
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
    beamColor: 'from-transparent via-blue-600 dark:via-blue-400 to-transparent',
  },
  hours: {
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-600 dark:text-purple-400',
    beamColor: 'from-transparent via-purple-600 dark:via-purple-400 to-transparent',
  },
  progress: {
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-600 dark:text-green-400',
    beamColor: 'from-transparent via-green-600 dark:via-green-400 to-transparent',
  },
  modules: {
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-600 dark:text-orange-400',
    beamColor: 'from-transparent via-orange-600 dark:via-orange-400 to-transparent',
  },
} as const;

const NUMBER_FLOW_CONFIG = {
  format: { maximumFractionDigits: 1 },
  transformTiming: {
    duration: 800,
    easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
  },
  spinTiming: {
    duration: 800,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  opacityTiming: { duration: 350, easing: 'ease-out' },
} as const;

export function StatsOverview() {
  const { courses } = useCourses();

  const deferredCourses = useDeferredValue(courses);

  const statCards = useMemo(() => {
    const coursesData = deferredCourses || [];
    const stats = getOverallProgress(coursesData);
    const completedModules = coursesData.reduce(
      (sum: number, c) => sum + c.modules.filter((m) => m.completed).length,
      0
    );
    const totalModules = coursesData.reduce((sum: number, c) => sum + c.modules.length, 0);

    const totalHoursDisplay = stats.totalHours + stats.totalMinutes / 60;
    const completedDisplay =
      [
        stats.completedHours > 0 && `${stats.completedHours}h`,
        stats.completedMinutes > 0 && `${stats.completedMinutes}min`,
      ]
        .filter(Boolean)
        .join(' ') || '0min';

    return [
      {
        title: 'Total de Cursos',
        value: stats.totalCourses,
        isNumeric: true,
        icon: BookOpen,
        description: `${stats.completedCourses} concluídos`,
        ...STAT_CONFIG.courses,
      },
      {
        title: 'Horas Totais',
        value: totalHoursDisplay,
        isNumeric: true,
        suffix: 'h',
        icon: Clock,
        description: `${completedDisplay} completadas`,
        ...STAT_CONFIG.hours,
      },
      {
        title: 'Progresso Geral',
        value: stats.overallProgress,
        isNumeric: true,
        suffix: '%',
        icon: TrendingUp,
        description: 'De todos os cursos',
        ...STAT_CONFIG.progress,
      },
      {
        title: 'Módulos Concluídos',
        value: completedModules,
        isNumeric: true,
        icon: Award,
        description: `De ${totalModules} totais`,
        ...STAT_CONFIG.modules,
      },
    ];
  }, [deferredCourses]);

  const isStale = courses !== deferredCourses;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className={`relative border-border/50 hover:border-border transition-all overflow-hidden ${isStale ? 'opacity-70' : 'opacity-100'}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1 tabular-nums">
                {stat.isNumeric ? (
                  <NumberFlow
                    value={stat.value}
                    {...('suffix' in stat && { suffix: stat.suffix })}
                    {...NUMBER_FLOW_CONFIG}
                  />
                ) : (
                  stat.value
                )}
              </div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
            <BorderBeam size={150} duration={12} delay={2} className={stat.beamColor} />
          </Card>
        );
      })}
    </div>
  );
}
