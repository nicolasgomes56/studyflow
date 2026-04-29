import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import type { CertificateFormData } from '@/schemas/certificate.schema';
import { certificateService } from '@/services/certificate.service';
import type { Course } from '@/types';
import { AwardIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { CourseCertificateForm } from './course-certificate-form';
import { CourseCertificatePreview } from './course.certificate-preview';

interface CourseCertificateDialogProps {
  course: Course;
}

export function CourseCertificateDialog({ course }: CourseCertificateDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const updateMutation = useMutation({
    mutationFn: ({
      courseId,
      certificateFile,
      issuedAt,
    }: {
      courseId: string;
      certificateFile: File;
      issuedAt: Date | null;
    }) => certificateService.updateCertificate(courseId, certificateFile, issuedAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Certificado adicionado com sucesso!');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (courseId: string) => certificateService.removeCertificate(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Certificado removido com sucesso!');
    },
  });

  const hasCertificate = !!course.certificate_url;

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsEditMode(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (data: CertificateFormData) => {
      if (!data.certificate || !(data.certificate instanceof File)) {
        toast.error('Por favor, selecione um arquivo de certificado');
        return;
      }

      await updateMutation.mutateAsync({
        courseId: course.id,
        certificateFile: data.certificate,
        issuedAt: data.date ?? null,
      });

      setIsOpen(false);
      setIsEditMode(false);
    },
    [course.id, updateMutation]
  );

  const handleRemove = useCallback(async () => {
    await removeMutation.mutateAsync(course.id);
    setIsOpen(false);
    setIsEditMode(false);
  }, [course.id, removeMutation]);

  const handleEdit = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditMode(false);
    setIsOpen(false);
  }, []);

  // Se não tem certificado ou está em modo edição, mostra o formulário
  if (!hasCertificate || isEditMode) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant='ghost' size='icon' className='shrink-0 text-primary'>
            <AwardIcon />
          </Button>
        </DialogTrigger>
        <CourseCertificateForm
          course={course}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={updateMutation.isPending}
        />
      </Dialog>
    );
  }

  // Se tem certificado, mostra o preview
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' className='shrink-0 text-primary'>
          <AwardIcon />
        </Button>
      </DialogTrigger>
      <CourseCertificatePreview
        course={course}
        onEdit={handleEdit}
        onRemove={handleRemove}
        isRemoving={removeMutation.isPending}
      />
    </Dialog>
  );
}
