import React, { useState, useEffect } from 'react';
import { X, User, Heart, List, Settings, Star, Megaphone, PlusCircle } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import { getFavorites } from '../services/favoritesService';

export default function ResidentPanel({ onClose }) {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('activities');
    const [myActivities, setMyActivities] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'activities' || activeTab === 'ads') {
            fetchMyActivities();
        } else if (activeTab === 'favorites') {
            fetchFavorites();
        }
    }, [activeTab]);

    const fetchMyActivities = async () => {
        setLoading(true);
        try {
            // Fetch user's donations/campaigns
            const campaignsQ = query(collection(db, 'campaigns'), where('authorId', '==', currentUser.uid));
            const campaignsSnap = await getDocs(campaignsQ);

            // Fetch user's ads
            const adsQ = query(collection(db, 'ads'), where('author.uid', '==', currentUser.uid));
            const adsSnap = await getDocs(adsQ);

            const activities = [
                ...campaignsSnap.docs.map(doc => ({ id: doc.id, type: 'Campanha', ...doc.data() })),
                ...adsSnap.docs.map(doc => ({ id: doc.id, type: 'Anúncio', ...doc.data() }))
            ];

            setMyActivities(activities);
        } catch (error) {
            console.error("Error fetching activities:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const favs = await getFavorites(currentUser.uid);
            setFavorites(favs);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">

                {/* Header */}
                <div className="bg-emerald-600 p-6 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <User className="text-emerald-200" /> Área do Morador
                        </h2>
                        <p className="text-emerald-100 text-sm">Acompanhe suas interações</p>
                    </div>
                    <button onClick={onClose} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                        <button onClick={() => setActiveTab('activities')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 ${activeTab === 'activities' ? 'bg-white dark:bg-slate-900 text-emerald-600 border-l-4 border-emerald-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <List size={18} /> Minhas Atividades
                        </button>
                        <button onClick={() => setActiveTab('ads')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 ${activeTab === 'ads' ? 'bg-white dark:bg-slate-900 text-emerald-600 border-l-4 border-emerald-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <Megaphone size={18} /> Meus Anúncios
                        </button>
                        <button onClick={() => setActiveTab('favorites')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 ${activeTab === 'favorites' ? 'bg-white dark:bg-slate-900 text-emerald-600 border-l-4 border-emerald-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <Heart size={18} /> Favoritos
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 ${activeTab === 'settings' ? 'bg-white dark:bg-slate-900 text-emerald-600 border-l-4 border-emerald-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <Settings size={18} /> Meus Dados
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto p-6">

                        {activeTab === 'activities' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Histórico de Atividades</h3>

                                {loading ? (
                                    <p className="text-center text-slate-400">Carregando...</p>
                                ) : myActivities.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                        <p className="text-slate-500">Você ainda não criou nenhuma campanha ou anúncio.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {myActivities.map(item => (
                                            <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{item.type}</span>
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'
                                                            }`}>
                                                            {item.status === 'approved' ? 'Aprovado' : item.status === 'pending' ? 'Em Análise' : 'Inativo'}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : ''}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'ads' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Meus Anúncios</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Star size={12} fill="currentColor" /> {currentUser.credits || 0} Créditos
                                        </div>
                                        <button className="text-indigo-600 font-bold text-sm hover:underline">Comprar +</button>
                                    </div>
                                </div>

                                {loading ? (
                                    <p className="text-center text-slate-400">Carregando...</p>
                                ) : myActivities.filter(a => a.type === 'Anúncio').length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                        <p className="text-slate-500">Você ainda não tem anúncios.</p>
                                        <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 mx-auto">
                                            <PlusCircle size={18} /> Criar Anúncio
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {myActivities.filter(a => a.type === 'Anúncio').map(ad => (
                                            <div key={ad.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden">
                                                        {ad.image && <img src={ad.image} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white">{ad.title}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ad.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                                                                {ad.status === 'approved' ? 'Ativo' : 'Inativo'}
                                                            </span>
                                                            {ad.isHighlighted && <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Star size={10} fill="currentColor" /> Destaque</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="text-xs font-bold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                                                    Destacar (1 Crédito)
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'favorites' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Meus Favoritos</h3>
                                {loading ? (
                                    <p className="text-center text-slate-400">Carregando...</p>
                                ) : favorites.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                        <Heart size={48} className="mx-auto text-slate-300 mb-4" />
                                        <p className="text-slate-500">Você ainda não tem favoritos.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {favorites.map(fav => (
                                            <div key={fav.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm">
                                                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                                                    {fav.image ? <img src={fav.image} className="w-full h-full object-cover rounded-lg" /> : '❤️'}
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-indigo-600 uppercase">{fav.type === 'merchant' ? 'Comércio' : fav.type}</span>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{fav.name || fav.title}</h4>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Meus Dados</h3>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    <img src={currentUser.photoURL} alt={currentUser.displayName} className="w-16 h-16 rounded-full" />
                                    <div>
                                        <p className="font-bold text-lg text-slate-900 dark:text-white">{currentUser.displayName}</p>
                                        <p className="text-slate-500">{currentUser.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
