import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function CampaignCard({ item, cat, onWhatsApp }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-3">
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${cat.bg} ${cat.color}`}>
                    {cat.icon && <cat.icon size={12} />}
                    {cat.label}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : 'Recente'}
                </span>
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 leading-tight">{item.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-3">{item.description}</p>

            {item.image && (
                <div className="mb-4 h-40 rounded-xl overflow-hidden bg-slate-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                        {item.authorName?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{item.authorName?.split(' ')[0]}</span>
                </div>
                <button
                    onClick={onWhatsApp}
                    className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                >
                    <MessageCircle size={14} />
                    Contato
                </button>
            </div>
        </div>
    );
}
