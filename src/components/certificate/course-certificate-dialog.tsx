import { useCertificate } from '@/hooks/useCertificate';
import type { CertificateFormData } from '@/schemas/certificate.schema';
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
  const { updateCertificate, removeCertificate, isUpdating, isRemoving } = useCertificate();

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

      await updateCertificate({
        courseId: course.id,
        certificateFile: data.certificate,
        issuedAt: data.date ?? null,
      });

      setIsOpen(false);
      setIsEditMode(false);
    },
    [course.id, updateCertificate]
  );

  const handleRemove = useCallback(async () => {
    await removeCertificate(course.id);
    setIsOpen(false);
    setIsEditMode(false);
  }, [course.id, removeCertificate]);

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
          isSubmitting={isUpdating}
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
        isRemoving={isRemoving}
      />
    </Dialog>
  );
}
