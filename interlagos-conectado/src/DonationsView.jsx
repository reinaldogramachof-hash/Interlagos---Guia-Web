import React, { useState, useEffect } from 'react';
import { Heart, HandHeart, Gift, ChevronRight, MessageCircle, PlusCircle, Filter, Calendar, MapPin, Users, ArrowRight, X, AlertTriangle } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useAuth } from './context/AuthContext';
import CampaignDetailModal from './CampaignDetailModal';
import LoginModal from './LoginModal';

const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'donation', label: 'Quero Doar', icon: Gift, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'request', label: 'Preciso de Ajuda', icon: HandHeart, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'volunteer', label: 'Voluntariado', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'campaign', label: 'Campanhas Oficiais', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' }
];

export default function DonationsView() {
    const { currentUser } = useAuth();
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedType, setSelectedType] = useState('all');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [newItemType, setNewItemType] = useState('donation');

    // Carregar itens APROVADOS
    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'campaigns'), where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItems(fetched);
            setLoading(false);
        }, (error) => {
            console.error("Erro ao carregar itens:", error);
            setLoading(false);
        });
        return () => unsubscribe();
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
            alert('Contato não disponível.');
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
                            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${cat.bg} ${cat.color}`}>
                                        {cat.icon && <cat.icon size={12} />}
                                        {cat.label}
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Recente'}
                                    </span>
                                </div>

                                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 leading-tight">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-3">{item.description}</p>

                                {item.image && (
                                    <div className="mb-4 h-40 rounded-xl overflow-hidden bg-slate-100">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                                            {item.authorName?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-xs text-slate-500 font-medium">{item.authorName?.split(' ')[0]}</span>
                                    </div>
                                    <button
                                        onClick={() => handleWhatsApp(item)}
                                        className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                                    >
                                        <MessageCircle size={14} />
                                        Contato
                                    </button>
                                </div>
                            </div>
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
                <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Nova Ação Solidária</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                        </div>

                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                            {categories.filter(c => c.id !== 'all').map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setNewItemType(cat.id)}
                                    className={`flex-1 min-w-[100px] flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${newItemType === cat.id
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-slate-100 hover:border-slate-200 text-slate-500'
                                        }`}
                                >
                                    {cat.icon && <cat.icon size={24} className={newItemType === cat.id ? 'text-indigo-600' : 'text-slate-400'} />}
                                    <span className="text-xs font-bold">{cat.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-6 flex gap-3">
                            <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                            <p className="text-xs text-amber-700 leading-relaxed">
                                <strong>Segurança:</strong> Nunca compartilhe dados bancários ou endereços residenciais publicamente. Combine entregas em locais públicos e seguros.
                            </p>
                        </div>

                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const f = e.target;
                            try {
                                await addDoc(collection(db, 'campaigns'), {
                                    title: f.title.value,
                                    description: f.description.value,
                                    whatsapp: f.whatsapp.value,
                                    type: newItemType, // donation, request, volunteer, campaign
                                    authorId: currentUser.uid,
                                    authorName: currentUser.displayName,
                                    status: 'pending',
                                    createdAt: serverTimestamp(),
                                    progress: 0
                                });
                                alert('Sua ação foi enviada para análise da moderação!');
                                setShowCreateModal(false);
                            } catch (err) {
                                console.error(err);
                                alert('Erro ao enviar.');
                            }
                        }} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Título</label>
                                <input name="title" placeholder={newItemType === 'request' ? "Do que você precisa?" : "O que você vai doar/oferecer?"} className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" required />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Descrição Detalhada</label>
                                <textarea name="description" placeholder="Descreva os itens, estado de conservação ou detalhes do pedido..." className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" rows="4" required />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">WhatsApp para Contato</label>
                                <input name="whatsapp" placeholder="(11) 99999-9999" className="w-full border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900" required />
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all mt-2">
                                Enviar para Análise
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
