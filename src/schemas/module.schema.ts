import z from 'zod';

export const moduleSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').trim(),
  lessons: z.number().min(0, 'Deve ser maior ou igual a 0').int('Deve ser um número inteiro'),
  hours: z.number().min(0, 'Deve ser maior ou igual a 0').int('Deve ser um número inteiro'),
  minutes: z.number().min(0, 'Deve ser maior ou igual a 0').int('Deve ser um número inteiro'),
  completed: z.boolean(),
});

export type ModuleFormData = z.infer<typeof moduleSchema>;
