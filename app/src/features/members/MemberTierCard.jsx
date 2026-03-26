import { Check, Star, Zap, MessageCircle } from 'lucide-react';

const MemberTierCard = ({ tier, isHighlighted }) => {
    const handleJoin = () => {
        const text = encodeURIComponent(`Quero ser ${tier.name} do Tem No Bairro - Interlagos`);
        window.open(`https://wa.me/${import.meta.env.VITE_WHATSAPP_SUPPORT || ''}?text=${text}`, '_blank');
    };

    return (
        <div className={`relative bg-white border ${isHighlighted ? 'border-brand-600 shadow-brand-500/20 shadow-xl scale-[1.02]' : 'border-slate-100'} rounded-card p-6 shadow-card transition-all active:scale-95`}>
            {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-bold px-3 py-1 rounded-pill uppercase tracking-wider">
                    Mais Escolhido
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                    {tier.name}
                    {tier.icon && <tier.icon className="w-5 h-5 text-brand-600" />}
                </h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">R$ {tier.price}</span>
                    <span className="text-slate-400 text-sm">/mês</span>
                </div>
            </div>

            <ul className="mb-8 space-y-3">
                {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <div className="bg-brand-50 p-1 rounded-full mt-0.5">
                            <Check className="w-3 h-3 text-brand-600" />
                        </div>
                        <span className="text-slate-500 text-xs leading-relaxed">{perk}</span>
                    </li>
                ))}
            </ul>

            <button 
                onClick={handleJoin}
                className={`w-full py-4 font-bold text-sm transition-all ${
                    isHighlighted 
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-card rounded-pill' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-pill'
                }`}
            >
                Quero este plano
            </button>
        </div>
    );
};

export default MemberTierCard;
