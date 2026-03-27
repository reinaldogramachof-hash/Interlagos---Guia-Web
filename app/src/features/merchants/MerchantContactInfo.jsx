import React from 'react';
import { Phone, Globe, MapPin } from 'lucide-react';

export function MerchantAddress({ address }) {
    return (
        <div className="flex items-center gap-2 text-gray-200 text-sm">
            <MapPin size={14} className="text-indigo-400" />
            <span>{address || 'Parque Interlagos, São José dos Campos - SP'}</span>
        </div>
    );
}

export function MerchantContactButtons({ plan, onWhatsApp, phone }) {
    if (!plan || plan === 'free') return null;

    const cleanPhone = phone ? phone.replace(/\D/g, '') : null;

    return (
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {/* WhatsApp */}
            <button
                onClick={onWhatsApp}
                className="flex-1 flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] active:scale-95 text-white py-4 px-5 rounded-2xl font-bold text-sm transition-all shadow-md shadow-green-200"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L.057 23.882l6.195-1.624A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.87 9.87 0 0 1-5.031-1.378l-.36-.214-3.733.979.997-3.648-.235-.374A9.86 9.86 0 0 1 2.106 12C2.106 6.533 6.533 2.106 12 2.106S21.894 6.533 21.894 12 17.467 21.894 12 21.894z"/>
                </svg>
                Chamar no WhatsApp
            </button>

            {/* Telefone */}
            {cleanPhone ? (
                <a
                    href={`tel:+55${cleanPhone}`}
                    className="flex-1 flex items-center justify-center gap-2.5 bg-white border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 active:scale-95 text-indigo-700 py-4 px-5 rounded-2xl font-bold text-sm transition-all"
                >
                    <Phone size={18} className="shrink-0" strokeWidth={2.5} />
                    Ligar Agora
                </a>
            ) : (
                <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2.5 bg-gray-50 border-2 border-gray-100 text-gray-300 py-4 px-5 rounded-2xl font-bold text-sm cursor-not-allowed"
                >
                    <Phone size={18} className="shrink-0" strokeWidth={2} />
                    Ligar Agora
                </button>
            )}
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
