import { certificateStorage } from '@/lib/certificate.storage';
import type { Course } from '@/types';
import { coursesRepository } from './courses.repository';

export const certificateService = {
  /**
   * Atualiza o certificado de um curso
   * Remove o certificado antigo (se existir) e faz upload do novo
   */
  async updateCertificate(
    courseId: string,
    certificateFile: File,
    issuedAt: Date | null
  ): Promise<Course> {
    const currentCourse = await coursesRepository.findById(courseId);

    // Remove certificado antigo se existir
    if (currentCourse.certificate_url) {
      try {
        await certificateStorage.delete(currentCourse.certificate_url);
      } catch (error) {
        // Log mas continua com o upload do novo arquivo
        console.warn('Erro ao deletar certificado antigo:', error);
      }
    }

    // Faz upload do novo certificado
    const certificateUrl = await certificateStorage.upload(courseId, certificateFile);
    const certificateDate = issuedAt ? issuedAt.toISOString().split('T')[0] : null;

    // Atualiza o curso com a nova URL e data
    await coursesRepository.update(courseId, {
      certificate_issued_at: certificateDate,
      certificate_url: certificateUrl,
    });

    return coursesRepository.findById(courseId);
  },

  /**
   * Remove o certificado de um curso
   */
  async removeCertificate(courseId: string): Promise<Course> {
    const currentCourse = await coursesRepository.findById(courseId);

    // Remove arquivo do storage se existir
    if (currentCourse.certificate_url) {
      await certificateStorage.delete(currentCourse.certificate_url);
    }

    // Remove referências no banco
    await coursesRepository.update(courseId, {
      certificate_issued_at: null,
      certificate_url: null,
    });

    return coursesRepository.findById(courseId);
  },
};
