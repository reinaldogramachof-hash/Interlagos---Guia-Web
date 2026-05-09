import { supabase } from '../lib/supabaseClient';
import { createNotification, notifyAdmins } from './notificationService';
import { readCache, writeCache } from '../utils/localCache';

const NEIGHBORHOOD = import.meta.env.VITE_NEIGHBORHOOD;
const PUBLIC_CACHE_TTL_MS = 1000 * 60 * 10; // 10 min
const cacheKey = (scope) => `tnb:${scope}:${NEIGHBORHOOD || 'default'}`;

async function withCache(scope, request, { preferCache = false } = {}) {
  const key = cacheKey(scope);

  if (preferCache) {
    const cached = readCache(key, PUBLIC_CACHE_TTL_MS);
    if (cached) {
      request().then((fresh) => writeCache(key, fresh)).catch(() => {});
      return cached;
    }
  }

  const fresh = await request();
  writeCache(key, fresh);
  return fresh;
}

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
export async function fetchCampaigns(options = {}) {
  return withCache('campaigns', async () => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('neighborhood', NEIGHBORHOOD)
      .eq('status', 'active')
      .is('merchant_id', null)          // apenas ações sociais, sem cupons de comerciantes
      .order('start_date', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }, options);
}

export async function createCampaign(campaign) {
  const sanitized = { ...campaign };
  let { data, error } = await supabase
    .from('campaigns')
    .insert(sanitized)
    .select()
    .single();

  if (error && (error.message?.includes('column') || error.hint?.includes('column') || error.message?.includes('schema cache'))) {
    console.warn('communityService: Fallback resiliente ativado. Removendo type da inserção.', error);
    delete sanitized.type;
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
    .eq('neighborhood', NEIGHBORHOOD)
    .eq('author_id', userId)
    .order('start_date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminFetchCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('neighborhood', NEIGHBORHOOD)
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

export async function updateCampaign(id, data) {
  const { data: updated, error } = await supabase
    .from('campaigns')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return updated;
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
    .eq('neighborhood', NEIGHBORHOOD)
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

export async function fetchActiveCoupons(options = {}) {
  return withCache('active-coupons', async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('campaigns')
      .select('*, merchants(id, name, image_url, category, plan)')
      .eq('status', 'active')
      .eq('neighborhood', NEIGHBORHOOD)
      .not('merchant_id', 'is', null)
      .gte('end_date', today)
      .order('start_date', { ascending: false });
    if (error) { return []; }
    return data ?? [];
  }, options);
}

export async function fetchPublicServices(options = {}) {
  return withCache('public-services', async () => {
    const { data, error } = await supabase
      .from('public_services')
      .select('*')
      .eq('neighborhood', NEIGHBORHOOD)
      .order('is_emergency', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }, options);
}

export async function adminFetchPublicServices() {
  const { data, error } = await supabase
    .from('public_services')
    .select('*')
    .eq('neighborhood', NEIGHBORHOOD)
    .order('category', { ascending: true })
    .order('name',     { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createPublicService(payload) {
  const { data, error } = await supabase
    .from('public_services')
    .insert({ ...payload, neighborhood: NEIGHBORHOOD })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePublicService(id, payload) {
  const { data, error } = await supabase
    .from('public_services')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePublicService(id) {
  const { error } = await supabase
    .from('public_services')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
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

// ── Admin: Sugestões ──────────────────────────────────────────
export const SUGGESTION_CATEGORIES = [
  'Segurança', 'Saúde', 'Limpeza', 'Infraestrutura', 'Lazer', 'Eventos', 'Meio Ambiente', 'Comércio Local', 'Transporte', 'Outros'
];

export async function adminFetchSuggestions() {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
    .eq('neighborhood', NEIGHBORHOOD)
    .order('votes', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchSuggestionStats() {
  const { data, error } = await supabase
    .from('suggestions')
    .select('title, status')
    .eq('neighborhood', NEIGHBORHOOD);
  
  if (error) throw error;

  const stats = {};
  (data ?? []).forEach(s => {
    if (s.status === 'pending' || s.status === 'reviewed') {
      stats[s.title] = (stats[s.title] || 0) + 1;
    }
  });
  return stats;
}

export async function updateSuggestionStatus(id, status) {
  const { error } = await supabase
    .from('suggestions')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function adminDeleteSuggestion(id) {
  const { error } = await supabase
    .from('suggestions')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
