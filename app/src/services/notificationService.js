import { supabase } from '../lib/supabaseClient';

export const createNotification = async (userId, title, message, type = 'info') => {
  if (!userId) return;
  const { error } = await supabase.from('notifications').insert({
    user_id: userId, title, body: message, type, is_read: false,
  });
  if (error) console.error('notificationService.create:', error);
};

export const markNotificationAsRead = async (userId, notificationId) => {
  if (!userId || !notificationId) return;
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', userId);
  if (error) console.error('notificationService.markRead:', error);
};

export const subscribeToNotifications = (userId, callback) => {
  if (!userId) return () => {};

  const fetch = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    // Normalize to keep backwards compat: 'read' field (old) → 'is_read' (new)
    callback((data || []).map(n => ({ ...n, read: n.is_read, message: n.body })));
  };

  fetch();

  const channel = supabase.channel(`notifications-${userId}`)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'notifications',
      filter: `user_id=eq.${userId}`,
    }, fetch)
    .subscribe();

  return () => supabase.removeChannel(channel);
};
