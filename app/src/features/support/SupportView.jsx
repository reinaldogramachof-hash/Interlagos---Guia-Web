import React from 'react';
import { MessageCircle, CreditCard, User, Wrench, Send, ExternalLink } from 'lucide-react';

const SupportView = () => {
    const handleTicket = () => {
        alert("Em breve: formulário de suporte");
    };

    const categories = [
        { id: 'ads', label: 'Meu anúncio', icon: Send, color: 'text-blue-500' },
        { id: 'account', label: 'Minha conta', icon: User, color: 'text-purple-500' },
        { id: 'tech', label: 'Problemas técnicos', icon: Wrench, color: 'text-orange-500' }
    ];

    return (
        <div className="p-4 bg-zinc-950 min-h-screen">
            {/* Header */}
            <div className="mb-8 p-1">
                <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-7 h-7 text-indigo-500" />
                    <h1 className="text-2xl font-bold text-white">Suporte</h1>
                </div>
                <p className="text-zinc-400 text-sm">Como podemos te ajudar hoje?</p>
            </div>

            {/* Quick Categories */}
            <div className="grid grid-cols-1 gap-4 mb-8">
                {categories.map((cat) => (
                    <div 
                        key={cat.id} 
                        className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-zinc-800 p-2.5 rounded-lg group-hover:bg-zinc-700 transition-colors">
                                <cat.icon className={`w-5 h-5 ${cat.color}`} />
                            </div>
                            <span className="text-zinc-200 font-medium">{cat.label}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-zinc-600" />
                    </div>
                ))}
            </div>

            {/* Support CTA */}
            <div className="mt-auto pt-4 border-t border-zinc-800/50">
                <button 
                    onClick={handleTicket}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    <MessageCircle className="w-5 h-5" />
                    Abrir chamado de suporte
                </button>
                <p className="mt-4 text-center text-[11px] text-zinc-500 leading-relaxed px-4">
                    O tempo de resposta varia de acordo com o seu plano de serviço, 
                    garantindo prioridade para membros Pro e Premium.
                </p>
            </div>
        </div>
    );
};

export default SupportView;
