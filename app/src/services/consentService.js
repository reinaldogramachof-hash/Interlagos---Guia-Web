import { supabase } from '../lib/supabaseClient';
import { updateUserProfile } from './authService';

/**
 * Registra um consentimento do usuário na tabela user_consents.
 * @param {string} userId - UUID do usuário
 * @param {string} consentType - 'terms_of_use' | 'privacy_policy' | 'news_responsibility' | 'ads_responsibility'
 */
export const recordConsent = async (userId, consentType) => {
  const { error } = await supabase.from('user_consents').insert({
    user_id: userId,
    consent_type: consentType,
    user_agent: navigator.userAgent,
  });
  if (error) {
    console.error('consentService.recordConsent:', error);
    throw new Error('Falha ao registrar consentimento: ' + error.message);
  }
};

/**
 * Verifica se o usuário já aceitou um tipo de consentimento.
 * @returns {boolean}
 */
export const hasConsent = async (userId, consentType) => {
  try {
    const { data, error } = await supabase
      .from('user_consents')
      .select('id')
      .eq('user_id', userId)
      .eq('consent_type', consentType)
      .maybeSingle();
    
    if (error) {
      console.warn('consentService.hasConsent check failed:', error.message);
      return false;
    }
    return !!data;
  } catch (err) {
    return false;
  }
};

/**
 * Retorna todos os consentimentos de um usuário.
 * Tenta ordenar por accepted_at ou created_at dependendo do que existir.
 */
export const fetchUserConsents = async (userId) => {
  // Simplificado para evitar erro de coluna inexistente se a migration falhou
  const { data, error } = await supabase
    .from('user_consents')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  
  // Ordenação manual no JS para garantir segurança caso as colunas de data variem
  return (data || []).sort((a, b) => {
    const dateA = new Date(a.accepted_at || a.created_at || 0);
    const dateB = new Date(b.accepted_at || b.created_at || 0);
    return dateB - dateA;
  });
};

// ── Termos de Uso — Governança LGPD ──────────────────────────────────────────

export const TERMS_CURRENT_VERSION = 'platform_terms_v1';

/**
 * Registra o aceite formal dos Termos de Uso versão atual.
 * Imutável: sempre INSERT, nunca UPDATE (trilha de auditoria LGPD).
 */
export const recordTermsAcceptance = async (userId) => {
  await recordConsent(userId, TERMS_CURRENT_VERSION);
  await updateUserProfile(userId, { terms_accepted_at: new Date().toISOString() });
};

/**
 * Verifica se o usuário já aceitou a versão atual dos termos.
 */
export const hasAcceptedCurrentTerms = async (userId) => {
  return hasConsent(userId, TERMS_CURRENT_VERSION);
};

