import { supabase } from '@/lib/supabase';

const BUCKET_NAME = 'tours';

export const uploadService = {
  uploadFile: async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (error) {
        if (error.message === 'Bucket not found') {
          console.error(`ERROR: Storage bucket '${BUCKET_NAME}' not found.`);
          console.info(`Please create a public bucket named '${BUCKET_NAME}' in your Supabase Dashboard (Storage -> New Bucket).`);
          throw new Error(`Storage bucket '${BUCKET_NAME}' not found. Please create it in Supabase.`);
        }
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      return {
        url: publicUrl,
        size: file.size,
        filename: fileName,
        original_filename: file.name
      };
    } catch (err: any) {
      console.error('Upload failed:', err);
      throw err;
    }
  },

  uploadMultiple: async (files: File[]) => {
    const uploadPromises = files.map(file => uploadService.uploadFile(file));
    return Promise.all(uploadPromises);
  },
};
