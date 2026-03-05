import { supabase } from '../lib/supabaseClient';

export const getMerchants = async () => {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) { console.error('merchantService.getMerchants:', error); return []; }
  return data;
};

export const subscribeMerchants = (callback) => {
  getMerchants().then(callback);

  const channel = supabase.channel('merchants-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'merchants' }, () => {
      getMerchants().then(callback);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
};

export const createMerchant = async (data) => {
  const { data: result, error } = await supabase.from('merchants').insert(data).select().single();
  if (error) throw error;
  return result;
};

export const updateMerchant = async (id, data) => {
  const { error } = await supabase.from('merchants').update(data).eq('id', id);
  if (error) throw error;
};

export const deleteMerchant = async (id) => {
  const { error } = await supabase.from('merchants').delete().eq('id', id);
  if (error) throw error;
};

export const getMerchantByOwner = async (ownerId) => {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('owner_id', ownerId)
    .maybeSingle();
  if (error) { console.error('merchantService.getMerchantByOwner:', error); return null; }
  return data;
};

export const incrementMerchantView = async (merchantId) => {
  await supabase.rpc('increment_merchant_view', { merchant_id: merchantId }).catch(console.error);
};

export const incrementMerchantContactClick = async (merchantId) => {
  await supabase.rpc('increment_merchant_contact', { merchant_id: merchantId }).catch(console.error);
};
