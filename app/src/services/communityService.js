import { supabase } from '../lib/supabaseClient';

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
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
