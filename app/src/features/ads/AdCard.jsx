import React from 'react';
import { Briefcase, MessageCircle } from 'lucide-react';

// Formata o preço vindo do banco (número ou null)
function formatPrice(price) {
    if (!price && price !== 0) return 'A combinar';
    if (typeof price === 'number') {
        return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return price;
}

// Tempo relativo
function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
}

export default function AdCard({ ad, onClick, onWppClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-card overflow-hidden shadow-card border border-gray-100 cursor-pointer hover:shadow-md transition-shadow relative group flex flex-col"
        >
            {/* Imagem */}
            <div className="h-40 overflow-hidden bg-gray-50 relative shrink-0">
                {ad.image_url || ad.image ? (
                    <img
                        src={ad.image_url || ad.image}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Briefcase size={32} />
                    </div>
                )}
                {/* Tempo (Badge discreta) */}
                <span className="absolute top-2 right-2 bg-white/80 text-gray-600 text-micro px-2 py-0.5 rounded-pill backdrop-blur-sm">
                    {timeAgo(ad.created_at)}
                </span>
            </div>

            {/* Informações do card */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="mb-2">
                    <span className="bg-brand-50 text-brand-600 text-micro px-2 py-0.5 rounded-pill uppercase font-bold tracking-wider">
                        {ad.category}
                    </span>
                </div>
                
                <h4 className="text-gray-900 text-sm font-semibold mb-1 line-clamp-1">
                    {ad.title}
                </h4>

                <p className="text-brand-600 font-black text-lg leading-tight mb-3">
                    {formatPrice(ad.price)}
                </p>

                {/* Botão WhatsApp minimalista */}
                {ad.contact && (
                    <button
                        onClick={(e) => onWppClick(e, ad)}
                        className="mt-auto w-full flex items-center justify-center gap-1.5 bg-green-50 text-green-700 py-2 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors"
                    >
                        <MessageCircle size={14} />
                        Zap
                    </button>
                )}
            </div>
        </div>
    );
}
