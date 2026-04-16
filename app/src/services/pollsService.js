import { supabase } from '../lib/supabaseClient';

const NEIGHBORHOOD = import.meta.env.VITE_NEIGHBORHOOD;

export async function fetchPolls() {
  const { data, error } = await supabase
    .from('polls')
    .select(`
      *,
      poll_options (id, text, display_order, poll_votes(option_id))
    `)
    .eq('neighborhood', NEIGHBORHOOD)
    .in('status', ['active', 'closed'])
    .order('created_at', { ascending: false });
  if (error) throw error;
  
  // Lógica de auto-encerramento baseada em expires_at
  const now = new Date();
  return (data ?? []).map(poll => {
    if (poll.status === 'active' && poll.expires_at && new Date(poll.expires_at) < now) {
      return { ...poll, status: 'closed', _autoClosed: true };
    }
    return poll;
  });
}

export async function fetchPollVoteCounts(pollId) {
  const { data, error } = await supabase
    .from('poll_votes')
    .select('option_id')
    .eq('poll_id', pollId);
  if (error) throw error;
  return data ?? [];
}

export async function fetchUserVotesForPolls(userId, pollIds) {
  if (!userId || !pollIds.length) return [];
  const { data, error } = await supabase
    .from('poll_votes')
    .select('poll_id')
    .eq('user_id', userId)
    .in('poll_id', pollIds);
  if (error) throw error;
  return data ?? [];
}

export async function checkUserVoted(pollId, userId) {
  const { data, error } = await supabase
    .from('poll_votes')
    .select('id')
    .eq('poll_id', pollId)
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function submitVote(pollId, optionId, userId) {
  const { data, error } = await supabase.rpc('submit_poll_vote', {
    p_poll_id: pollId,
    p_option_id: optionId,
    p_user_id: userId,
    p_neighborhood: NEIGHBORHOOD,
  });
  if (error) throw error;
  return data;
}

// ── Admin: Enquetes ──────────────────────────────────────────
export async function adminFetchPolls() {
  const { data, error } = await supabase
    .from('polls')
    .select(`
      *,
      poll_options (id, text, display_order, poll_votes(option_id))
    `)
    .eq('neighborhood', NEIGHBORHOOD)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createPoll(question, options, expiresAt = null) {
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({ question, status: 'draft', neighborhood: NEIGHBORHOOD, expires_at: expiresAt })
    .select()
    .single();
  if (pollError) throw pollError;

  const optionRows = options.map((text, index) => ({
    poll_id: poll.id,
    text,
    display_order: index,
  }));
  const { error: optError } = await supabase
    .from('poll_options')
    .insert(optionRows);
  if (optError) throw optError;

  return poll;
}

export async function updatePollStatus(id, status) {
  const { error } = await supabase
    .from('polls')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function deletePoll(id) {
  const { error } = await supabase
    .from('polls')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}