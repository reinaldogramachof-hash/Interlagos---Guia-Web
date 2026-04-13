import { supabase } from '../lib/supabaseClient';
import { notifyAdmins } from './notificationService';

export async function fetchAds() {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('status', 'approved')
    .eq('neighborhood', import.meta.env.VITE_NEIGHBORHOOD)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function subscribeAds(callback) {
  fetchAds().then(callback);
  const channel = supabase.channel('ads-realtime')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'ads',
      filter: `neighborhood=eq.${import.meta.env.VITE_NEIGHBORHOOD}`
    }, callback)
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export async function fetchAdsByUser(userId) {
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .eq('seller_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// Colunas válidas da tabela ads no Supabase.
// Remove campos extras do formData (ex: 'image' que é estado local do wizard).
function sanitizeAdPayload({ image: _image, ...rest }) {
  return rest;
}

export async function createAd(adData) {
  const payload = sanitizeAdPayload(adData);
  const { data, error } = await supabase
    .from('ads')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  await notifyAdmins(
    'Novo Classificado Pendente',
    `Um novo anúncio "${data.title}" aguarda aprovação.`,
    'info',
    data.id
  ).catch(() => {});
  return data;
}

export async function updateAd(adId, adData) {
  const payload = sanitizeAdPayload(adData);
  const { data: updated, error } = await supabase
    .from('ads')
    .update(payload)
    .eq('id', adId)
    .select()
    .single();
  if (error) throw error;
  return updated;
}

export async function deleteAd(adId) {
  const { error } = await supabase
    .from('ads')
    .delete()
    .eq('id', adId);
  if (error) throw error;
  return true;
}
