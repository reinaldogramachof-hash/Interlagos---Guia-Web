import { supabase } from '../lib/supabaseClient';

const trackEvent = async (entityId, entityType) => {
  const { data: { session } } = await supabase.auth.getSession();
  await supabase.from('click_events').insert({
    entity_id: entityId,
    entity_type: entityType,
    user_id: session?.user?.id || null,
  }).catch(console.error);
};

export const incrementMerchantView     = (id) => trackEvent(id, 'merchant_view');
export const incrementMerchantContactClick = (id) => trackEvent(id, 'merchant_contact');
export const incrementAdView           = (id) => trackEvent(id, 'ad_view');
export const incrementAdClick          = (id) => trackEvent(id, 'ad_click');
