/**
 * Definição canônica dos planos do Interlagos Conectado.
 * Use sempre estas constantes em vez de strings soltas.
 */

export const PLAN_IDS = {
    NONE: 'none',
    BASIC: 'basic',
    PROFESSIONAL: 'professional',
    PREMIUM: 'premium',
};

/** Hierarquia numérica para comparações (>= significa acesso liberado) */
export const PLAN_RANK = {
    none: 0,
    basic: 1,
    professional: 2,
    premium: 3,
};

/** Metadados de exibição de cada plano */
export const PLANS_CONFIG = {
    none: {
        id: 'none',
        label: 'Sem Plano',
        color: 'gray',
        price: null,
        badge: null,
    },
    basic: {
        id: 'basic',
        label: 'Básico',
        color: 'blue',
        price: 'R$ 19,90/mês',
        badge: '🔵 Básico',
        adLimit: 3,   // máx. anúncios ativos
        categoryLimit: 1,
        photoLimit: 0,
        hasSocialLinks: false,
        hasStats: false,
        hasFeaturedBadge: false,
        hasTopSearch: false,
        hasBanner: false,
        hasVerifiedBadge: false,
        hasReports: false,
        hasCampaigns: false,
    },
    professional: {
        id: 'professional',
        label: 'Profissional',
        color: 'emerald',
        price: 'R$ 39,90/mês',
        badge: '🟢 Profissional',
        adLimit: 999,
        categoryLimit: 3,
        photoLimit: 10,
        hasSocialLinks: true,
        hasStats: true,
        hasFeaturedBadge: true,
        hasTopSearch: false,
        hasBanner: false,
        hasVerifiedBadge: false,
        hasReports: false,
        hasCampaigns: false,
    },
    premium: {
        id: 'premium',
        label: 'Premium',
        color: 'amber',
        price: 'R$ 79,90/mês',
        badge: '👑 Premium',
        adLimit: 999,
        categoryLimit: 999,
        photoLimit: 999,
        hasSocialLinks: true,
        hasStats: true,
        hasFeaturedBadge: true,
        hasTopSearch: true,
        hasBanner: true,
        hasVerifiedBadge: true,
        hasReports: true,
        hasCampaigns: true,
    },
};

/**
 * Verifica se o plano atual tem acesso a um determinado plano mínimo.
 * @param {string} currentPlan - plano atual do usuário
 * @param {string} requiredPlan - plano mínimo necessário
 */
export function hasPlanAccess(currentPlan, requiredPlan) {
    return (PLAN_RANK[currentPlan] ?? 0) >= (PLAN_RANK[requiredPlan] ?? 0);
}
