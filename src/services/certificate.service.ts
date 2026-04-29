import { certificateStorage } from '@/lib/certificate.storage';
import { api } from '@/lib/axios';
import type { Course } from '@/types';

export const certificateService = {
  async updateCertificate(
    courseId: string,
    certificateFile: File,
    issuedAt: Date | null
  ): Promise<Course> {
    const { data: currentCourse } = await api.get<Course>(`/courses/${courseId}`);

    if (currentCourse.certificate_url) {
      try {
        await certificateStorage.delete(currentCourse.certificate_url);
      } catch (error) {
        console.warn('Erro ao deletar certificado antigo:', error);
      }
    }

    const certificateUrl = await certificateStorage.upload(courseId, certificateFile);
    const certificateDate = issuedAt ? issuedAt.toISOString().split('T')[0] : null;

    await api.patch(`/courses/${courseId}`, {
      certificate_issued_at: certificateDate,
      certificate_url: certificateUrl,
    });

    const { data: updatedCourse } = await api.get<Course>(`/courses/${courseId}`);
    return updatedCourse;
  },

  async removeCertificate(courseId: string): Promise<Course> {
    const { data: currentCourse } = await api.get<Course>(`/courses/${courseId}`);

    if (currentCourse.certificate_url) {
      await certificateStorage.delete(currentCourse.certificate_url);
    }

    await api.patch(`/courses/${courseId}`, {
      certificate_issued_at: null,
      certificate_url: null,
    });

    const { data: updatedCourse } = await api.get<Course>(`/courses/${courseId}`);
    return updatedCourse;
  },
};
