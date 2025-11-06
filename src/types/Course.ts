import type { Module } from '@/types/Module';

export interface Course {
  id: string;
  title: string;
  modules: Module[];
  created_at: string;
}
