import z from 'zod';

export const certificateFormSchema = z.object({
  date: z.date().optional().nullable(),
  certificate: z.instanceof(File).optional().or(z.string().optional()),
});

export type CertificateFormData = z.infer<typeof certificateFormSchema>;
