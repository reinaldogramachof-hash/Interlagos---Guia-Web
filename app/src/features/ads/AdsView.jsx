import React, { useState, useEffect } from 'react';
import { Tag, Briefcase, PlusCircle, MessageCircle } from 'lucide-react';
import { fetchAds, subscribeAds } from '../../services/adsService';
import { useAuth } from '../../context/AuthContext';
import AdDetailModal from './AdDetailModal';
import CreateAdWizard from './CreateAdWizard';
import EmptyState from '../../components/EmptyState';
import LoginModal from '../auth/LoginModal';
import { incrementAdClick } from '../../services/statsService';

const categories = ['Todos', 'Vendas', 'Empregos', 'Imóveis', 'Serviços', 'Veículos', 'Eletrônicos', 'Doações'];

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

export default function AdsView({ onRequireAuth }) {
    const { currentUser } = useAuth();
    const [selectedAd, setSelectedAd] = useState(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const loadAds = async () => {
            try {
                const data = await fetchAds();
                if (!cancelled) setAds(data);
            } catch (error) {
                console.error('Erro ao carregar anúncios:', error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        const unsubscribe = subscribeAds(loadAds);
        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, []);

    const filteredAds = selectedCategory === 'Todos'
        ? ads
        : ads.filter(ad => ad.category === selectedCategory);

    const handleCreateClick = () => {
        if (!currentUser) { setShowLoginModal(true); }
        else { setIsWizardOpen(true); }
    };

    const handleWppClick = (e, ad) => {
        e.stopPropagation();
        if (!ad.contact) return;
        incrementAdClick(ad.id);
        const number = String(ad.contact).replace(/\D/g, '');
        window.open(`https://wa.me/55${number}?text=Olá! Vi seu anúncio "${ad.title}" no App Parque Interlagos.`, '_blank');
    };

    return (
        <div className="pb-6 animate-in fade-in duration-300">

            {/* ── Filtros de Categoria (OLX style chips) ── */}
            <div className="overflow-x-auto whitespace-nowrap flex gap-2 px-3 py-3 border-b border-gray-100 bg-white">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === cat
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ── Grid de Anúncios ── */}
            {loading ? (
                <div className="grid grid-cols-2 gap-3 px-3 pt-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-card overflow-hidden shadow-card border border-gray-100">
                            <div className="h-40 bg-gray-100 animate-pulse" />
                            <div className="p-4 space-y-2">
                                <div className="h-3 bg-gray-100 rounded-pill animate-pulse w-3/4" />
                                <div className="h-4 bg-gray-100 rounded-pill animate-pulse w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredAds.length === 0 ? (
                <EmptyState
                    icon={<Tag className="text-indigo-400" size={28} />}
                    title="Nenhum anúncio aqui"
                    description="Seja o primeiro a anunciar nesta categoria!"
                    action={{
                        label: "Criar anúncio agora",
                        onClick: handleCreateClick
                    }}
                />
            ) : (
                <div className="grid grid-cols-2 gap-3 px-3 pt-4">
                    {filteredAds.map((ad) => (
                        <div
                            key={ad.id}
                            onClick={() => setSelectedAd(ad)}
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
                                
                                <h4 className="text-gray-900 text-xs font-semibold mb-1 line-clamp-1">
                                    {ad.title}
                                </h4>

                                <p className="text-brand-600 font-black text-lg leading-tight mb-3">
                                    {formatPrice(ad.price)}
                                </p>

                                {/* Botão WhatsApp minimalista */}
                                {ad.contact && (
                                    <button
                                        onClick={(e) => handleWppClick(e, ad)}
                                        className="mt-auto w-full flex items-center justify-center gap-1.5 bg-green-50 text-green-700 py-2 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors"
                                    >
                                        <MessageCircle size={14} />
                                        Zap
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Contagem de resultados */}
            {!loading && filteredAds.length > 0 && (
                <p className="text-center text-xs text-gray-400 mt-4 mb-2">
                    {filteredAds.length} anúncio{filteredAds.length !== 1 ? 's' : ''} encontrado{filteredAds.length !== 1 ? 's' : ''}
                </p>
            )}

            {/* Modais */}
            <AdDetailModal
                isOpen={!!selectedAd}
                onClose={() => setSelectedAd(null)}
                ad={selectedAd}
            />
            <CreateAdWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                user={currentUser}
            />
            {showLoginModal && (
                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    onSuccess={() => { setShowLoginModal(false); setIsWizardOpen(true); }}
                />
            )}
        </div>
    );
}
