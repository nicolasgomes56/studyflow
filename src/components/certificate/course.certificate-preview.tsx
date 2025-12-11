import type { Course } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { DownloadIcon, PencilIcon, X } from 'lucide-react';
import { PDFViewer } from '../pdf-viewer';

interface CourseCertificatePreviewProps {
  course: Course;
  onEdit: () => void;
  onRemove: () => Promise<void>;
  isRemoving?: boolean;
}

export function CourseCertificatePreview({
  course,
  onEdit,
  onRemove,
  isRemoving = false,
}: CourseCertificatePreviewProps) {
  const [isPDF, setIsPDF] = useState(false);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    if (course.certificate_url) {
      const url = course.certificate_url.toLowerCase();
      setIsPDF(url.endsWith('.pdf') || url.includes('application/pdf'));
      setIsImage(
        url.endsWith('.jpg') ||
          url.endsWith('.jpeg') ||
          url.endsWith('.png') ||
          url.endsWith('.gif') ||
          url.endsWith('.webp') ||
          url.endsWith('.svg')
      );
    }
  }, [course.certificate_url]);

  const handleDownload = useCallback(() => {
    if (course.certificate_url) {
      window.open(course.certificate_url, '_blank');
    }
  }, [course.certificate_url]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderContent = () => {
    if (isPDF) {
      return (
        <div className='relative w-full bg-muted rounded-lg overflow-hidden border'>
          <PDFViewer url={course.certificate_url!} />
        </div>
      );
    }

    if (isImage) {
      return (
        <div className='relative w-full bg-muted rounded-lg overflow-hidden border'>
          <img
            src={course.certificate_url!}
            alt={`Certificado - ${course.title}`}
            className='w-full h-auto max-h-[70vh] object-contain'
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const container = target.parentElement;
              if (container) {
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center p-8 space-y-4">
                      <svg class="h-16 w-16 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p class="text-muted-foreground">Erro ao carregar imagem</p>
                      <a href="${course.certificate_url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
                        Abrir certificado
                      </a>
                    </div>
                  `;
              }
            }}
          />
        </div>
      );
    }

    // Fallback para outros tipos de arquivo
    return (
      <div className='relative w-full bg-muted rounded-lg overflow-hidden border'>
        <div className='flex flex-col items-center justify-center p-8 space-y-4'>
          <svg
            className='h-16 w-16 text-muted-foreground'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          <p className='text-muted-foreground'>Visualização não disponível</p>
          <a
            href={course.certificate_url}
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary hover:underline'
          >
            Abrir certificado
          </a>
        </div>
      </div>
    );
  };

  return (
    <DialogContent className='max-w-4xl max-h-[90vh]'>
      <DialogHeader>
        <DialogTitle>Certificado do Curso</DialogTitle>
        <DialogDescription>
          {course.certificate_issued_at && (
            <span>Emitido em: {formatDate(course.certificate_issued_at)}</span>
          )}
        </DialogDescription>
      </DialogHeader>
      <div className='space-y-4 py-4'>{renderContent()}</div>
      <DialogFooter className='flex-row gap-2 justify-between'>
        <Button type='button' variant='destructive' onClick={onRemove} disabled={isRemoving}>
          <X className='h-4 w-4 mr-2' />
          Remover
        </Button>
        <div className='flex gap-2'>
          <Button type='button' variant='outline' onClick={handleDownload}>
            <DownloadIcon className='h-4 w-4 mr-2' />
            Download
          </Button>
          <Button type='button' onClick={onEdit}>
            <PencilIcon className='h-4 w-4 mr-2' />
            Editar
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
