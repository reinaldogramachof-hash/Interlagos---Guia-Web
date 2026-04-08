import { supabase } from '../lib/supabaseClient';
import { createNotification } from './notificationService';

const NEIGHBORHOOD = import.meta.env.VITE_NEIGHBORHOOD;

// fetchAuditLogs: a tabela audit_logs não existe no schema.
// Usa click_events como proxy de auditoria de atividade — tabela real no schema.
export async function fetchAuditLogs() {
  const { data, error } = await supabase
    .from('click_events')
    .select('*, profiles!user_id(display_name)')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;

  return (data ?? []).map(row => ({
    id: row.id,
    created_at: row.created_at,
    action: row.entity_type,
    details: row.entity_id,
    user_id: row.user_id,
    user_name: row.profiles?.display_name || 'Usuário desconhecido',
    profiles: row.profiles,
  }));
}

export async function escalateItem(ticketData, targetCollection, targetId) {
  // Monta payload compatível com o schema real da tabela tickets:
  // tickets (author_id, subject, body, status, type, resolved_at, resolved_by)
  const { error: ticketError } = await supabase
    .from('tickets')
    .insert({
      subject: ticketData.subject,
      body: ticketData.body,
      status: 'open',
      type: ticketData.type || ticketData.target_collection || 'moderation',
      author_id: ticketData.author_id ?? null,
    });
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
    supabase.from('ads').select('*, profiles!seller_id(display_name)').eq('status', 'pending').eq('neighborhood', NEIGHBORHOOD).order('created_at', { ascending: true }),
    supabase.from('campaigns').select('*').eq('status', 'pending').eq('neighborhood', NEIGHBORHOOD),
  ]);
  return [
    ...(ads || []).map(a => ({ ...a, _table: 'ads', author_name: a.profiles?.display_name || 'Anônimo' })),
    ...(campaigns || []).map(c => ({ ...c, _table: 'campaigns', author_name: c.profiles?.display_name || 'Comunidade' })),
  ];
}

// approveItem: ads usam status 'approved' (fetchAds filtra por 'approved').
// campaigns usam status 'active' (fetchCampaigns filtra por 'active').
export async function approveItem(table, id) {
  const { data: item, error: fetchError } = await supabase.from(table).select('*').eq('id', id).single();
  if (fetchError) throw fetchError;

  const status = table === 'ads' ? 'approved' : 'active';
  const { error } = await supabase.from(table).update({ status }).eq('id', id);
  if (error) throw error;

  const userId = item.seller_id || item.author_id || item.requester_id || item.user_id;
  if (userId) {
    await createNotification(
      userId,
      'Aprovação Concluída',
      `Seu ${table === 'ads' ? 'anúncio' : 'campanha'} "${item.title}" foi aprovado!`,
      'success'
    );
  }
  return true;
}

// rejectItem: atualiza status para 'rejected' em vez de deletar — preserva trilha de auditoria
// e garante que a notificação já foi enviada antes deste ponto.
export async function rejectItem(table, id) {
  const { data: item, error: fetchError } = await supabase.from(table).select('*').eq('id', id).single();
  if (fetchError) throw fetchError;

  const { error } = await supabase.from(table).update({ status: 'rejected' }).eq('id', id);
  if (error) throw error;

  const userId = item.seller_id || item.author_id || item.requester_id || item.user_id;
  if (userId) {
    await createNotification(
      userId,
      'Item Rejeitado',
      `Seu ${table === 'ads' ? 'anúncio' : 'campanha'} "${item.title}" não atendeu às diretrizes.`,
      'warning'
    );
  }
  return true;
}

export async function fetchUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(100)
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

  const message = newRole === 'banned' 
    ? 'Sua conta foi suspensa por violação das diretrizes.' 
    : `Seu cargo no sistema foi alterado para: ${newRole}.`;
  
  await createNotification(userId, 'Atualização de Perfil', message, newRole === 'banned' ? 'error' : 'info');

  return data;
}

export async function fetchOpenTickets() {
  // Requer migration: docs/migrations/add-tickets-created-at.sql
  // Resiliência: Tenta buscar os tickets, opcionalmente com profile se a relação existir
  const { data, error } = await supabase
    .from('tickets')
    .select('*, author:profiles!author_id(display_name)')
    .eq('status', 'open');

  if (error) {
    // Fallback se o join ou tabela falhar
    const { data: simpleData, error: simpleError } = await supabase.from('tickets').select('*').eq('status', 'open');
    if (simpleError) throw simpleError;
    return simpleData ?? [];
  }
  return data ?? [];
}

export async function resolveTicket(ticketId, ticketData) {
  // Tenta o update completo
  let { data, error } = await supabase
    .from('tickets')
    .update(ticketData)
    .eq('id', ticketId)
    .select();

  // Retry resiliente: Se houver erro de coluna ausente (resolved_at/by), tenta apenas com o status
  if (error && (error.message?.includes('column') || error.hint?.includes('column'))) {
    const { data: retryData, error: retryError } = await supabase
      .from('tickets')
      .update({ status: ticketData.status })
      .eq('id', ticketId)
      .select();
    
    if (retryError) throw retryError;
    data = retryData;
    error = null;
  }

  if (error) throw error;
  const result = data?.[0];

  if (result && result.author_id) {
    await createNotification(
      result.author_id,
      'Solicitação Resolvida',
      `Sua solicitação #${result.id.slice(0, 8)} foi marcada como: ${ticketData.status}.`,
      ticketData.status === 'approved' ? 'success' : 'info'
    );
  }
  return result;
}

export async function seedDatabase(merchants, ads, news, campaigns) {
  // Helper resiliente: se falhar por erro de coluna, tenta o insert sem as colunas que costumam faltar
  const safeInsert = async (table, data) => {
    const { error } = await supabase.from(table).insert(data);
    if (error && (error.message?.includes('column') || error.hint?.includes('column') || error.message?.includes('schema cache'))) {
      const sanitized = data.map(item => {
        const newItem = { ...item };
        // Remove campos que causam falha comum se o schema estiver antigo
        delete newItem.gallery;
        delete newItem.social_links;
        delete newItem.is_premium;
        delete newItem.merchant_id;
        delete newItem.created_at;
        return newItem;
      });
      const { error: retryError } = await supabase.from(table).insert(sanitized);
      if (retryError) throw retryError;
    } else if (error) {
      throw error;
    }
  };

  await safeInsert('merchants', merchants);
  await safeInsert('ads', ads);
  await safeInsert('news', news);
  await safeInsert('campaigns', campaigns);

  return true;
}
