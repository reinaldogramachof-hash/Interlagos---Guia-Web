import { supabase } from '../lib/supabaseClient';
import { createNotification } from './notificationService';

// Suggestions
export async function fetchSuggestions() {
  const { data, error } = await supabase
    .from('suggestions')
    .select('*')
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
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createCampaign(campaign) {
  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaign)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchCampaignsByUser(userId) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('requester_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function adminFetchCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });
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
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createMerchantCampaign(campaign) {
  const { data, error } = await supabase
    .from('campaigns')
    .insert({ ...campaign, status: 'pending' })
    .select()
    .single();
  if (error) throw error;
  return data;
}
