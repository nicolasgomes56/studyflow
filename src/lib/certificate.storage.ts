import { supabase } from './supabase';

export const certificateStorage = {
  /**
   * Faz upload do certificado e retorna a URL pública
   */
  async upload(courseId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${courseId}/${Date.now()}.${fileExt}`;
    const filePath = `certificates/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      throw new Error(`Erro ao fazer upload do certificado: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from('certificates').getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * Remove um certificado do storage
   */
  async delete(certificateUrl: string): Promise<void> {
    const url = new URL(certificateUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('certificates')).join('/');

    const { error } = await supabase.storage.from('certificates').remove([filePath]);

    if (error) {
      throw new Error(`Erro ao deletar o certificado: ${error.message}`);
    }
  },
};
