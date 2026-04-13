import { supabase } from '../lib/supabaseClient';

const trackEvent = async (entityId, entityType) => {
  const { data: { session } } = await supabase.auth.getSession();
  await supabase.from('click_events').insert({
    entity_id: entityId,
    entity_type: entityType,
    user_id: session?.user?.id || null,
    neighborhood: import.meta.env.VITE_NEIGHBORHOOD,
  }).catch(console.error);
};

export const incrementMerchantView     = (id) => trackEvent(id, 'merchant_view');
export const incrementMerchantContactClick = (id) => trackEvent(id, 'merchant_contact');
export const incrementAdView           = (id) => trackEvent(id, 'ad_view');
export const incrementAdClick          = (id) => trackEvent(id, 'ad_click');

export const getMerchantStats = async (merchantId, neighborhood) => {
  const base = supabase
    .from('click_events')
    .select('*', { count: 'exact', head: true })
    .eq('entity_id', merchantId)
    .eq('neighborhood', neighborhood);

  const [{ count: views }, { count: contacts }] = await Promise.all([
    base.eq('entity_type', 'merchant_view'),
    base.eq('entity_type', 'merchant_contact'),
  ]);

  return { views: views ?? 0, contacts: contacts ?? 0 };
};
