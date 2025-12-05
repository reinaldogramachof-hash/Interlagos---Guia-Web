import React from 'react';
import { Check, Star, Zap, Crown, X } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { createNotification } from './services/notificationService';

export default function UpgradeModal({ isOpen, onClose, currentPlan, merchantId, onUpgrade }) {
    if (!isOpen) return null;

    const handleUpgrade = async (plan) => {
        if (!merchantId) return;
        try {
            await updateDoc(doc(db, 'merchants', merchantId), {
                plan: plan,
                isPremium: plan !== 'basic'
            });

            if (auth.currentUser) {
                await createNotification(
                    auth.currentUser.uid,
                    'Plano Atualizado!',
                    `Parabéns! Seu plano foi atualizado para ${plan.toUpperCase()}. Aproveite os novos recursos!`,
                    'success'
                );
            }

            if (onUpgrade) onUpgrade(plan);
            onClose();
            alert(`Parabéns! Você agora é ${plan.toUpperCase()}!`);
        } catch (error) {
            console.error("Error upgrading:", error);
            alert("Erro ao atualizar plano.");
        }
    };

    const plans = [
        {
            id: 'basic',
            name: 'Básico',
            price: 'Grátis',
            icon: Star,
            color: 'text-slate-500',
            bg: 'bg-slate-50',
            features: ['1 Anúncio Ativo', 'Perfil Básico', 'Suporte por Email']
        },
        {
            id: 'pro',
            name: 'Profissional',
            price: 'R$ 29,90/mês',
            icon: Zap,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            features: ['5 Anúncios Ativos', 'Estatísticas Básicas', 'Destaque na Categoria', 'Suporte Prioritário'],
            popular: true
        },
        {
            id: 'premium',
            name: 'Premium',
            price: 'R$ 79,90/mês',
            icon: Crown,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
            features: ['Anúncios Ilimitados', 'Dashboard Completo', 'Topo das Buscas', 'Selo de Verificado', 'Atendimento WhatsApp']
        }
    ];

    return (
        <div className="fixed inset-0 z-[70] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Evolua seu Negócio</h2>
                        <p className="text-slate-500">Escolha o plano ideal para vender mais em Interlagos.</p>
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
