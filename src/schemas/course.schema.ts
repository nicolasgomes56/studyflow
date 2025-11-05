import { z } from 'zod';
import { moduleSchema } from './module.schema';

export const courseFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Nome do curso é obrigatório')
    .min(2, 'Nome do curso deve ter pelo menos 2 caracteres')
    .trim(),
  modules: z.array(moduleSchema),
});

export type CourseFormData = z.infer<typeof courseFormSchema>;
