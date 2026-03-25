import useAuthStore from '../stores/authStore';
import { PLANS_CONFIG, PLAN_IDS } from '../constants/plans';

export function useMerchantPlan() {
  const profile = useAuthStore(s => s.profile);
  const planId = profile?.plan ?? PLAN_IDS.FREE;

  return {
    planId,
    plan: PLANS_CONFIG[planId] ?? PLANS_CONFIG[PLAN_IDS.FREE],
    isFree: planId === PLAN_IDS.FREE,
    isBasic: planId === PLAN_IDS.BASIC,
    isPro: planId === PLAN_IDS.PRO,
    isPremium: planId === PLAN_IDS.PREMIUM,
    hasPlan: planId !== PLAN_IDS.FREE,
  };
}

export default useMerchantPlan;
