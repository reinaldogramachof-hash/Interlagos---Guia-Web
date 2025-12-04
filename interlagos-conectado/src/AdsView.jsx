import React, { useState, useEffect } from 'react';
import { Tag, MapPin, Clock, Filter, Search, PlusCircle, MessageCircle, Briefcase } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AdDetailModal from './AdDetailModal';
import CreateAdWizard from './CreateAdWizard';

const categories = ['Todos', 'Vendas', 'Empregos', 'Imóveis', 'Serviços', 'Veículos', 'Eletrônicos', 'Doações'];

export default function AdsView({ user }) {
    const [selectedAd, setSelectedAd] = useState(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    // Carregar Anúncios do Firestore
    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'ads'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedAds = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAds(fetchedAds);
            setLoading(false);
        }, (error) => {
            console.error("Erro ao carregar anúncios:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredAds = selectedCategory === 'Todos'
        ? ads
        : ads.filter(ad => ad.category === selectedCategory);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">

            {/* Category Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-4 -mb-2 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${selectedCategory === cat
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                    >
                        <Filter size={16} />
                        {cat}
                    </button>
                ))}
            </div>

            {/* Lista de Anúncios */}
            {loading ? (
                <div className="text-center py-10 text-slate-400">Carregando classificados...</div>
            ) : filteredAds.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-white/5 mx-4 lg:mx-0">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Tag className="text-indigo-400" size={32} />
                    </div>
                    <h3 className="text-slate-800 dark:text-white font-bold mb-1">Nenhum anúncio aqui</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Seja o primeiro a anunciar nesta categoria!</p>
                    <button
                        onClick={() => setIsWizardOpen(true)}
                        className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
                    >
                        Criar anúncio agora
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-0 mt-6">
                    {filteredAds.map((ad) => (
                        <div
                            key={ad.id}
                            onClick={() => setSelectedAd(ad)}
                            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-white/5 hover:shadow-md transition-all group cursor-pointer"
                        >
                            <div className="relative h-48 bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                {ad.image ? (
                                    <img
                                        src={ad.image}
                                        alt={ad.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600">
                                        <Briefcase size={48} />
                                    </div>
                                )}
                                <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm uppercase tracking-wider">
                                    {ad.category}
                                </span>
                                <span className="absolute bottom-3 right-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                                    {ad.createdAt?.toDate ? ad.createdAt.toDate().toLocaleDateString() : 'Recente'}
                                </span>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight line-clamp-1">{ad.title}</h3>
                                </div>
                                <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-2">{ad.price}</p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 h-10">{ad.description}</p>

                                <button className="w-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                                    <MessageCircle size={18} />
                                    Chamar no Zap
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Floating Action Button (FAB) - Anunciar */}
            <button
                onClick={() => setIsWizardOpen(true)}
                className="fixed bottom-24 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-105 transition-all z-50 flex items-center gap-2 font-bold pr-6"
            >
                <PlusCircle size={24} />
                Anunciar Grátis
            </button>

            {/* Modais */}
            <AdDetailModal
                isOpen={!!selectedAd}
                onClose={() => setSelectedAd(null)}
                ad={selectedAd}
            />

            <CreateAdWizard
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
                user={user}
            />
        </div>
    );
}
