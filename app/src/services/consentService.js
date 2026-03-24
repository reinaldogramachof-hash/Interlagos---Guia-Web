import { supabase } from '../lib/supabaseClient';

/**
 * Registra um consentimento do usuário na tabela user_consents.
 * @param {string} userId - UUID do usuário
 * @param {string} consentType - 'terms_of_use' | 'privacy_policy' | 'news_responsibility' | 'ads_responsibility'
 * @param {string} version - versão do termo (default '1.0')
 */
export const recordConsent = async (userId, consentType, version = '1.0') => {
  const { error } = await supabase.from('user_consents').insert({
    user_id: userId,
    consent_type: consentType,
    version,
    user_agent: navigator.userAgent,
  });
  if (error) throw new Error('Falha ao registrar consentimento: ' + error.message);
};

/**
 * Verifica se o usuário já aceitou um tipo de consentimento.
 * @returns {boolean}
 */
export const hasConsent = async (userId, consentType, version = '1.0') => {
  const { data, error } = await supabase
    .from('user_consents')
    .select('id')
    .eq('user_id', userId)
    .eq('consent_type', consentType)
    .eq('version', version)
    .maybeSingle();
  if (error) return false;
  return !!data;
};

/**
 * Retorna todos os consentimentos de um usuário.
 */
export const fetchUserConsents = async (userId) => {
  const { data, error } = await supabase
    .from('user_consents')
    .select('*')
    .eq('user_id', userId)
    .order('accepted_at', { ascending: false });
  if (error) throw error;
  return data || [];
};
