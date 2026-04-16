import React, { useState, useEffect } from 'react';
import { Heart, HandHeart, Gift, ChevronRight, MessageCircle, PlusCircle, Filter, Calendar, MapPin, Users, ArrowRight, X, AlertTriangle, Search } from 'lucide-react';
import { fetchCampaigns } from '../../services/communityService';
import { useAuth } from '../auth/AuthContext';
import CampaignCard from './CampaignCard';
import CreateCampaignForm from './CreateCampaignForm';
import CampaignDetailModal from './CampaignDetailModal';
import { useToast } from '../../components/Toast';

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

    // Carregar itens APROVADOS com realtime
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
        const matchesType = selectedType === 'all' || item.type === selectedType;
        const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.description?.toLowerCase().includes(searchTerm.toLowerCase());
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
        const phone = item.whatsapp || item.contact; // Fallback
        if (phone) {
            const number = phone.replace(/\D/g, '');
            window.open(`https://wa.me/55${number}?text=${encodeURIComponent(text)}`, '_blank');
        } else {
            showToast('Contato não disponível.', 'info');
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-24">

            {/* Cabecalho Fixo Integrado */}
            <div className="sticky top-14 z-20 bg-gray-50/95 backdrop-blur-md pb-2 shadow-sm border-b border-gray-200">
                {/* Banner Mural Solidário */}
                <div className="relative h-28 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800"
                        alt="Mural Solidário"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-900/60 to-transparent flex items-center justify-between px-5">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
                                <Heart size={24} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white leading-tight tracking-tight">Mural Solidário</h2>
                                <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">Apoie a Comunidade</p>
                            </div>
                        </div>
                        {currentUser && (
                            <button
                                onClick={handleCreateClick}
                                className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-brand-500/20 active:scale-95"
                            >
                                <PlusCircle size={16} />
                                Criar Ação
                            </button>
                        )}
                    </div>
                </div>

                {/* Busca + Category Tabs */}
                <div className="px-4 lg:px-0 pt-3 space-y-3">
                    <div className="relative">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar campanhas e pedidos..."
                        className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                      />
                      {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedType(cat.id)}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all min-h-[36px] flex-shrink-0 ${selectedType === cat.id
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-gray-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {cat.icon && <cat.icon size={13} className={selectedType === cat.id ? 'text-white' : cat.color} />}
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 lg:px-0 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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



            {/* Create Modal */}
            {showCreateModal && (
                <CreateCampaignForm
                    categories={categories}
                    currentUser={currentUser}
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {/* Detail Modal */}
            <CampaignDetailModal
                isOpen={!!selectedCampaign}
                campaign={selectedCampaign}
                onClose={() => setSelectedCampaign(null)}
                onWhatsApp={() => handleWhatsApp(selectedCampaign)}
            />
        </div>
    );
}
