import {
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  type Ref,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

export type FileMetadata = {
  name: string;
  size: number;
  type: string;
  url: string;
  id: string;
};

export type FileWithPreview = {
  file: File | FileMetadata;
  id: string;
  preview?: string;
};

export type FileUploadOptions = {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  initialFiles?: FileMetadata[];
  onFilesChange?: (files: FileWithPreview[]) => void;
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void;
};

type FileUploadState = {
  files: FileWithPreview[];
  isDragging: boolean;
  errors: string[];
};

type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  clearErrors: () => void;
  handleDragEnter: (e: DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: DragEvent<HTMLElement>) => void;
  handleDragOver: (e: DragEvent<HTMLElement>) => void;
  handleDrop: (e: DragEvent<HTMLElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  openFileDialog: () => void;
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>
  ) => InputHTMLAttributes<HTMLInputElement> & {
    ref: Ref<HTMLInputElement>;
  };
};

const createFileId = (file: File | FileMetadata): string => {
  if (file instanceof File) {
    return crypto.randomUUID();
  }
  return file.id;
};

const createPreview = (file: File | FileMetadata): string | undefined => {
  if (file instanceof File) {
    return URL.createObjectURL(file);
  }
  return file.url;
};

const revokePreview = (item: FileWithPreview) => {
  if (item.preview && item.file instanceof File) {
    URL.revokeObjectURL(item.preview);
  }
};

const stopDragEvent = (e: DragEvent<HTMLElement>) => {
  e.preventDefault();
  e.stopPropagation();
};

export const useFileUpload = (
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] => {
  const {
    maxFiles = Infinity,
    maxSize = Infinity,
    accept = '*',
    multiple = false,
    initialFiles = [],
    onFilesChange,
    onFilesAdded,
  } = options;

  const [files, setFiles] = useState<FileWithPreview[]>(
    initialFiles.map((file) => ({
      file,
      id: file.id,
      preview: file.url,
    }))
  );
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = useMemo(
    () => (accept === '*' ? [] : accept.split(',').map((type) => type.trim().toLowerCase())),
    [accept]
  );

  const validateFile = useCallback(
    (file: File | FileMetadata): string | null => {
      const fileName = file.name;
      const fileSize = file.size;
      const fileType = file.type || '';
      const fileExtension = `.${fileName.split('.').pop() ?? ''}`.toLowerCase();

      if (fileSize > maxSize) {
        return `O arquivo "${fileName}" excede o tamanho máximo de ${formatBytes(maxSize)}.`;
      }

      if (acceptedTypes.length === 0) {
        return null;
      }

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return fileExtension === type;
        }
        if (type.endsWith('/*')) {
          const baseType = type.split('/')[0];
          return fileType.startsWith(`${baseType}/`);
        }
        return fileType === type;
      });

      if (!isAccepted) {
        return `O arquivo "${fileName}" não é um tipo de arquivo aceito.`;
      }

      return null;
    },
    [acceptedTypes, maxSize]
  );

  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      prev.forEach(revokePreview);
      return [];
    });
    setErrors([]);
    onFilesChange?.([]);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [onFilesChange]);

  const addFiles = useCallback(
    (incomingFiles: FileList | File[]) => {
      if (!incomingFiles || incomingFiles.length === 0) return;

      const incomingArray = Array.from(incomingFiles);
      setFiles((prevFiles) => {
        const baseFiles = multiple ? prevFiles : [];
        if (
          multiple &&
          maxFiles !== Infinity &&
          baseFiles.length + incomingArray.length > maxFiles
        ) {
          setErrors([`Você só pode enviar no máximo ${maxFiles} arquivos.`]);
          return prevFiles;
        }

        const nextErrors: string[] = [];
        const validFiles: FileWithPreview[] = [];

        incomingArray.forEach((file) => {
          if (multiple) {
            const duplicate = baseFiles.some(
              (existing) => existing.file.name === file.name && existing.file.size === file.size
            );
            if (duplicate) return;
          }

          const error = validateFile(file);
          if (error) {
            nextErrors.push(error);
            return;
          }

          validFiles.push({
            file,
            id: createFileId(file),
            preview: createPreview(file),
          });
        });

        if (!multiple) {
          prevFiles.forEach(revokePreview);
        }

        const nextFiles = multiple ? [...prevFiles, ...validFiles] : validFiles;
        if (validFiles.length > 0) {
          onFilesAdded?.(validFiles);
          onFilesChange?.(nextFiles);
        }
        setErrors(nextErrors);

        return nextFiles;
      });

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [maxFiles, multiple, onFilesAdded, onFilesChange, validateFile]
  );

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prevFiles) => {
        const fileToRemove = prevFiles.find((file) => file.id === id);
        if (fileToRemove) {
          revokePreview(fileToRemove);
        }

        const nextFiles = prevFiles.filter((file) => file.id !== id);
        onFilesChange?.(nextFiles);
        setErrors([]);
        return nextFiles;
      });
    },
    [onFilesChange]
  );

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    stopDragEvent(e);
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    stopDragEvent(e);

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    stopDragEvent(e);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      stopDragEvent(e);
      setIsDragging(false);

      if (inputRef.current?.disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        if (!multiple) {
          addFiles([e.dataTransfer.files[0]]);
          return;
        }
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles, multiple]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
    },
    [addFiles]
  );

  const openFileDialog = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => ({
      ...props,
      type: 'file' as const,
      onChange: handleFileChange,
      accept: props.accept || accept,
      multiple: props.multiple ?? multiple,
      ref: inputRef as Ref<HTMLInputElement>,
    }),
    [accept, handleFileChange, multiple]
  );

  return [
    {
      files,
      isDragging,
      errors,
    },
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ];
};

// Helper function to format bytes to human-readable format
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / k ** i).toFixed(dm)) + sizes[i];
};
