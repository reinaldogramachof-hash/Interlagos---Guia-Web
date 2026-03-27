import React, { useEffect, useRef, useState } from 'react';
import { X, Clock, Star, Heart, Share2, Store } from 'lucide-react';
import { MerchantAddress, MerchantContactButtons, MerchantSocialLinks } from './MerchantContactInfo';
import { incrementMerchantView, incrementMerchantContactClick } from '../../services/statsService';
import { toggleFavorite, checkIsFavorite } from '../../services/favoritesService';
import { useAuth } from '../auth/AuthContext';
import useAuthStore from '../../stores/authStore';
import { useToast } from '../../components/Toast';
import { useScrollLock } from '../../hooks/useScrollLock';

export default function MerchantDetailModal({ merchant, onClose, onLoginRequired }) {
    const { currentUser } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const showToast = useToast();
    const onCloseRef = useRef(onClose);

    // Mantém referência atualizada sem reexecutar effects
    useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

    useEffect(() => {
        if (merchant?.id) incrementMerchantView(merchant.id);
    }, [merchant?.id]);

    // Lock body scroll (iOS Safari compatível) + ESC to close
    useScrollLock(true);
    useEffect(() => {
        const handleKeyDown = (e) => { if (e.key === 'Escape') onCloseRef.current?.(); };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (merchant?.id && currentUser) {
            checkIsFavorite(currentUser.id, merchant.id).then(setIsFavorite);
        } else {
            setIsFavorite(false);
        }
    }, [merchant?.id, currentUser?.id]);

    const handleWhatsApp = () => {
        if (merchant?.id) incrementMerchantContactClick(merchant.id);
        const message = `Olá, vi sua loja no Tem No Bairro! (Parque Interlagos, SJC)`;
        const phone = merchant.whatsapp ? merchant.whatsapp.replace(/\D/g, '') : '';
        if (phone) {
            window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
        } else {
            showToast('Número de WhatsApp não disponível.', 'warning');
        }
    };

    const handleToggleFavorite = async () => {
        // Usa getState() para obter usuário fresco mesmo dentro de closures pós-login
        const userId = useAuthStore.getState().session?.user?.id;
        if (!userId) {
            onLoginRequired?.(() => handleToggleFavorite());
            return;
        }
        const newState = await toggleFavorite(userId, merchant.id, 'merchant', {
            name: merchant.name,
            image: merchant.image || null,
            category: merchant.category,
        });
        setIsFavorite(newState);
        showToast(newState ? 'Adicionado aos favoritos!' : 'Removido dos favoritos', newState ? 'success' : 'info');
    };

    if (!merchant) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">

                {/* Header Image */}
                <div className="h-48 sm:h-64 bg-gray-200 relative shrink-0">
                    <img
                        src={merchant.image_url || merchant.image || '/capa.jpg'}
                        alt={merchant.name}
                        className="w-full h-full object-cover" loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="absolute top-4 right-4 z-20 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 backdrop-blur-md transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Fechar"
                    >
                        <X size={20} />
                    </button>

                    <div className="absolute bottom-0 left-0 p-8 w-full">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full mb-3 shadow-lg">
                                    {merchant.category}
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{merchant.name}</h2>
                                <MerchantAddress address={merchant.address} />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleToggleFavorite}
                                    className={`p-3 rounded-full backdrop-blur-md transition-all ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                                >
                                    <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                                </button>
                                <button className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 backdrop-blur-md transition-all">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Store size={20} className="text-indigo-600" /> Sobre
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {merchant.description || 'Uma excelente opção no Parque Interlagos, São José dos Campos, com produtos de qualidade e ótimo atendimento.'}
                                </p>
                            </div>

                            {/* Contact Buttons - HIDDEN FOR FREE PLAN */}
                            <MerchantContactButtons plan={merchant.plan} onWhatsApp={handleWhatsApp} />
                            {(!merchant.plan || merchant.plan === 'free') && (
                                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                    <Store size={12} /> Este comércio ainda não disponibilizou contato direto.
                                </p>
                            )}

                            {/* Photo Gallery (Professional & Premium) */}
                            {['professional', 'premium'].includes(merchant.plan) && merchant.gallery && merchant.gallery.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-indigo-600 rounded-full"></div> Galeria de Fotos
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {merchant.gallery.map((url, index) => (
                                            <div key={index} className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm group cursor-pointer hover:shadow-md transition-all">
                                                <img src={url} alt={`Foto ${index + 1} de ${merchant.name}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Reviews - PREMIUM ONLY */}
                            {merchant.plan === 'premium' && (
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Star size={18} className="text-amber-400 fill-amber-400" /> Avaliações
                                    </h3>
                                    {/* Mock Reviews for Premium */}
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 p-4 rounded-xl">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-sm text-gray-800">Maria Silva</span>
                                                <div className="flex text-amber-400"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /></div>
                                            </div>
                                            <p className="text-xs text-gray-600">Adorei o atendimento! Recomendo muito.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            {/* Social Links - PROFESSIONAL & PREMIUM */}
                            <MerchantSocialLinks plan={merchant.plan} socialLinks={merchant.social_links} />

                            {merchant.hours ? (
                                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Clock size={18} className="text-gray-400" /> Horários
                                    </h3>
                                    <p className="text-sm text-gray-600 whitespace-pre-line">{merchant.hours}</p>
                                </div>
                            ) : null}

                            {['professional', 'premium'].includes(merchant.plan) && (
                                <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                                    <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold">
                                        <Star size={18} className="text-amber-400 fill-amber-400" /> 4.8
                                    </div>
                                    <p className="text-xs text-indigo-700">Baseado em 128 avaliações de clientes locais.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
