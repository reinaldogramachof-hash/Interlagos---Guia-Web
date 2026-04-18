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

// Cache em memória com TTL para reduzir refetch entre navegações de view
const neighborhoodPostsCache = new Map();
const POSTS_TTL_MS = 5 * 60 * 1000; // 5 minutos

export function invalidateNeighborhoodPostsCache(neighborhood) {
  if (neighborhood) {
    for (const key of neighborhoodPostsCache.keys()) {
      if (key.startsWith(`${neighborhood}:`)) neighborhoodPostsCache.delete(key);
    }
  } else {
    neighborhoodPostsCache.clear();
  }
}

// Retorna posts recentes do bairro para o feed da home (com cache TTL)
export const getNeighborhoodPosts = async (neighborhood, limit = 20) => {
  const key = `${neighborhood}:${limit}`;
  const cached = neighborhoodPostsCache.get(key);
  if (cached && Date.now() - cached.timestamp < POSTS_TTL_MS) {
    return cached.data;
  }

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
    return cached?.data ?? [];
  }

  // Ordenados por: plano do merchant (premium→pro→basic) + created_at desc
  const sorted = data.sort((a, b) => {
    const rankA = PLAN_RANK[a.merchants?.plan] ?? 0;
    const rankB = PLAN_RANK[b.merchants?.plan] ?? 0;
    if (rankA !== rankB) return rankB - rankA;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  neighborhoodPostsCache.set(key, { data: sorted, timestamp: Date.now() });
  return sorted;
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
  invalidateNeighborhoodPostsCache(neighborhood);
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
  invalidateNeighborhoodPostsCache(result?.neighborhood);
  return result;
};

export const deleteMerchantPost = async (postId) => {
  const { error } = await supabase
    .from('merchant_posts')
    .delete()
    .eq('id', postId);

  if (error) {
    console.error('merchantPostsService.deleteMerchantPost:', error);
    return;
  }
  invalidateNeighborhoodPostsCache();
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
  invalidateNeighborhoodPostsCache(data?.neighborhood);
  return data;
};
