import { supabase } from '../lib/supabaseClient';

export const toggleFavorite = async (userId, itemId, type, _itemData = {}) => {
  if (!userId || !itemId) return false;

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('entity_id', itemId)
    .eq('entity_type', type)
    .maybeSingle();

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id);
    return false;
  }
  await supabase.from('favorites').insert({ user_id: userId, entity_id: itemId, entity_type: type });
  return true;
};

export const checkIsFavorite = async (userId, itemId) => {
  if (!userId || !itemId) return false;
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('entity_id', itemId)
    .maybeSingle();
  return !!data;
};

export const getFavorites = async (userId) => {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) { console.error('favoritesService.getFavorites:', error); return []; }
  return data;
};
