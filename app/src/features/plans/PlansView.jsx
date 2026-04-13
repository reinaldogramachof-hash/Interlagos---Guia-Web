import React from 'react';
import { Check, Star, Zap, Crown, ArrowRight, Shield, Zap as ZapIcon } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const PLAN_STYLES = {
  blue: {
    iconWrap: 'bg-blue-500/15 text-blue-400',
    checkWrap: 'bg-blue-500/20 text-blue-400',
    badge: '',
    price: 'text-white',
    cta: 'bg-white/8 hover:bg-white/15 text-white border border-white/10',
    card: 'bg-slate-800/60 border-white/10 hover:border-blue-500/40',
  },
  emerald: {
    iconWrap: 'bg-emerald-500/15 text-emerald-400',
    checkWrap: 'bg-emerald-500/20 text-emerald-400',
    badge: '',
    price: 'text-emerald-300',
    cta: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30',
    card: 'bg-slate-800/90 border-indigo-500/60 shadow-2xl shadow-indigo-500/15 z-10',
  },
  amber: {
    iconWrap: 'bg-amber-500/15 text-amber-400',
    checkWrap: 'bg-amber-500/20 text-amber-400',
    badge: '',
    price: 'text-amber-300',
    cta: 'bg-white/8 hover:bg-white/15 text-white border border-white/10',
    card: 'bg-slate-800/60 border-white/10 hover:border-amber-500/40',
  },
};

export default function PlansView({ onRegisterFree, onNavigate }) {
  const { isMerchant } = useAuth();

  const handlePaidCta = () => {
    if (isMerchant) {
      onNavigate?.('merchant-panel');
    } else {
      onRegisterFree?.();
    }
  };
  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: '19,90',
      period: '/mês',
      description: 'Para quem quer presença digital no bairro com um perfil completo.',
      Icon: Star,
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
      price: '49,90',
      period: '/mês',
      description: 'Mais visibilidade e ferramentas para atrair e fidelizar clientes.',
      Icon: Zap,
      color: 'emerald',
      features: [
        'Tudo do plano Básico',
        'Presença em até 3 categorias',
        'Galeria de fotos (até 10)',
        'Links para redes sociais',
        'Destaque rotativo na categoria',
        'Anúncios ilimitados',
        'Estatísticas e relatórios de visitas',
      ],
      cta: 'Assinar Pro',
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '99,90',
      period: '/mês',
      description: 'Domine sua categoria e tenha o máximo de exposição.',
      Icon: Crown,
      color: 'amber',
      features: [
        'Tudo do plano Pro',
        'Categorias ilimitadas',
        'Topo nas buscas sempre',
        'Banner de destaque na Home',
        'Selo Verificado Oficial',
        'Suporte prioritário WhatsApp',
        'Relatórios detalhados mensais',
        'Campanhas de desconto',
      ],
      cta: 'Ser Premium',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 animate-in fade-in slide-in-from-bottom-4">
      <div className="max-w-6xl mx-auto px-4 py-12 pb-24">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block bg-indigo-500/15 text-indigo-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-indigo-500/25 mb-5">
            Planos &amp; Preços
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Escolha o plano ideal para o seu{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              sucesso
            </span>
          </h2>
          <p className="text-slate-400 text-lg">
            Destaque seu negócio para milhares de moradores do Bairro.{' '}
            <span className="text-slate-300 font-medium">Sem fidelidade, cancele quando quiser.</span>
          </p>
        </div>

        {/* Plano Grátis */}
        <div className="mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:border-white/20 transition-colors">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">✦ Comece sem pagar nada</span>
              <h3 className="text-xl font-bold text-white mt-1">Plano Grátis</h3>
              <p className="text-slate-400 text-sm mt-1">Perfil básico + 1 anúncio ativo. Sem cartão de crédito.</p>
            </div>
            <div className="flex items-center gap-5 shrink-0">
              <span className="text-3xl font-bold text-white">R$ 0</span>
              <button
                onClick={onRegisterFree}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all border border-white/15 active:scale-95"
              >
                Cadastrar Grátis
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {plans.map((plan) => {
            const s = PLAN_STYLES[plan.color];
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 ${s.card} ${plan.popular ? 'scale-[1.03] md:scale-105' : ''}`}
              >
                {/* Badge Mais Popular */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-indigo-500/40 whitespace-nowrap">
                    ⚡ Mais Popular
                  </div>
                )}

                {/* Icon + Name */}
                <div className="mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${s.iconWrap}`}>
                    <plan.Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed min-h-[40px]">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="text-sm text-slate-400 font-medium mb-1.5">R$</span>
                    <span className={`text-5xl font-bold ${s.price}`}>{plan.price}</span>
                    <span className="text-slate-500 mb-1.5 text-sm">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="flex-1 space-y-3.5 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${s.checkWrap}`}>
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span className="text-slate-300 text-sm leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button onClick={handlePaidCta} className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${s.cta}`}>
                  {plan.cta}
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 rounded-3xl p-7 md:p-8 border border-white/8">
          <div className="flex gap-4">
            <div className="bg-emerald-500/15 p-3 rounded-xl h-fit text-emerald-400 shrink-0">
              <Shield size={22} />
            </div>
            <div>
              <h4 className="font-bold text-white text-base mb-1.5">Garantia de Satisfação</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Não gostou dos resultados no primeiro mês? Devolvemos seu dinheiro sem burocracia.
                Queremos parceiros felizes.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-indigo-500/15 p-3 rounded-xl h-fit text-indigo-400 shrink-0">
              <ZapIcon size={22} />
            </div>
            <div>
              <h4 className="font-bold text-white text-base mb-1.5">Ativação Imediata</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Assim que o pagamento for confirmado, seu perfil é atualizado automaticamente
                com os novos recursos do plano escolhido.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
