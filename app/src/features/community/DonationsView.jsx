import React, { useState, useEffect } from 'react';
import { Heart, HandHeart, Gift, ChevronRight, MessageCircle, PlusCircle, Filter, Calendar, MapPin, Users, ArrowRight, X, AlertTriangle } from 'lucide-react';
import { fetchCampaigns } from '../../services/communityService';
import { useAuth } from '../auth/AuthContext';
import CampaignCard from './CampaignCard';
import CreateCampaignForm from './CreateCampaignForm';
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
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedType, setSelectedType] = useState('all');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

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

    const filteredItems = selectedType === 'all'
        ? items
        : items.filter(item => item.type === selectedType);

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

            {/* Header / Intro */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-3xl text-white mb-6 mx-4 lg:mx-0 shadow-lg shadow-indigo-200">
                <h2 className="text-2xl font-bold mb-2">Mural Solidário</h2>
                <p className="text-indigo-100 text-sm mb-4">Conectando quem quer ajudar com quem precisa. Uma rede de apoio para Interlagos.</p>
                <div className="flex gap-2">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Gift size={12} /> Doações
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <HandHeart size={12} /> Pedidos
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Users size={12} /> Voluntários
                    </div>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-4 px-4 lg:px-0 -mb-2 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedType(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${selectedType === cat.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                    >
                        {cat.icon && <cat.icon size={16} className={selectedType === cat.id ? 'text-white' : cat.color} />}
                        {cat.label}
                    </button>
                ))}
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
                            <CampaignCard key={item.id} item={item} cat={cat} onWhatsApp={() => handleWhatsApp(item)} />
                        );
                    })
                )}
            </div>

            {/* FAB */}
            <button
                onClick={handleCreateClick}
                className="fixed bottom-24 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-105 transition-all z-50 flex items-center gap-2 font-bold pr-6"
            >
                <PlusCircle size={24} />
                Criar Ação
            </button>

            {/* Create Modal */}
            {showCreateModal && (
                <CreateCampaignForm 
                    categories={categories} 
                    currentUser={currentUser} 
                    onClose={() => setShowCreateModal(false)} 
                />
            )}
        </div>
    );
}
