import { supabase } from '../lib/supabaseClient';
import { createNotification, notifyAdmins } from './notificationService';

const NEIGHBORHOOD = import.meta.env.VITE_NEIGHBORHOOD;

// Suggestions
export async function fetchSuggestions() {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .eq('neighborhood', NEIGHBORHOOD)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createSuggestion(suggestion) {
  const { data, error } = await supabase
    .from('suggestions')
    .insert(suggestion)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Campaigns / Donations
export async function fetchCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('status', 'active')
    .is('merchant_id', null)          // apenas ações sociais, sem cupons de comerciantes
    .order('start_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createCampaign(campaign) {
  const sanitized = { ...campaign };
  let { data, error } = await supabase
    .from('campaigns')
    .insert(sanitized)
    .select()
    .single();

  if (error && (error.message?.includes('column') || error.hint?.includes('column') || error.message?.includes('schema cache'))) {
    console.warn('communityService: Fallback resiliente ativado. Removendo type e requester_id da inserção.', error);
    delete sanitized.type;
    delete sanitized.requester_id;
    
    // Tenta re-inserir. Se falhar no fallback, devolve o erro pro componente tratar.
    const retry = await supabase.from('campaigns').insert(sanitized).select().single();
    if (retry.error) throw retry.error;
    data = retry.data;
    error = null;
  }

  if (error) throw error;
  
  await notifyAdmins(
    'Nova Campanha Social Pendente',
    `Uma campanha social "${data.title}" aguarda aprovação.`,
    'info',
    data.id
  ).catch(() => {});
  return data;
}

export async function fetchCampaignsByUser(userId) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('requester_id', userId)
    .order('start_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminFetchCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('start_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteCampaign(id) {
  // Buscar campanha para identificar o autor
  const { data: campaign, error: fetchError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();
  
  if (fetchError) throw fetchError;

  // Notificar o autor antes da exclusão
  const userId = campaign.requester_id || campaign.author_id || campaign.user_id;
  if (userId) {
    await createNotification(
      userId,
      'Campanha Encerrada',
      `Sua campanha "${campaign.title}" foi removida pela administração.`,
      'info'
    );
  }

  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function voteSuggestion(id) {
  const { error } = await supabase.rpc('increment_suggestion_votes', { suggestion_id: id });
  if (error) throw error;
  return true;
}

export async function fetchCampaignsByMerchant(merchantId) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('start_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createMerchantCampaign(campaign) {
  const { data, error } = await supabase
    .from('campaigns')
    .insert({ ...campaign, status: 'pending', neighborhood: NEIGHBORHOOD })
    .select()
    .single();
  if (error) throw error;
  await notifyAdmins(
    'Nova Campanha Pendente',
    `Uma campanha "${data.title}" de comerciante aguarda aprovação.`,
    'info',
    data.id
  ).catch(() => {});
  return data;
}

export async function fetchActiveCoupons() {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('campaigns')
    .select('*, merchants(id, name, image_url, category, plan)')
    .eq('status', 'active')
    .eq('neighborhood', NEIGHBORHOOD)
    .gte('end_date', today)
    .order('start_date', { ascending: false });
  if (error) { return []; }
  return data ?? [];
}

export async function fetchPublicServices() {
  const { data, error } = await supabase
    .from('public_services')
    .select('*')
    .eq('neighborhood', NEIGHBORHOOD)
    .order('is_emergency', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createTicket(ticket) {
  const { data, error } = await supabase
    .from('tickets')
    .insert(ticket)
    .select()
    .single();
  if (error) throw error;
  await notifyAdmins(
    'Novo Ticket de Suporte',
    `Um novo ticket foi aberto${data?.subject ? `: "${data.subject}"` : ''}.`,
    'warning',
    data?.id ?? null
  ).catch(() => {});
  return data;
}
