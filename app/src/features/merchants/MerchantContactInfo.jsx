import React from 'react';
import { Phone, MessageCircle, Globe, MapPin } from 'lucide-react';

export function MerchantAddress({ address }) {
    return (
        <div className="flex items-center gap-2 text-gray-200 text-sm">
            <MapPin size={14} className="text-indigo-400" />
            <span>{address || 'Parque Interlagos, São José dos Campos - SP'}</span>
        </div>
    );
}

export function MerchantContactButtons({ plan, onWhatsApp }) {
    if (plan === 'free') return null;
    return (
        <div className="flex gap-3 pt-4">
            <button onClick={onWhatsApp} className="flex-1 bg-green-500 text-white py-3.5 rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2">
                <MessageCircle size={20} /> Chamar no Zap
            </button>
            <button className="flex-1 bg-indigo-50 text-indigo-700 py-3.5 rounded-xl font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2">
                <Phone size={20} /> Ligar Agora
            </button>
        </div>
    );
}

export function MerchantSocialLinks({ plan, socialLinks }) {
    if (!['professional', 'premium'].includes(plan) || !socialLinks) return null;
    return (
        <div className="grid grid-cols-3 gap-2">
            {socialLinks.instagram && (
                <a href={`https://instagram.com/${socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-3 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors">
                    <Globe size={20} />
                    <span className="text-[10px] font-bold mt-1">Insta</span>
                </a>
            )}
            {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <Globe size={20} />
                    <span className="text-[10px] font-bold mt-1">Face</span>
                </a>
            )}
            {socialLinks.site && (
                <a href={socialLinks.site} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                    <Globe size={20} />
                    <span className="text-[10px] font-bold mt-1">Site</span>
                </a>
            )}
        </div>
    );
}
