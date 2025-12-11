import { certificateFormSchema, type CertificateFormData } from '@/schemas/certificate.schema';
import type { Course } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { Button } from '../ui/button';
import { Controller, useForm } from 'react-hook-form';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import FileUpload from '../ui/file-upload';
import { Label } from '../ui/label';
import { DatePicker } from '../ui/date-picker';

interface CourseCertificateFormProps {
  course: Course;
  onSubmit: (data: CertificateFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CourseCertificateForm({
  course,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CourseCertificateFormProps) {
  const { handleSubmit, control, reset } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      date: course.certificate_issued_at ? new Date(course.certificate_issued_at) : undefined,
      certificate: undefined,
    },
  });

  const handleFormSubmit = useCallback(
    async (data: CertificateFormData) => {
      await onSubmit(data);
      reset();
    },
    [onSubmit, reset]
  );

  const handleFilesChange = useCallback((files: File[], onChange: (value: File | null) => void) => {
    setTimeout(() => {
      onChange(files[0] || null);
    }, 0);
  }, []);

  const hasCertificate = !!course.certificate_url;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{hasCertificate ? 'Editar Certificado' : 'Adicionar Certificado'}</DialogTitle>
        <DialogDescription>
          {hasCertificate
            ? 'Atualize o certificado do curso.'
            : 'Adicione um certificado para o curso para começar a organizar seus estudos.'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4 py-4'>
        <div className='space-y-2'>
          <Label>Data de Emissão</Label>
          <Controller
            name='date'
            control={control}
            render={({ field }) => (
              <DatePicker
                date={field.value ?? undefined}
                onDateChange={field.onChange}
                placeholder='Selecione uma data'
              />
            )}
          />
        </div>
        <div className='space-y-2'>
          <Label>Arquivo do Certificado</Label>
          <Controller
            name='certificate'
            control={control}
            render={({ field }) => (
              <FileUpload onFilesChange={(files) => handleFilesChange(files, field.onChange)} />
            )}
          />
        </div>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {hasCertificate ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
