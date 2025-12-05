import React, { useState, useEffect } from 'react';
import { X, LayoutDashboard, Tag, Store, Settings, PlusCircle, Trash2, Edit, Lock, TrendingUp, Eye, MousePointer } from 'lucide-react';
import { collection, query, where, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../context/AuthContext';
import CreateAdWizard from '../CreateAdWizard';
import UpgradeModal from '../UpgradeModal';

export default function MerchantPanel({ onClose }) {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [myAds, setMyAds] = useState([]);
    const [merchant, setMerchant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateAd, setShowCreateAd] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Fetch Merchant Profile
    useEffect(() => {
        if (!currentUser) return;
        const q = query(collection(db, 'merchants'), where('uid', '==', currentUser.uid)); // Assuming 'uid' field exists or we query by ID if ID is UID
        // Fallback: if merchant ID is not UID, we might need another way. 
        // For now assuming we can find the merchant by some field or the user IS the merchant doc ID if we set it that way.
        // Let's assume we query by a field 'ownerId' or similar, OR we try to get doc by UID.
        // Based on previous code, 'loginAsDev' sets a mock user. 
        // Let's try to find a merchant where `email` matches or `uid` matches.

        // BETTER: The AuthContext should probably give us the merchantId. 
        // But for now, let's query.
        const fetchMerchant = async () => {
            try {
                // Try to find merchant by ownerId (uid)
                // If not found, maybe create one? No, admin creates it.
                // Let's assume for dev mode we might not have one, so we handle null.

                // REAL IMPLEMENTATION:
                const q = query(collection(db, 'merchants'), where('email', '==', currentUser.email));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setMerchant({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
                } else {
                    // Fallback for dev/testing if no merchant record exists
                    setMerchant({
                        id: 'temp_dev',
                        name: currentUser.displayName,
                        plan: 'basic',
                        views: 0,
                        clicks: 0
                    });
                }
            } catch (err) {
                console.error("Error fetching merchant:", err);
            }
        };
        fetchMerchant();
    }, [currentUser]);

    useEffect(() => {
        if (activeTab === 'ads') {
            fetchMyAds();
        }
    }, [activeTab]);

    const fetchMyAds = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'ads'), where('authorId', '==', currentUser.uid));
            const snapshot = await getDocs(q);
            const adsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMyAds(adsData);
        } catch (error) {
            console.error("Error fetching ads:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAd = async (adId) => {
        if (window.confirm('Tem certeza que deseja excluir este anúncio?')) {
            try {
                await deleteDoc(doc(db, 'ads', adId));
                setMyAds(prev => prev.filter(ad => ad.id !== adId));
            } catch (error) {
                console.error("Error deleting ad:", error);
            }
        }
    };

    const getPlanLimit = (plan) => {
        switch (plan) {
            case 'basic': return 1;
            case 'pro': return 5;
            case 'premium': return 999;
            default: return 1;
        }
    };

    const handleCreateAdClick = () => {
        const limit = getPlanLimit(merchant?.plan);
        if (myAds.length >= limit) {
            setShowUpgradeModal(true);
        } else {
            setShowCreateAd(true);
        }
    };

    if (showCreateAd) {
        return <CreateAdWizard onBack={() => setShowCreateAd(false)} user={currentUser} />;
    }

    return (
        <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">

                {/* Header */}
                <div className="bg-indigo-600 p-6 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Store className="text-indigo-200" /> Painel do Comerciante
                        </h2>
                        <p className="text-indigo-100 text-sm">
                            Plano Atual: <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md uppercase text-xs ml-1">{merchant?.plan || 'Básico'}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowUpgradeModal(true)} className="bg-amber-400 text-amber-900 px-4 py-2 rounded-full font-bold text-sm hover:bg-amber-300 transition-colors flex items-center gap-1">
                            <TrendingUp size={16} /> Fazer Upgrade
                        </button>
                        <button onClick={onClose} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                        <button onClick={() => setActiveTab('dashboard')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-900 text-indigo-600 border-l-4 border-indigo-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <LayoutDashboard size={18} /> Visão Geral
                        </button>
                        <button onClick={() => setActiveTab('ads')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 ${activeTab === 'ads' ? 'bg-white dark:bg-slate-900 text-indigo-600 border-l-4 border-indigo-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <Tag size={18} /> Meus Anúncios
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 ${activeTab === 'settings' ? 'bg-white dark:bg-slate-900 text-indigo-600 border-l-4 border-indigo-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <Settings size={18} /> Configurações
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto p-6">

                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Eye size={20} /></div>
                                            <h3 className="text-indigo-900 dark:text-indigo-100 font-bold">Visualizações</h3>
                                        </div>
                                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{merchant?.views || 0}</p>
                                    </div>
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Tag size={20} /></div>
                                            <h3 className="text-emerald-900 dark:text-emerald-100 font-bold">Anúncios Ativos</h3>
                                        </div>
                                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{myAds.length} / {getPlanLimit(merchant?.plan)}</p>
                                    </div>
                                    <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-100 dark:border-amber-500/20">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><MousePointer size={20} /></div>
                                            <h3 className="text-amber-900 dark:text-amber-100 font-bold">Cliques no Zap</h3>
                                        </div>
                                        {merchant?.plan === 'basic' ? (
                                            <div className="flex flex-col items-start">
                                                <div className="flex items-center gap-2 text-slate-400 font-bold text-lg">
                                                    <Lock size={16} /> Bloqueado
                                                </div>
                                                <button onClick={() => setShowUpgradeModal(true)} className="text-xs text-indigo-600 font-bold hover:underline">Fazer Upgrade</button>
                                            </div>
                                        ) : (
                                            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{merchant?.clicks || 0}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Advanced Stats (Locked for Basic) */}
                                <div className="border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
                                    <h3 className="font-bold text-lg mb-4">Desempenho Mensal</h3>
                                    {merchant?.plan === 'basic' && (
                                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                            <Lock className="text-slate-400 mb-2" size={32} />
                                            <h4 className="font-bold text-slate-800">Recurso Premium</h4>
                                            <p className="text-slate-500 text-sm mb-4">Veja gráficos detalhados de acesso.</p>
                                            <button onClick={() => setShowUpgradeModal(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700">
                                                Liberar Estatísticas
                                            </button>
                                        </div>
                                    )}
                                    <div className="h-48 bg-slate-50 rounded-xl flex items-end justify-around p-4 items-end gap-2">
                                        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                            <div key={i} className="w-full bg-indigo-200 rounded-t-lg" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'ads' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Gerenciar Anúncios</h3>
                                    <button
                                        onClick={handleCreateAdClick}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                                    >
                                        <PlusCircle size={18} /> Novo Anúncio
                                    </button>
                                </div>

                                {loading ? (
                                    <p className="text-center text-slate-400">Carregando...</p>
                                ) : myAds.length === 0 ? (
                                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                        <p className="text-slate-500">Você ainda não tem anúncios.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {myAds.map(ad => (
                                            <div key={ad.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden">
                                                        {ad.image && <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white">{ad.title}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ad.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                                                ad.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'
                                                                }`}>
                                                                {ad.status === 'approved' ? 'Ativo' : ad.status === 'pending' ? 'Em Análise' : 'Inativo'}
                                                            </span>
                                                            <span className="text-xs text-slate-500">{ad.price}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAd(ad.id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="text-center py-20">
                                <Settings size={48} className="mx-auto text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Configurações da Loja</h3>
                                <p className="text-slate-500">Em breve você poderá editar horário de funcionamento, logo e contatos.</p>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                currentPlan={merchant?.plan || 'basic'}
                merchantId={merchant?.id}
                onUpgrade={(newPlan) => setMerchant(prev => ({ ...prev, plan: newPlan }))}
            />
        </div>
    );
}
