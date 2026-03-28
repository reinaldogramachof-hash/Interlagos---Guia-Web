import React from 'react';
import { Check, Star, Zap, Crown, ArrowRight } from 'lucide-react';

export default function PlansView({ onRegisterFree }) {
    const plans = [
        {
            id: 'basic',
            name: 'Básico',
            price: '19,90',
            period: '/mês',
            description: 'Para quem quer presença digital no bairro com um perfil completo.',
            icon: <Star className="text-blue-400" size={32} />,
            color: 'blue',
            features: [
                'Perfil comercial completo',
                'Presença em 1 categoria',
                'Link para WhatsApp',
                'Até 3 anúncios ativos',
                'Suporte por email',
            ],
            cta: 'Começar Agora',
            popular: false,
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '39,90',
            period: '/mês',
            description: 'Mais visibilidade e ferramentas para atrair e fidelizar clientes.',
            icon: <Zap className="text-emerald-400" size={32} />,
            color: 'emerald',
            features: [
                'Tudo do plano Básico',
                'Presença em até 3 categorias',
                'Galeria de fotos (até 10)',
                'Links para redes sociais',
                'Destaque rotativo na categoria',
                'Anúncios ilimitados',
                'Estatísticas básicas de visitas',
            ],
            cta: 'Assinar Pro',
            popular: true,
        },
        {
            id: 'premium',
            name: 'Premium',
            price: '79,90',
            period: '/mês',
            description: 'Domine sua categoria e tenha o máximo de exposição.',
            icon: <Crown className="text-amber-400" size={32} />,
            color: 'amber',
            features: [
                'Tudo do plano Pro',
                'Categorias ilimitadas',
                'Topo nas buscas sempre',
                'Banner de destaque na Home',
                'Selo de Verificado Oficial',
                'Suporte prioritário WhatsApp',
                'Relatórios detalhados mensais',
                'Campanhas de desconto',
            ],
            cta: 'Ser Premium',
            popular: false,
        },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 pt-3">
                <h2 className="text-4xl font-bold text-gray-500 mb-4">
                    Escolha o plano ideal para o seu <span className="text-indigo-400">sucesso</span>
                </h2>
                <p className="text-slate-400 text-lg">
                    Destaque seu negócio para milhares de moradores do Bairro.
                    Sem fidelidade, cancele quando quiser.
                </p>
            </div>

            {/* Plano Grátis */}
            <div className="max-w-6xl mx-auto px-4 mb-6">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                    <div>
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                            Comece sem pagar nada
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 mt-1">Plano Grátis</h3>
                        <p className="text-slate-600 text-sm mt-1">
                            Perfil básico + 1 anúncio ativo. Sem cartão de crédito.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        <span className="text-3xl font-bold text-slate-900">R$ 0</span>
                        <button
                            onClick={onRegisterFree}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
                        >
                            Cadastrar Grátis
                        </button>
                    </div>
                </div>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${plan.popular
                                ? 'bg-white border-indigo-500 shadow-2xl shadow-indigo-200 z-10 scale-105'
                                : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                Mais Popular
                            </div>
                        )}

                        <div className="mb-6">
                            {/* Ajustado: Fundo do ícone mais suave para fundo branco */}
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-slate-50 text-indigo-600`}>
                                {plan.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                            <p className="text-slate-600 text-sm min-h-[40px]">{plan.description}</p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-end gap-1 mb-1">
                                <span className="text-sm text-slate-500 font-medium mb-1">R$</span>
                                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                <span className="text-slate-500 mb-1">{plan.period}</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            {plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    {/* Ajustado: Check icon com cor sólida para contraste */}
                                    <div className="mt-1 p-0.5 rounded-full bg-emerald-100 text-emerald-600">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <span className="text-slate-600 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={plan.id === 'free' ? onRegisterFree : undefined} // Exemplo de uso da sua função
                            className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${plan.popular
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                                }`}
                        >
                            {plan.cta}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* FAQ / Trust Section */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 rounded-3xl p-8 border border-slate-200 ml-1 mr-1 shadow-sm">
                <div className="flex gap-4">
                    {/* Ícone de Garantia: Fundo verde menta com ícone verde floresta */}
                    <div className="bg-emerald-100 p-3 rounded-xl h-fit text-emerald-600">
                        <Check size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg mb-2">Garantia de Satisfação</h4>
                        <p className="text-slate-600 text-sm">
                            Não gostou dos resultados no primeiro mês? Devolvemos seu dinheiro sem burocracia.
                            Queremos parceiros felizes.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    {/* Ícone de Ativação: Fundo roxo suave com ícone roxo profundo */}
                    <div className="bg-purple-100 p-3 rounded-xl h-fit text-purple-600">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg mb-2">Ativação Imediata</h4>
                        <p className="text-slate-600 text-sm">
                            Assim que o pagamento for confirmado, seu perfil é atualizado automaticamente
                            com os novos recursos do plano escolhido.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
