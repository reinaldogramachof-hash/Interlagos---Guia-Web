import React from 'react';
import { Check, Star, Zap, Crown, X } from 'lucide-react';
import { updateMerchant } from '../../services/merchantService';
import { createNotification } from '../../services/notificationService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../components/Toast';

export default function UpgradeModal({ isOpen, onClose, currentPlan, merchantId, onUpgrade }) {
    const { currentUser } = useAuth();
    const showToast = useToast();
    if (!isOpen) return null;

    const handleUpgrade = async (plan) => {
        if (!merchantId) return;
        try {
            await updateMerchant(merchantId, { plan });

            if (currentUser) {
                await createNotification(
                    currentUser.id || currentUser.uid,
                    'Plano Atualizado!',
                    `Parabéns! Seu plano foi atualizado para ${plan.toUpperCase()}. Aproveite os novos recursos!`,
                    'success'
                );
            }

            if (onUpgrade) onUpgrade(plan);
            onClose();
            showToast(`Parabéns! Você agora é ${plan.toUpperCase()}!`, 'success');
        } catch (error) {
            console.error("Error upgrading:", error);
            showToast("Erro ao atualizar plano.", "error");
        }
    };

    const plans = [
        {
            id: 'basic',
            name: 'Básico',
            price: 'R$ 19,90/mês',
            icon: Star,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            features: ['Perfil completo no bairro', 'Até 3 anúncios ativos', 'Link para WhatsApp', 'Suporte por email'],
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 'R$ 49,90/mês',
            icon: Zap,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            features: ['Anúncios ilimitados', 'Estatísticas e relatórios', 'Links para redes sociais', 'Destaque na categoria'],
            popular: true,
        },
        {
            id: 'premium',
            name: 'Premium',
            price: 'R$ 99,90/mês',
            icon: Crown,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
            features: ['Tudo do Pro', 'Topo nas buscas', 'Campanhas de desconto', 'Selo Verificado', 'Suporte WhatsApp'],
        },
    ];

    return (
        <div className="fixed inset-0 z-[70] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Evolua seu Negócio</h2>
                        <p className="text-slate-500">Escolha o plano ideal para vender mais no Bairro.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl p-6 border-2 transition-all hover:scale-105 ${currentPlan === plan.id
                                ? 'border-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-900/30'
                                : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'
                                } ${plan.popular ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'bg-white dark:bg-slate-800'}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-lg">
                                    MAIS POPULAR
                                </div>
                            )}

                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.bg} ${plan.color}`}>
                                <plan.icon size={24} />
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{plan.name}</h3>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{plan.price}</p>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={currentPlan === plan.id}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${currentPlan === plan.id
                                    ? 'bg-slate-100 text-slate-400 cursor-default'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                                    }`}
                            >
                                {currentPlan === plan.id ? 'Plano Atual' : 'Escolher Plano'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
