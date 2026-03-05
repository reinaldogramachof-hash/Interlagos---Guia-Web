/**
 * useMerchantPlan — hook que retorna o plano ativo do comerciante logado.
 *
 * Lê do profile.plan (Supabase) via authStore.
 * Retorna 'none' se o usuário não for comerciante ou não tiver plano.
 */
import useAuthStore from '../stores/authStore';
import { PLANS_CONFIG, PLAN_IDS } from '../constants/plans';

export function useMerchantPlan() {
    const profile = useAuthStore(s => s.profile);
    const planId = profile?.plan ?? PLAN_IDS.NONE;

    return {
        planId,
        plan: PLANS_CONFIG[planId] ?? PLANS_CONFIG[PLAN_IDS.NONE],
        isBasic: planId === PLAN_IDS.BASIC,
        isProfessional: planId === PLAN_IDS.PROFESSIONAL,
        isPremium: planId === PLAN_IDS.PREMIUM,
        hasPlan: planId !== PLAN_IDS.NONE,
    };
}

export default useMerchantPlan;
