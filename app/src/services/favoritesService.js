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
  if (!data?.length) return [];

  // Agrupar entity_ids por tipo para batch fetch
  const merchantIds = data.filter(f => f.entity_type === 'merchant').map(f => f.entity_id);
  const adIds       = data.filter(f => f.entity_type === 'ad').map(f => f.entity_id);
  const newsIds     = data.filter(f => f.entity_type === 'news').map(f => f.entity_id);

  const [merchants, ads, news] = await Promise.all([
    merchantIds.length
      ? supabase.from('merchants').select('id, name, image_url, category, whatsapp').in('id', merchantIds).then(r => r.data ?? [])
      : Promise.resolve([]),
    adIds.length
      ? supabase.from('ads').select('id, title, image_url, category, price').in('id', adIds).then(r => r.data ?? [])
      : Promise.resolve([]),
    newsIds.length
      ? supabase.from('news').select('id, title, image_url, category').in('id', newsIds).then(r => r.data ?? [])
      : Promise.resolve([])
  ]);

  // Mapas para lookup O(1)
  const entityMap = {};
  merchants.forEach(m => { entityMap[m.id] = { name: m.name,  image: m.image_url, category: m.category, extra: m.whatsapp ? `wa.me/${m.whatsapp}` : null }; });
  ads.forEach(a       => { entityMap[a.id] = { name: a.title, image: a.image_url, category: a.category, extra: a.price ? `R$ ${Number(a.price).toLocaleString('pt-BR')}` : null }; });
  news.forEach(n      => { entityMap[n.id] = { name: n.title, image: n.image_url, category: n.category, extra: null }; });

  return data.map(fav => ({
    ...fav,
    name:     entityMap[fav.entity_id]?.name     ?? 'Item removido',
    image:    entityMap[fav.entity_id]?.image    ?? null,
    category: entityMap[fav.entity_id]?.category ?? null,
    extra:    entityMap[fav.entity_id]?.extra    ?? null,
  }));
};
