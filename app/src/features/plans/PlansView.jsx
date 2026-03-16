import React from 'react';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';

export default function PlansView() {
    const plans = [
        {
            id: 'basic',
            name: 'Básico',
            price: '19,90',
            period: '/mês',
            description: 'Ideal para pequenos negócios que estão começando a digitalizar sua presença.',
            icon: <Star className="text-blue-400" size={32} />,
            color: 'blue',
            features: [
                'Perfil comercial básico',
                'Presença em 1 categoria',
                'Link para WhatsApp',
                'Horário de funcionamento',
                'Suporte por email'
            ],
            cta: 'Começar Agora',
            popular: false
        },
        {
            id: 'intermediate',
            name: 'Profissional',
            price: '39,90',
            period: '/mês',
            description: 'Para quem quer mais visibilidade e ferramentas para atrair clientes.',
            icon: <Zap className="text-emerald-400" size={32} />,
            color: 'emerald',
            features: [
                'Tudo do plano Básico',
                'Presença em até 3 categorias',
                'Galeria de fotos (até 10)',
                'Links para Redes Sociais',
                'Destaque rotativo na categoria',
                'Estatísticas básicas de visitas'
            ],
            cta: 'Assinar Profissional',
            popular: true
        },
        {
            id: 'premium',
            name: 'Premium',
            price: '79,90',
            period: '/mês',
            description: 'Domine sua categoria e tenha o máximo de exposição e recursos exclusivos.',
            icon: <Crown className="text-amber-400" size={32} />,
            color: 'amber',
            features: [
                'Tudo do plano Profissional',
                'Categorias ilimitadas',
                'Topo nas buscas sempre',
                'Banner de destaque na Home',
                'Selo de Verificado Oficial',
                'Suporte prioritário WhatsApp',
                'Relatórios detalhados mensais'
            ],
            cta: 'Ser Premium',
            popular: false
        }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">
                    Escolha o plano ideal para o seu <span className="text-indigo-400">sucesso</span>
                </h2>
                <p className="text-slate-400 text-lg">
                    Destaque seu negócio para milhares de moradores do Bairro.
                    Sem fidelidade, cancele quando quiser.
                </p>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${plan.popular
                            ? 'bg-slate-800/80 border-indigo-500 shadow-2xl shadow-indigo-500/20 z-10 scale-105'
                            : 'bg-slate-900/50 border-white/10 hover:bg-slate-800 hover:border-white/20'
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                Mais Popular
                            </div>
                        )}

                        <div className="mb-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-${plan.color}-500/10`}>
                                {plan.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <p className="text-slate-400 text-sm min-h-[40px]">{plan.description}</p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-end gap-1 mb-1">
                                <span className="text-sm text-slate-400 font-medium mb-1">R$</span>
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                <span className="text-slate-500 mb-1">{plan.period}</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            {plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <div className={`mt-1 p-0.5 rounded-full bg-${plan.color}-500/20 text-${plan.color}-400`}>
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <span className="text-slate-300 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${plan.popular
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25'
                                : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
                                }`}
                        >
                            {plan.cta}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* FAQ / Trust Section */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-800/30 rounded-3xl p-8 border border-white/5">
                <div className="flex gap-4">
                    <div className="bg-green-500/10 p-3 rounded-xl h-fit text-green-400">
                        <Check size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-lg mb-2">Garantia de Satisfação</h4>
                        <p className="text-slate-400 text-sm">
                            Não gostou dos resultados no primeiro mês? Devolvemos seu dinheiro sem burocracia.
                            Queremos parceiros felizes.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="bg-purple-500/10 p-3 rounded-xl h-fit text-purple-400">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-lg mb-2">Ativação Imediata</h4>
                        <p className="text-slate-400 text-sm">
                            Assim que o pagamento for confirmado, seu perfil é atualizado automaticamente
                            com os novos recursos do plano escolhido.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
