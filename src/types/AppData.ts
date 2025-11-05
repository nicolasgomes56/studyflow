import type { Course } from './Course';
import type { StudyGoal } from './Goals';
import type { Note } from './Note';
import type { StudySession } from './StudySession';

export interface AppData {
  courses: Course[];
  studyGoal: StudyGoal;
  studySessions: StudySession[];
  notes: Note[];
}
