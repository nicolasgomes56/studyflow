import { api } from './axios';

export const certificateStorage = {
  /**
   * Faz upload do certificado e retorna a URL pública
   */
  async upload(courseId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('courseId', courseId);
    formData.append('file', file);

    const { data } = await api.post<{ url: string }>('/storage/certificates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.url;
  },

  /**
   * Remove um certificado do storage
   */
  async delete(certificateUrl: string): Promise<void> {
    await api.delete('/storage/certificates', {
      data: { certificateUrl },
    });
  },
};
