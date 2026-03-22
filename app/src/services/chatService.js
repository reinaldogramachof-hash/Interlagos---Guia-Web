import { supabase } from '../lib/supabaseClient';

/**
 * Busca o histórico de chat de um usuário (últimas 20 mensagens, ordem cronológica).
 * @param {string} userId - ID do usuário autenticado.
 * @returns {Promise<Array>} - Array de mensagens em ordem crescente de data.
 */
export async function fetchChatHistory(userId) {
  const { data, error } = await supabase
    .from('chat_history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('chatService.fetchChatHistory:', error);
    return [];
  }

  return (data || []).reverse();
}

/**
 * Subscreve a novos INSERTs em chat_history do usuário.
 * @param {string} userId - ID do usuário autenticado.
 * @param {Function} onInsert - Callback chamado quando um novo registro é inserido.
 * @returns {Function} - Função de cleanup para cancelar a subscrição.
 */
export function subscribeChatHistory(userId, onInsert) {
  const channel = supabase
    .channel(`chat-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_history',
        filter: `user_id=eq.${userId}`,
      },
      onInsert
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
