import React from 'react';
import { Check, Star } from 'lucide-react';

export default function PlanCard({ plan }) {
    if (!plan) return null;

    const isPremium = plan.price > 0;

    return (
        <div className={`mt-2 p-4 rounded-xl border ${isPremium ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-indigo-500 text-white' : 'bg-white border-slate-200 text-slate-800'} shadow-md max-w-xs`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-bold text-lg">{plan.name}</h4>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                        <span className={`text-xs ${isPremium ? 'text-slate-400' : 'text-slate-500'}`}>/mês</span>
                    </div>
                </div>
                {isPremium && <Star className="text-yellow-400 fill-yellow-400" size={20} />}
            </div>

            <p className={`text-xs mb-3 ${isPremium ? 'text-slate-300' : 'text-slate-500'}`}>{plan.description}</p>

            <ul className="space-y-1 mb-4">
                {plan.features && plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs">
                        <div className={`p-0.5 rounded-full ${isPremium ? 'bg-indigo-500/20 text-indigo-300' : 'bg-green-100 text-green-600'}`}>
                            <Check size={10} />
                        </div>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <button 
                className={`w-full py-2 rounded-lg font-bold text-xs transition-colors ${
                    isPremium 
                        ? 'bg-indigo-500 hover:bg-indigo-600 text-white' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                onClick={() => window.open(`https://wa.me/5511999999999?text=Tenho interesse no ${plan.name}`, '_blank')}
            >
                Assinar Agora
            </button>
        </div>
    );
}
