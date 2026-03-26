import { supabase } from '../lib/supabaseClient';
const NEIGHBORHOOD = import.meta.env.VITE_NEIGHBORHOOD;
import { uploadImage } from './storageService';

export async function fetchNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('neighborhood', NEIGHBORHOOD)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function subscribeNews(callback) {
  callback(); // carrega inicial
  const channel = supabase.channel('news-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'news', filter: `neighborhood=eq.${NEIGHBORHOOD}` }, callback)
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function adminFetchNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createNews(newsData) {
  let finalImageUrl = newsData.image_url;

  // Se receber um File como image_url, faz o upload
  if (newsData.image_url instanceof File) {
    const file = newsData.image_url;
    const ext = file.name.split('.').pop();
    const path = `news/${newsData.author_id || 'admin'}/${Date.now()}.${ext}`;
    finalImageUrl = await uploadImage('news-images', file, path);
  }

  const payload = { neighborhood: NEIGHBORHOOD, ...newsData, image_url: finalImageUrl };
  const { data, error } = await supabase
    .from('news')
    .insert(payload)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteNews(id) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function updateNews(id, data) {
  const { data: updatedData, error } = await supabase
    .from('news')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return updatedData;
}

export async function updateNewsStatus(id, status) {
  const { error } = await supabase
    .from('news')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
  return true;
}
