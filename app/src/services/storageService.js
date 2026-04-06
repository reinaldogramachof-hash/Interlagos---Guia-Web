import { supabase } from '../lib/supabaseClient';

/**
 * Uploads a file to a Supabase storage bucket.
 * @param {string} bucket - The name of the bucket.
 * @param {File} file - The file to upload.
 * @param {string} path - The path inside the bucket.
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
export async function uploadImage(bucket, file, path) {
  const { data: _data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    cacheControl: '3600'
  });

  if (error) {
    console.error('storageService.uploadImage:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}

/**
 * Deletes a file from a Supabase storage bucket.
 * @param {string} bucket - The name of the bucket.
 * @param {string} path - The path of the file to delete.
 */
export async function deleteImage(bucket, path) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error('storageService.deleteImage:', error);
    throw error;
  }
}
