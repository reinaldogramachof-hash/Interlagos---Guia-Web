import { supabase } from '../lib/supabaseClient';
import { uploadImage } from './storageService';
import { notifyAdmins } from './notificationService';

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
  
  if (error) {
    console.error('newsService.fetchNews error:', error);
    throw error;
  }
  return data ?? [];
}

export function subscribeNews(callback) {
  // Fetch inicial + realtime (sem duplicar: única chamada ao montar)
  fetchNews().then(callback).catch((err) => {
    console.error('subscribeNews initial fetch:', err);
    callback([]);
  });

  const channel = supabase.channel('news-realtime')
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'news',
        filter: `neighborhood=eq.${NEIGHBORHOOD}`
      },
      () => fetchNews().then(callback).catch(() => {})
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function adminFetchNews() {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('neighborhood', NEIGHBORHOOD)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createNews(newsData) {
  // Garante que o neighborhood esteja presente se não enviado pelo form
  const payload = { 
    neighborhood: NEIGHBORHOOD, 
    status: 'pending', // Default robusto
    ...newsData 
  };
  
  const { data, error } = await supabase
    .from('news')
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('newsService.createNews error:', error);
    throw error;
  }

  // Notificação silenciosa (não quebra o fluxo de criação se falhar)
  notifyAdmins(
    'Nova Notícia Publicada',
    `A notícia "${data.title}" foi enviada para revisão por um morador.`,
    'info',
    data.id
  ).catch(err => console.error('Failed to notify admins:', err));

  return data;
}

export async function fetchNewsByAuthor(authorId) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('author_id', authorId)
    .eq('neighborhood', NEIGHBORHOOD)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteNews(id, authorId) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id)
    .eq('author_id', authorId);
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

export async function adminDeleteNews(id) {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

export const fetchComments = async (newsId) => {
  const { data, error } = await supabase
    .from('news_comments')
    .select('id, content, created_at, author_id, profiles(display_name, photo_url)')
    .eq('news_id', newsId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const createComment = async ({ newsId, authorId, content, neighborhood }) => {
  const { data, error } = await supabase
    .from('news_comments')
    .insert({ news_id: newsId, author_id: authorId, content: content.trim(), neighborhood })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteComment = async (commentId) => {
  const { error } = await supabase
    .from('news_comments')
    .delete()
    .eq('id', commentId);
  if (error) throw error;
};

export const fetchCommentCounts = async (newsIds) => {
  if (!newsIds?.length) return {};
  const { data, error } = await supabase
    .from('news_comments')
    .select('news_id')
    .in('news_id', newsIds);
  if (error) return {};
  return (data || []).reduce((acc, row) => {
    acc[row.news_id] = (acc[row.news_id] || 0) + 1;
    return acc;
  }, {});
};
