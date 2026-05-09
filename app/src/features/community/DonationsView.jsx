import React, { useState, useEffect } from 'react';
import { Heart, HandHeart, Gift, MessageCircle, PlusCircle, Users } from 'lucide-react';
import { fetchCampaigns } from '../../services/communityService';
import { useAuth } from '../auth/AuthContext';
import CampaignCard from './CampaignCard';
import CreateCampaignForm from './CreateCampaignForm';
import CampaignDetailModal from './CampaignDetailModal';
import { useToast } from '../../components/Toast';
import { PageHero, SearchBar, CategoryChips } from '../../components/mobile';

const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'donation', label: 'Quero Doar', icon: Gift, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'request', label: 'Preciso de Ajuda', icon: HandHeart, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'volunteer', label: 'Voluntariado', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'campaign', label: 'Campanhas Oficiais', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' }
];

export default function DonationsView() {
    const { currentUser } = useAuth();
    const showToast = useToast();
    const [selectedType, setSelectedType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [_showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const loadItems = async () => {
            try {
                const data = await fetchCampaigns();
                if (!cancelled) setItems(data);
            } catch (error) {
                console.error("Erro ao carregar itens:", error);
                showToast('Erro ao carregar doações.', 'error');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadItems();
    }, []);

    const filteredItems = items.filter(item => {
        const normalizedSearch = searchTerm.toLowerCase();
        const matchesType = selectedType === 'all' || item.type === selectedType;
        const matchesSearch = item.title?.toLowerCase().includes(normalizedSearch) || 
                              item.description?.toLowerCase().includes(normalizedSearch);
        return matchesType && matchesSearch;
    });

    const handleCreateClick = () => {
        if (!currentUser) {
            setShowLoginModal(true);
        } else {
            setShowCreateModal(true);
        }
    };

    const handleWhatsApp = (item) => {
        const text = `Olá, vi seu post "${item.title}" no Mural Solidário do Interlagos Conectado.`;
        const phone = item.whatsapp || item.contact;
        if (phone) {
            const number = phone.replace(/\D/g, '');
            window.open(`https://wa.me/55${number}?text=${encodeURIComponent(text)}`, '_blank');
        } else {
            showToast('Contato não disponível.', 'info');
        }
    };

    return (
        <div className="mobile-page animate-in fade-in slide-in-from-bottom-4">
            <div className="sticky top-14 z-20 mobile-sticky-panel pb-2 shadow-sm">
                <PageHero
                    section="campaigns"
                    title="Mural Solidário"
                    subtitle="Apoie a comunidade"
                    icon={Heart}
                >
                    {currentUser && (
                        <button
                            onClick={handleCreateClick}
                            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-500/20 active:scale-95"
                        >
                            <PlusCircle size={16} aria-hidden="true" />
                            Criar Ação
                        </button>
                    )}
                </PageHero>

                <div className="px-3 pt-3 space-y-2">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Buscar campanhas e pedidos..."
                    />
                    <CategoryChips
                        items={categories}
                        value={selectedType}
                        onChange={setSelectedType}
                        section="campaigns"
                        getId={(item) => item.id}
                        getLabel={(item) => item.label}
                        getIcon={(item) => item.icon}
                    />
                </div>
            </div>

            <div className="px-4 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    <p className="text-center text-slate-400 col-span-2 py-10">Carregando mural...</p>
                ) : filteredItems.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Heart className="mx-auto text-slate-300 mb-2" size={48} />
                        <p className="text-slate-500 font-medium">Nenhuma ação solidária encontrada nesta categoria.</p>
                        <button onClick={handleCreateClick} className="text-indigo-600 font-bold text-sm mt-2 hover:underline">Seja o primeiro a postar!</button>
                    </div>
                ) : (
                    filteredItems.map((item) => {
                        const cat = categories.find(c => c.id === item.type) || categories[4];
                        return (
                            <CampaignCard
                                key={item.id}
                                item={item}
                                cat={cat}
                                onWhatsApp={(e) => { e.stopPropagation(); handleWhatsApp(item); }}
                                onClick={() => setSelectedCampaign({ ...item, authorName: item.profiles?.display_name || 'Morador' })}
                            />
                        );
                    })
                )}
            </div>

            {showCreateModal && (
                <CreateCampaignForm
                    categories={categories}
                    currentUser={currentUser}
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            <CampaignDetailModal
                isOpen={!!selectedCampaign}
                campaign={selectedCampaign}
                onClose={() => setSelectedCampaign(null)}
                onWhatsApp={() => handleWhatsApp(selectedCampaign)}
            />
        </div>
    );
}
