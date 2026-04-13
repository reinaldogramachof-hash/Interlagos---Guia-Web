import { supabase } from '../lib/supabaseClient';
import { createNotification, notifyAdmins } from './notificationService';

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
    .eq('neighborhood', import.meta.env.VITE_NEIGHBORHOOD)
    .order('created_at', { ascending: false });
  if (error) { console.error('merchantService.adminGetMerchants:', error); return []; }
  return data;
};

export const subscribeMerchants = (callback) => {
  getMerchants().then(callback);

  const channel = supabase.channel('merchants-realtime')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'merchants',
      filter: `neighborhood=eq.${import.meta.env.VITE_NEIGHBORHOOD}`
    }, () => {
      getMerchants().then(callback);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
};

export const createMerchant = async (data) => {
  const sanitizedData = { ...data };

  // R5: normaliza whatsapp (espelha updateMerchant)
  if (sanitizedData.whatsapp) {
    sanitizedData.whatsapp = sanitizedData.whatsapp.replace(/\D/g, '');
  }

  let { data: result, error } = await supabase.from('merchants').insert(sanitizedData).select();

  // Retry resiliente: Se o schema estiver antigo
  if (error && (error.message?.includes('column') || error.hint?.includes('column') || error.message?.includes('schema cache'))) {
    delete sanitizedData.gallery;
    delete sanitizedData.social_links;
    delete sanitizedData.social_url;
    delete sanitizedData.owner_id;
    
    const { data: retryData, error: retryError } = await supabase
      .from('merchants')
      .insert(sanitizedData)
      .select();
    
    if (retryError) throw retryError;
    result = retryData;
    error = null;
  }

  if (error) throw error;
  if (result?.[0]) {
    const createdMerchant = result[0];
    
    // Escalação de Role: Morador -> Comerciante
    if (createdMerchant.owner_id) {
      await supabase
        .from('profiles')
        .update({ role: 'merchant' })
        .eq('id', createdMerchant.owner_id);
    }

    await notifyAdmins(
      'Novo Comércio Aguardando Aprovação',
      `O negócio "${createdMerchant.name}" foi cadastrado e aguarda ativação.`,
      'info',
      createdMerchant.id
    ).catch(() => {});
  }
  return result?.[0];
};

export const updateMerchant = async (id, data) => {
  const sanitizedData = { ...data };
  
  // Limpeza de campos comuns: whatsapp
  if (sanitizedData.whatsapp) {
    sanitizedData.whatsapp = sanitizedData.whatsapp.replace(/\D/g, '');
  }

  // Tenta o update original
  let { data: updated, error } = await supabase
    .from('merchants')
    .update(sanitizedData)
    .eq('id', id)
    .select();

  // Retry resiliente: Se houver erro de coluna ausente (gallery, social_links, etc)
  if (error && (error.message?.includes('column') || error.hint?.includes('column') || error.message?.includes('schema cache'))) {
    // Remove todos os campos opcionais que podem não existir em schemas antigos
    delete sanitizedData.gallery;
    delete sanitizedData.social_links;
    delete sanitizedData.social_url;
    delete sanitizedData.owner_id; // Às vezes falta em schemas básicos
    
    // Tenta novamente apenas com o básico (nome, categoria, descrição, whatsapp, etc)
    const { data: retryData, error: retryError } = await supabase
      .from('merchants')
      .update(sanitizedData)
      .eq('id', id)
      .select();
    
    if (retryError) throw retryError;
    updated = retryData;
    error = null;
  }

  if (error) throw error;
  const result = updated?.[0];

  if (result) {
    // Notifica se houver um owner_id no resultado
    const userId = result.owner_id;
    if (userId) {
      await createNotification(
        userId,
        'Comércio Atualizado',
        `As informações do seu comércio "${result.name}" foram atualizadas pela administração.`,
        'info'
      ).catch(() => {}); // Ignora erro de notificação se a tabela não existir
    }
  }
  return result;
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
