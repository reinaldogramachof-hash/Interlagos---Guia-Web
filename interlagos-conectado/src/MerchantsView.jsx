import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import MerchantDetailModal from './MerchantDetailModal';
import { categories } from './constants/categories';
import { mockData } from './mockData';

export default function MerchantsView({ searchTerm, selectedCategory, setSelectedCategory }) {
    const [merchants, setMerchants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMerchant, setSelectedMerchant] = useState(null);

    // Carregar comerciantes do Firestore em tempo real
    useEffect(() => {
        if (!db) {
            console.warn("Firestore (db) não inicializado. Pulando carregamento de comerciantes.");
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'merchants'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const merchantsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMerchants(merchantsData);
            setLoading(false);
        }, (error) => {
            console.error("Erro ao buscar comerciantes:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredMerchants = (merchants.length > 0 ? merchants : mockData).filter(merchant => {
        const matchesCategory = selectedCategory === 'Todos' || merchant.category === selectedCategory;
        const matchesSearch = merchant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            merchant.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleMerchantClick = (merchant) => {
        setSelectedMerchant(merchant);
    };

    return (
        <>
            {/* Categories Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${selectedCategory === cat.id
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'bg-slate-800/50 text-slate-400 border border-white/5 hover:bg-slate-800'
                            }`}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Featured Merchants (Premium) */}
            {selectedCategory === 'Todos' && !searchTerm && (
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                            Destaques da Região
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {merchants.filter(m => m.isPremium).slice(0, 3).map(merchant => (
                            <div key={merchant.id} onClick={() => handleMerchantClick(merchant)} className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 cursor-pointer hover:bg-slate-800 transition-all">
                                <div className="h-40 bg-slate-700 rounded-xl mb-4 overflow-hidden">
                                    <img src={merchant.image || `https://source.unsplash.com/random/800x600/?store,${merchant.category}`} alt={merchant.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-lg">{merchant.name}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2">{merchant.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* All Merchants Grid */}
            <section>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                    {searchTerm ? `Resultados para "${searchTerm}"` : `${selectedCategory}`}
                </h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMerchants.map(merchant => (
                            <div
                                key={merchant.id}
                                onClick={() => handleMerchantClick(merchant)}
                                className="group bg-slate-800/40 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
                            >
                                <div className="aspect-video bg-slate-700/50 rounded-xl mb-4 overflow-hidden relative">
                                    <img
                                        src={merchant.image || `https://source.unsplash.com/random/400x300/?${merchant.category}`}
                                        alt={merchant.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-medium text-white border border-white/10">
                                        {merchant.category}
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-slate-100 mb-1 group-hover:text-indigo-400 transition-colors">{merchant.name}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-3">{merchant.description}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Aberto agora
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredMerchants.length === 0 && (
                    <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-white/5 border-dashed">
                        <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-slate-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Nenhum resultado encontrado</h3>
                        <p className="text-slate-400 max-w-md mx-auto">
                            Não encontramos nada para "{searchTerm}" na categoria {selectedCategory}.
                            Tente buscar por outro termo.
                        </p>
                    </div>
                )}
            </section>

            {/* Modals */}
            {selectedMerchant && (
                <MerchantDetailModal
                    merchant={selectedMerchant}
                    onClose={() => setSelectedMerchant(null)}
                />
            )}
        </>
    );
}
