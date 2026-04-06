import { supabase } from '../lib/supabaseClient';
import { uploadImage } from './storageService';

const NEIGHBORHOOD = import.meta.env.VITE_NEIGHBORHOOD;

/**
 * Faz upload de imagem de notícia para o bucket 'news-images'.
 * @param {File} file — arquivo de imagem selecionado pelo admin
 * @returns {Promise<string>} — URL pública da imagem
 */
export async function uploadNewsImage(file) {
  const safeName = file.name.replace(/\s+/g, '-');
  const path = `news/${Date.now()}-${safeName}`;
  return uploadImage('news-images', file, path);
}

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
    .eq('neighborhood', import.meta.env.VITE_NEIGHBORHOOD)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createNews(newsData) {
  const payload = { neighborhood: NEIGHBORHOOD, ...newsData };
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
