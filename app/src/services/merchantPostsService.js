import { supabase } from '../lib/supabaseClient';
import { PLAN_RANK } from '../constants/plans';

// Retorna posts ativos de um merchant
export const getMerchantPosts = async (merchantId) => {
  const { data, error } = await supabase
    .from('merchant_posts')
    .select('*')
    .eq('merchant_id', merchantId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('merchantPostsService.getMerchantPosts:', error);
    return [];
  }
  return data;
};

// Retorna posts recentes do bairro para o feed da home
export const getNeighborhoodPosts = async (neighborhood, limit = 20) => {
  const { data, error } = await supabase
    .from('merchant_posts')
    .select(`
      *,
      merchants!inner(name, plan, image_url, category, whatsapp, store_color, store_cover_url, store_tagline)
    `)
    .eq('neighborhood', neighborhood)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('merchantPostsService.getNeighborhoodPosts:', error);
    return [];
  }

  // Ordenados por: plano do merchant (premium→pro→basic) + created_at desc
  return data.sort((a, b) => {
    const rankA = PLAN_RANK[a.merchants?.plan] ?? 0;
    const rankB = PLAN_RANK[b.merchants?.plan] ?? 0;
    if (rankA !== rankB) {
      return rankB - rankA;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });
};

// CRUD do painel
export const createMerchantPost = async (merchantId, neighborhood, data) => {
  const { data: result, error } = await supabase
    .from('merchant_posts')
    .insert({
      merchant_id: merchantId,
      neighborhood: neighborhood,
      ...data
    })
    .select()
    .single();

  if (error) {
    console.error('merchantPostsService.createMerchantPost:', error);
    return null;
  }
  return result;
};

export const updateMerchantPost = async (postId, data) => {
  const { data: result, error } = await supabase
    .from('merchant_posts')
    .update(data)
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    console.error('merchantPostsService.updateMerchantPost:', error);
    return null;
  }
  return result;
};

export const deleteMerchantPost = async (postId) => {
  const { error } = await supabase
    .from('merchant_posts')
    .delete()
    .eq('id', postId);

  if (error) {
    console.error('merchantPostsService.deleteMerchantPost:', error);
  }
};

export const toggleMerchantPostActive = async (postId, isActive) => {
  const { data, error } = await supabase
    .from('merchant_posts')
    .update({ is_active: isActive })
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    console.error('merchantPostsService.toggleMerchantPostActive:', error);
    return null;
  }
  return data;
};
