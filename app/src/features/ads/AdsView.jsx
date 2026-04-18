import React, { useState } from 'react';
import { Tag, PlusCircle, Search, X } from 'lucide-react';
import AdCard from './AdCard';
import AdDetailModal from './AdDetailModal';
import CreateAdWizard from './CreateAdWizard';
import EmptyState from '../../components/EmptyState';
import { incrementAdClick } from '../../services/statsService';
import { useAuth } from '../auth/AuthContext';
import useAdsStore, { selectAds, selectAdsLoading } from '../../stores/adsStore';

const categories = ['Todos', 'Vendas', 'Empregos', 'Imóveis', 'Serviços', 'Veículos', 'Eletrônicos', 'Doações'];



export default function AdsView({ onRequireAuth }) {
    const { currentUser } = useAuth();
    const [selectedAd, setSelectedAd] = useState(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const ads = useAdsStore(selectAds);
    const loading = useAdsStore(selectAdsLoading);

    const filteredAds = ads.filter(ad => {
        const matchesCategory = selectedCategory === 'Todos' || ad.category === selectedCategory;
        const matchesSearch = ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              ad.description?.toLowerCase().includes(searchTerm.toLowerCase());
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
        <div className="pb-6 animate-in fade-in duration-300">

            {/* Header Fixo Integrado */}
            <div className="sticky top-14 z-20 bg-white/95 backdrop-blur-md pb-2 shadow-sm border-b border-gray-200">
                {/* Banner Classificados */}
                <div className="relative h-28 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800"
                        alt="Classificados"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-900/60 to-transparent flex items-center justify-between px-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
                                <Tag size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white leading-tight tracking-tight">Classificados</h2>
                                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">Compre, Venda e Troque</p>
                            </div>
                        </div>
                        {currentUser && (
                            <button
                                onClick={handleCreateClick}
                                className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-500/20 active:scale-95"
                            >
                                <PlusCircle size={16} />
                                Anunciar
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Busca + Filtros da OLX ── */}
                <div className="px-3 pt-3 space-y-2">
                    <div className="relative">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar classificados..."
                        className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                      />
                      {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <div className="overflow-x-auto whitespace-nowrap flex gap-2 pb-1 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold transition-all min-h-[36px] flex items-center ${selectedCategory === cat
                                        ? 'bg-brand-600 text-white shadow-sm'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Grid de Anúncios ── */}
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
                currentUser={currentUser}
            />
            <CreateAdWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
            />
        </div>
    );
}
