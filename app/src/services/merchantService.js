import { supabase } from '../lib/supabaseClient';
import { createNotification } from './notificationService';

export const getMerchants = async () => {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('is_active', true)
    .eq('neighborhood', import.meta.env.VITE_NEIGHBORHOOD)
    .order('created_at', { ascending: false });
  if (error) { console.error('merchantService.getMerchants:', error); return []; }
  return data;
};

export const adminGetMerchants = async () => {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('merchantService.adminGetMerchants:', error); return []; }
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
  // Tratar formatação interna: limpar caracteres do WhatsApp se presente
  const sanitizedData = { ...data };
  if (sanitizedData.whatsapp) {
    sanitizedData.whatsapp = sanitizedData.whatsapp.replace(/\D/g, '');
  }

  const { data: updated, error } = await supabase
    .from('merchants')
    .update(sanitizedData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  if (updated.owner_id) {
    await createNotification(
      updated.owner_id,
      'Comércio Atualizado',
      `As informações do seu comércio "${updated.name}" foram atualizadas pela administração.`,
      'info'
    );
  }
  return updated;
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
  await supabase.rpc('increment_merchant_view', { p_merchant_id: merchantId }).catch(console.error);
};

export const incrementMerchantContactClick = async (merchantId) => {
  await supabase.rpc('increment_merchant_contact', { p_merchant_id: merchantId }).catch(console.error);
};

export const fetchMerchantByEmail = async (email) => {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  if (error) { console.error('merchantService.fetchMerchantByEmail:', error); return null; }
  return data;
};

export const toggleMerchantActive = async (id, isActive) => {
  const { data, error } = await supabase
    .from('merchants')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};
