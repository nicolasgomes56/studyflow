import { Button } from '@/components/ui/button';
import { formatBytes, useFileUpload } from '@/hooks/use-file-upload';
import { cn } from '@/lib/utils';
import { AlertCircleIcon, PaperclipIcon, UploadIcon, XIcon } from 'lucide-react';
import type React from 'react';
import type { FieldError } from 'react-hook-form';

interface FileUploadProps extends React.ComponentProps<'input'> {
  validation?: FieldError;
  onFilesChange?: (files: File[]) => void;
}

export default function FileUpload({
  validation,
  className,
  onFilesChange,
  ...props
}: FileUploadProps) {
  const maxSize = 10 * 1024 * 1024; // 10MB default

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    maxSize,
    accept: 'application/pdf',
    onFilesChange: (fileWithPreviews) => {
      // Converter FileWithPreview[] para File[] e chamar a callback
      const fileArray = fileWithPreviews
        .map((f) => f.file)
        .filter((f): f is File => f instanceof File);
      onFilesChange?.(fileArray);
    },
  });

  const file = files[0];

  const getFileName = () => {
    if (!file) return '';
    if (file.file instanceof File) {
      return file.file.name;
    }
    return file.file.name;
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {/* Drop area */}
      {/* biome-ignore lint/a11y/useSemanticElements: div necessário para drag and drop */}
      <div
        role='button'
        tabIndex={0}
        onClick={openFileDialog}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFileDialog();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className='flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-input p-4 transition-colors hover:bg-accent/50 has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
      >
        <input
          {...getInputProps({
            accept: 'application/pdf',
            ...props,
          })}
          className='sr-only'
          aria-label='Enviar arquivo'
          disabled={Boolean(file)}
        />

        <div className='flex flex-col items-center justify-center text-center'>
          <div
            className='mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background'
            aria-hidden='true'
          >
            <UploadIcon className='size-4 opacity-60' />
          </div>
          <p className='mb-1.5 text-sm font-medium'>Enviar arquivo</p>
          <p className='text-xs text-muted-foreground'>
            Arraste e solte ou clique para procurar (máx. {formatBytes(maxSize)})
          </p>
        </div>
      </div>

      {(errors.length > 0 || validation) && (
        <div className='flex items-center gap-1 text-xs text-destructive' role='alert'>
          <AlertCircleIcon className='size-3 shrink-0' />
          <span>{errors[0] || validation?.message}</span>
        </div>
      )}

      {/* File list */}
      {file && (
        <div className='space-y-2'>
          <div
            key={file.id}
            className='flex items-center justify-between gap-2 rounded-xl border px-4 py-2'
          >
            <div className='flex items-center gap-3 overflow-hidden'>
              <PaperclipIcon className='size-4 shrink-0 opacity-60' aria-hidden='true' />
              <div className='min-w-0'>
                <p className='truncate text-[13px] font-medium'>{getFileName()}</p>
              </div>
            </div>

            <Button
              size='icon'
              variant='ghost'
              className='-me-2 size-8 text-muted-foreground/80 hover:bg-transparent hover:text-foreground'
              onClick={() => removeFile(file.id)}
              aria-label='Remover arquivo'
            >
              <XIcon className='size-4' aria-hidden='true' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
