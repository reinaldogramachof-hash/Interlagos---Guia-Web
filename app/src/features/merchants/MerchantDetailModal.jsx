import React, { useEffect, useRef, useState } from 'react';
import { X, Clock, Star, Heart, Share2, Store, ShieldCheck } from 'lucide-react';
import { PLANS_CONFIG } from '../../constants/plans';
import { MerchantAddress, MerchantContactButtons, MerchantSocialLinks } from './MerchantContactInfo';
import { incrementMerchantView, incrementMerchantContactClick } from '../../services/statsService';
import { toggleFavorite, checkIsFavorite } from '../../services/favoritesService';
import { useAuth } from '../auth/AuthContext';
import useAuthStore from '../../stores/authStore';
import { useToast } from '../../components/Toast';
import { useScrollLock } from '../../hooks/useScrollLock';
import { getMerchantPosts } from '../../services/merchantPostsService';

export default function MerchantDetailModal({ merchant, onClose, onLoginRequired }) {
    const { currentUser } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);
    const [posts, setPosts] = useState([]);
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

    useEffect(() => {
        if (merchant?.id) getMerchantPosts(merchant.id).then(setPosts);
        else setPosts([]);
    }, [merchant?.id]);

    const handleWhatsApp = () => {
        if (merchant?.id) incrementMerchantContactClick(merchant.id);
        const message = `Olá, vi sua loja no Tem No Bairro!`;
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

                    <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full">
                        <div className="flex justify-between items-end">
                            <div>
                                <span className="inline-block px-3 py-1 bg-brand-600 text-white text-xs font-bold rounded-full mb-3 shadow-lg">
                                    {merchant.category}
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center gap-2">
                                    {merchant.name}
                                    {PLANS_CONFIG[merchant.plan]?.hasVerifiedBadge && (
                                        <ShieldCheck size={22} className="text-amber-400 shrink-0" title="Verificado Oficial" />
                                    )}
                                </h2>
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
                <div className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Store size={20} className="text-brand-600" /> Sobre
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {merchant.description || 'Uma excelente opção no Parque Interlagos, São José dos Campos, com produtos de qualidade e ótimo atendimento.'}
                                </p>
                            </div>

                            {/* Contact Buttons - HIDDEN FOR FREE PLAN */}
                            <MerchantContactButtons plan={merchant.plan} onWhatsApp={handleWhatsApp} phone={merchant.phone} />
                            {(!merchant.plan || merchant.plan === 'free') && (
                                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                    <Store size={12} /> Este comércio ainda não disponibilizou contato direto.
                                </p>
                            )}

                            {/* Photo Gallery (Pro & Premium) */}
                            {['pro', 'premium'].includes(merchant.plan) && merchant.gallery && merchant.gallery.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-brand-600 rounded-full"></div> Galeria de Fotos
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {merchant.gallery.map((url, index) => (
                                            <div key={index} className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm group cursor-pointer hover:shadow-md transition-all">
                                                <img src={url} alt={`Foto ${index + 1} de ${merchant.name}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {posts.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-brand-600 rounded-full" /> Da Vitrine
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {posts.slice(0, 4).map(post => {
                                            const TYPE_COLORS = {
                                                product: 'bg-blue-100 text-blue-700',
                                                service: 'bg-amber-100 text-amber-700',
                                                news: 'bg-emerald-100 text-emerald-700',
                                                promo: 'bg-indigo-100 text-indigo-700',
                                            };
                                            const TYPE_LABELS = { product: 'Produto', service: 'Serviço', news: 'Novidade', promo: 'Promoção' };
                                            return (
                                                <div key={post.id} className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex flex-col">
                                                    <div className="relative aspect-square bg-gray-100 shrink-0">
                                                        {post.image_url
                                                            ? <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                                                            : <div className="w-full h-full flex items-center justify-center text-gray-300"><Store size={24} /></div>
                                                        }
                                                        <span className={`absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${TYPE_COLORS[post.type] ?? TYPE_COLORS.product}`}>
                                                            {TYPE_LABELS[post.type] ?? post.type}
                                                        </span>
                                                    </div>
                                                    <div className="p-2 flex-1 flex flex-col justify-between">
                                                        <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">{post.title}</p>
                                                        {post.price != null && (
                                                            <p className="text-xs font-bold text-emerald-600 mt-0.5 whitespace-nowrap">R$ {Number(post.price).toLocaleString('pt-BR')}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
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

                            {['pro', 'premium'].includes(merchant.plan) && (
                                <div className="bg-brand-50 p-5 rounded-2xl border border-brand-100">
                                    <div className="flex items-center gap-2 mb-2 text-brand-600 font-bold">
                                        <Star size={18} className="text-amber-400 fill-amber-400" /> 4.8
                                    </div>
                                    <p className="text-xs text-brand-700">Baseado em 128 avaliações de clientes locais.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
