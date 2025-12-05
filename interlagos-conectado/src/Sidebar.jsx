import React from 'react';
import { Store, Newspaper, Megaphone, Heart, Siren, History, Lightbulb, Users, ShieldCheck, DollarSign, Star } from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, handleAdminClick, className }) {
    const menuItems = [
        { id: 'merchants', label: 'Comércios', icon: <Store size={20} /> },
        { id: 'news', label: 'Notícias', icon: <Newspaper size={20} /> },
        { id: 'ads', label: 'Classificados', icon: <Megaphone size={20} /> },
        { id: 'donations', label: 'Doações', icon: <Heart size={20} /> },
        { id: 'utility', label: 'Utilidade Pública', icon: <Siren size={20} /> },
        { id: 'history', label: 'História', icon: <History size={20} /> },
        { id: 'suggestions', label: 'Sugestões', icon: <Lightbulb size={20} /> },
        { id: 'management', label: 'Gestão', icon: <ShieldCheck size={20} /> },
        { id: 'plans', label: 'Planos', icon: <DollarSign size={20} /> },
    ];

    return (
        <aside className={className}>
            <div className="px-6 pb-6 pt-0 flex flex-col h-full">
                <div className="flex items-center justify-center mb-8 mt-6">
                    <div className="text-center group cursor-default">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="bg-indigo-600 p-2 rounded-lg transform -rotate-3 group-hover:rotate-0 transition-all duration-300 shadow-lg shadow-indigo-500/20">
                                <Store className="text-white" size={24} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-light text-white tracking-tight leading-none">
                            TemNo<span className="font-black text-indigo-500">Bairro</span>
                        </h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-medium group-hover:text-indigo-400 transition-colors">Guia Oficial</p>
                    </div>
                </div>

                <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hide -mt-6">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${currentView === item.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-semibold'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <div className={`transition-colors ${currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                                {item.icon}
                            </div>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6">
                    {/* Card Destaque Simplificado */}
                    <button
                        onClick={() => setCurrentView('merchant-landing')}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-left shadow-lg shadow-indigo-500/20 group hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-1 border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                                <Star size={18} className="text-yellow-300 fill-yellow-300" />
                            </div>
                            <span className="font-bold text-white text-sm">Destaque seu Negócio</span>
                        </div>
                        <p className="text-xs text-indigo-100 leading-relaxed">
                            Atraia mais clientes e cresça com a gente.
                        </p>
                    </button>
                </div>
            </div>
        </aside>
    );
}
