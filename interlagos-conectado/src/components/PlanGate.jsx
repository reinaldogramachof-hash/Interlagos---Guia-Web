/**
 * PlanGate — bloqueia o children se o plano do usuário for inferior ao requiredPlan.
 *
 * Uso:
 *   <PlanGate requiredPlan="professional">
 *     <GaleriaFotos />
 *   </PlanGate>
 *
 * Quando bloqueado, exibe um card de upgrade no lugar do conteúdo.
 */
import { Lock, ArrowRight, Zap, Crown, Star } from 'lucide-react';
import { hasPlanAccess, PLANS_CONFIG, PLAN_IDS } from '../constants/plans';
import useMerchantPlan from '../hooks/useMerchantPlan';

const PLAN_ICONS = {
    basic: <Star size={24} className="text-blue-400" />,
    professional: <Zap size={24} className="text-emerald-400" />,
    premium: <Crown size={24} className="text-amber-400" />,
};

export default function PlanGate({
    requiredPlan = PLAN_IDS.BASIC,
    children,
    onUpgradeClick,
    compact = false,    // modo compacto para usar dentro de cards pequenos
}) {
    const { planId } = useMerchantPlan();

    // Se tem acesso, renderiza normalmente
    if (hasPlanAccess(planId, requiredPlan)) {
        return children;
    }

    const required = PLANS_CONFIG[requiredPlan];

    // ── Modo compacto (inline lock overlay) ──────────────────────────────────────
    if (compact) {
        return (
            <div className="relative">
                <div className="opacity-30 pointer-events-none select-none">{children}</div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl gap-2">
                    <Lock size={20} className="text-slate-500" />
                    <p className="text-xs font-bold text-slate-600">Plano {required.label}</p>
                    {onUpgradeClick && (
                        <button
                            onClick={onUpgradeClick}
                            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                        >
                            Fazer upgrade <ArrowRight size={12} />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ── Modo completo (card de upgrade) ─────────────────────────────────────────
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-12 px-6 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-dashed border-slate-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                {PLAN_ICONS[requiredPlan] ?? <Lock size={24} className="text-slate-400" />}
            </div>
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                    Recurso do Plano {required.label}
                </h3>
                <p className="text-sm text-slate-500 max-w-xs">
                    Faça upgrade para o plano <strong>{required.label}</strong> ({required.price}) e desbloqueie este e outros recursos exclusivos.
                </p>
            </div>
            {onUpgradeClick ? (
                <button
                    onClick={onUpgradeClick}
                    className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
                >
                    Fazer Upgrade para {required.label}
                    <ArrowRight size={18} />
                </button>
            ) : (
                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                    Entre em contato com a gestão
                </span>
            )}
        </div>
    );
}
