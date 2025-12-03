import React, { useState, useEffect } from 'react';
import { Megaphone, Tag, Briefcase, Home, Wrench, MessageCircle, PlusCircle, Search } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AdDetailModal from './AdDetailModal';
import CreateAdWizard from './CreateAdWizard';

export default function AdsView({ user }) {
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [selectedAd, setSelectedAd] = useState(null);
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    // Estados reais
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { id: 'Todos', label: 'Todos', icon: <Tag size={16} /> },
        { id: 'Vendas', label: 'Vendas & Desapegos', icon: <Tag size={16} /> },
        { id: 'Empregos', label: 'Vagas de Emprego', icon: <Briefcase size={16} /> },
        { id: 'Imóveis', label: 'Imóveis', icon: <Home size={16} /> },
        { id: 'Serviços', label: 'Serviços Autônomos', icon: <Wrench size={16} /> },
    ];

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
            console.error("Erro ao carregar anúncios (verifique permissões):", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredAds = activeCategory === 'Todos'
        ? ads
        : ads.filter(ad => ad.category === activeCategory);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 pb-20">
            {/* Header Promocional */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-b-3xl shadow-lg mb-6 -mt-4 mx-[-16px] lg:mx-0 lg:rounded-3xl lg:mt-0">
                <div className="flex items-center justify-between text-white mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">Classificados</h2>
                        <p className="text-violet-100 text-sm">O mercado livre do seu bairro.</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        <Megaphone size={24} className="text-yellow-300" />
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar desapegos, vagas..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-gray-800 border-none outline-none bg-white/95 shadow-inner focus:bg-white transition-all"
                    />
                </div>
            </div>

            {/* Categorias (Scroll Horizontal) */}
            <div className="flex gap-2 overflow-x-auto pb-4 px-4 -mx-4 scrollbar-hide mb-2">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border
                            ${activeCategory === cat.id
                                ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Lista de Anúncios */}
            {loading ? (
                <div className="text-center py-10 text-gray-400">Carregando classificados...</div>
            ) : filteredAds.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200 mx-4 lg:mx-0">
                    <div className="bg-violet-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Tag className="text-violet-400" size={32} />
                    </div>
                    <h3 className="text-gray-800 font-bold mb-1">Nenhum anúncio aqui</h3>
                    <p className="text-gray-500 text-sm mb-4">Seja o primeiro a anunciar nesta categoria!</p>
                    <button
                        onClick={() => setIsWizardOpen(true)}
                        className="text-violet-600 font-bold text-sm hover:underline"
                    >
                        Criar anúncio agora
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-0">
                    {filteredAds.map((ad) => (
                        <div
                            key={ad.id}
                            onClick={() => setSelectedAd(ad)}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-pointer"
                        >
                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                                {ad.image ? (
                                    <img
                                        src={ad.image}
                                        alt={ad.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-violet-50 text-violet-300">
                                        <Briefcase size={48} />
                                    </div>
                                )}
                                <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm uppercase tracking-wider">
                                    {ad.category}
                                </span>
                                <span className="absolute bottom-3 right-3 bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                                    {ad.createdAt?.toDate ? ad.createdAt.toDate().toLocaleDateString() : 'Recente'}
                                </span>
                            </div>

                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-1">{ad.title}</h3>
                                </div>
                                <p className="text-violet-600 font-bold text-lg mb-2">{ad.price}</p>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{ad.description}</p>

                                <button className="w-full bg-green-50 text-green-700 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition-colors">
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
                className="fixed bottom-24 right-4 bg-violet-600 text-white p-4 rounded-full shadow-lg shadow-violet-600/30 hover:bg-violet-700 hover:scale-105 transition-all z-50 flex items-center gap-2 font-bold pr-6"
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
