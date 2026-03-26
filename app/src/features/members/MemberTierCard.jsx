import React from 'react';
import { Check, Star, Zap, MessageCircle } from 'lucide-react';

const MemberTierCard = ({ tier, isHighlighted }) => {
    const handleJoin = () => {
        const text = encodeURIComponent(`Quero ser ${tier.name} do Tem No Bairro - Interlagos`);
        window.open(`https://wa.me/5512999999999?text=${text}`, '_blank');
    };

    return (
        <div className={`relative bg-zinc-900 border ${isHighlighted ? 'border-purple-500 shadow-purple-500/20 shadow-2xl scale-[1.02]' : 'border-zinc-800'} rounded-2xl p-6 transition-all active:scale-95`}>
            {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Mais Escolhido
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                    {tier.name}
                    {tier.icon && <tier.icon className="w-5 h-5 text-purple-400" />}
                </h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">R$ {tier.price}</span>
                    <span className="text-zinc-500 text-sm">/mês</span>
                </div>
            </div>

            <ul className="mb-8 space-y-3">
                {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <div className="bg-purple-900/40 p-1 rounded-full mt-0.5">
                            <Check className="w-3 h-3 text-purple-400" />
                        </div>
                        <span className="text-zinc-400 text-xs leading-relaxed">{perk}</span>
                    </li>
                ))}
            </ul>

            <button 
                onClick={handleJoin}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
                    isHighlighted 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg' 
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100'
                }`}
            >
                Quero este plano
            </button>
        </div>
    );
};

export default MemberTierCard;
