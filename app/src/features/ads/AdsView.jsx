import React, { useState, useEffect } from 'react';
import { Tag, PlusCircle } from 'lucide-react';
import AdCard from './AdCard';
import { fetchAds, subscribeAds } from '../../services/adsService';
import { useAuth } from '../auth/AuthContext';
import AdDetailModal from './AdDetailModal';
import CreateAdWizard from './CreateAdWizard';
import EmptyState from '../../components/EmptyState';
import LoginModal from '../auth/LoginModal';
import { incrementAdClick } from '../../services/statsService';

const categories = ['Todos', 'Vendas', 'Empregos', 'Imóveis', 'Serviços', 'Veículos', 'Eletrônicos', 'Doações'];



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
                        <AdCard 
                            key={ad.id} 
                            ad={ad} 
                            onClick={() => setSelectedAd(ad)} 
                            onWppClick={handleWppClick} 
                        />
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
