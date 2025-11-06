export interface Module {
  id: string;
  title: string;
  lessons: number;
  hours: number;
  minutes: number;
  completed: boolean;
  completed_at?: string | null;
}
