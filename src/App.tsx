import { GraduationCap, Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { CourseCard } from './components/course-card';
import { CourseDialog } from './components/course-dialog';
import { GoalDialog } from './components/goal-dialog';
import { InsightsPanel } from './components/insights-panel';
import { StatsOverview } from './components/stats-overview';
import { Button } from './components/ui/button';
import { useCourses } from './hooks/useCourses';

export default function App() {
  const { courses, isLoading } = useCourses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className='min-h-screen bg-linear-to-br from-background via-background to-muted/20'>
      <div className='container mx-auto px-4 py-8 max-w-7xl'>
        <header className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 rounded-lg bg-primary/10'>
                <GraduationCap className='h-6 w-6 text-primary' />
              </div>
              <div>
                <h1 className='text-3xl font-bold'>Meus Estudos</h1>
                <p className='text-muted-foreground'>
                  Organize seus cursos e acompanhe seu progresso
                </p>
              </div>
            </div>
            <AnimatedThemeToggler />
          </div>
        </header>

        <div className='flex flex-wrap items-center gap-4 mb-8'>
          <Button onClick={() => setIsDialogOpen(true)} className='gap-2'>
            <Plus className='h-5 w-5' />
            Novo Curso
          </Button>

          <GoalDialog />
        </div>

        <CourseDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />

        <div className='space-y-8'>
          <StatsOverview />

          {isLoading ? (
            <div className='flex items-center justify-center py-16'>
              <div className='text-center'>
                <Loader2 className='h-8 w-8 text-primary animate-spin mx-auto mb-4' />
                <p className='text-muted-foreground'>Carregando cursos...</p>
              </div>
            </div>
          ) : courses.length === 0 ? (
            <div className='text-center py-16'>
              <div className='inline-flex p-4 rounded-full bg-muted/50 mb-4'>
                <GraduationCap className='h-12 w-12 text-muted-foreground' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>Nenhum curso adicionado</h3>
              <p className='text-muted-foreground mb-6'>
                Comece adicionando seu primeiro curso para organizar seus estudos
              </p>
            </div>
          ) : (
            <div className='grid gap-6 lg:grid-cols-3'>
              <div className='lg:col-span-2 space-y-6'>
                <div className='grid gap-6 md:grid-cols-2'>
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>

              <div className='lg:col-span-1 space-y-6'>
                <InsightsPanel />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
