import React, { useState, useEffect } from 'react';
import { Tag, PlusCircle } from 'lucide-react';
import AdCard from './AdCard';
import { subscribeAds } from '../../services/adsService';
import AdDetailModal from './AdDetailModal';
import CreateAdWizard from './CreateAdWizard';
import EmptyState from '../../components/EmptyState';
import { incrementAdClick } from '../../services/statsService';
import { useAuth } from '../auth/AuthContext';
import { PageHero, SearchBar, CategoryChips } from '../../components/mobile';

const categories = ['Todos', 'Vendas', 'Empregos', 'Imóveis', 'Serviços', 'Veículos', 'Eletrônicos', 'Doações'];

export default function AdsView({ onRequireAuth }) {
    const { currentUser } = useAuth();
    const [selectedAd, setSelectedAd] = useState(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        const unsubscribe = subscribeAds((data) => {
            if (!cancelled) {
                setAds(data);
                setLoading(false);
            }
        });

        return () => {
            cancelled = true;
            unsubscribe();
        };
    }, []);

    const filteredAds = ads.filter(ad => {
        const normalizedSearch = searchTerm.toLowerCase();
        const matchesCategory = selectedCategory === 'Todos' || ad.category === selectedCategory;
        const matchesSearch = ad.title?.toLowerCase().includes(normalizedSearch) || 
                              ad.description?.toLowerCase().includes(normalizedSearch);
        return matchesCategory && matchesSearch;
    });

    const handleCreateClick = () => {
        onRequireAuth?.(() => setIsWizardOpen(true));
    };

    const handleWppClick = (e, ad) => {
        e.stopPropagation();
        if (!ad.contact) return;
        incrementAdClick(ad.id);
        const number = String(ad.contact).replace(/\D/g, '');
        window.open(`https://wa.me/55${number}?text=Olá! Vi seu anúncio "${ad.title}" no App Parque Interlagos.`, '_blank');
    };

    return (
        <div className="mobile-page animate-in fade-in duration-300">
            <div className="sticky top-14 z-20 mobile-sticky-panel pb-2 shadow-sm">
                <PageHero
                    section="ads"
                    title="Classificados"
                    subtitle="Compre, venda e troque"
                    icon={Tag}
                >
                    {currentUser && (
                        <button
                            onClick={handleCreateClick}
                            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-500/20 active:scale-95"
                        >
                            <PlusCircle size={16} aria-hidden="true" />
                            Anunciar
                        </button>
                    )}
                </PageHero>

                <div className="px-3 pt-3 space-y-2">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar classificados..."
                    />
                    <CategoryChips
                        items={categories}
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        section="ads"
                        getId={(item) => item}
                        getLabel={(item) => item}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-3 pt-4">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-3 pt-4">
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

            {!loading && filteredAds.length > 0 && (
                <p className="text-center text-xs text-gray-400 mt-4 mb-2">
                    {filteredAds.length} anúncio{filteredAds.length !== 1 ? 's' : ''} encontrado{filteredAds.length !== 1 ? 's' : ''}
                </p>
            )}

            <AdDetailModal
                isOpen={!!selectedAd}
                onClose={() => setSelectedAd(null)}
                ad={selectedAd}
                currentUser={currentUser}
            />
            <CreateAdWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
            />
        </div>
    );
}
