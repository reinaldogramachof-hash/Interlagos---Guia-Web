import { supabase } from '../lib/supabaseClient';

export async function fetchApprovals() {
  const { data, error } = await supabase
    .from('merchants')
    .select('*')
    .eq('is_active', false);
  if (error) throw error;
  return data ?? [];
}

export async function approveMerchant(id) {
  const { data, error } = await supabase
    .from('merchants')
    .update({ is_active: true })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchAuditLogs() {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*, profiles(display_name)')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}

export async function escalateItem(ticketData, targetCollection, targetId) {
  const { error: ticketError } = await supabase
    .from('tickets')
    .insert(ticketData);
  if (ticketError) throw ticketError;

  const { error: targetError } = await supabase
    .from(targetCollection)
    .update({ status: 'escalated' })
    .eq('id', targetId);
  if (targetError) throw targetError;

  return true;
}

export async function fetchPendingItems() {
  const [{ data: ads }, { data: campaigns }] = await Promise.all([
    supabase.from('ads').select('*').eq('status', 'pending'),
    supabase.from('campaigns').select('*').eq('status', 'pending'),
  ]);
  return [
    ...(ads || []).map(a => ({ ...a, _table: 'ads' })),
    ...(campaigns || []).map(c => ({ ...c, _table: 'campaigns' })),
  ];
}

export async function approveItem(table, id) {
  const { error } = await supabase.from(table).update({ status: 'active' }).eq('id', id);
  if (error) throw error;
  return true;
}

export async function rejectItem(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return true;
}

export async function fetchUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateUserRole(userId, newRole) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchOpenTickets() {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function resolveTicket(ticketId, ticketData) {
  const { data, error } = await supabase
    .from('tickets')
    .update(ticketData)
    .eq('id', ticketId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function seedDatabase(merchants, ads, news, campaigns) {
  const { error: e1 } = await supabase.from('merchants').insert(merchants);
  if (e1) throw e1;

  const { error: e2 } = await supabase.from('ads').insert(ads);
  if (e2) throw e2;

  const { error: e3 } = await supabase.from('news').insert(news);
  if (e3) throw e3;

  const { error: e4 } = await supabase.from('campaigns').insert(campaigns);
  if (e4) throw e4;

  return true;
}
