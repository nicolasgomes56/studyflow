import { queryClient } from '@/lib/queryClient';
import { certificateService } from '@/repositories/certificate.service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCertificate() {
  /* Mutação para atualizar o certificado de um curso
   * @param courseId ID do curso
   * @param certificateFile Arquivo do certificado
   * @param issuedAt Data de emissão do certificado
   */
  const updateMutation = useMutation({
    mutationFn: async ({
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
    onError: (error: Error) => {
      toast.error('Erro ao atualizar certificado', {
        description: error.message,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (courseId: string) => certificateService.removeCertificate(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Certificado removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error('Erro ao deletar certificado', {
        description: error.message,
      });
    },
  });

  return {
    updateCertificate: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    removeCertificate: deleteMutation.mutateAsync,
    isRemoving: deleteMutation.isPending,
  };
}
