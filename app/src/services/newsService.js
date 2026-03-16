import { supabase } from '../lib/supabaseClient';

export async function fetchNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function subscribeNews(callback) {
  callback(); // carrega inicial
  const channel = supabase.channel('news-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, callback)
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
  const { data, error } = await supabase
    .from('news')
    .insert(newsData)
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
