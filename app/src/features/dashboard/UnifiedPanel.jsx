import React, { useState, useEffect } from 'react';
import { X, LayoutDashboard, Tag, Store, Settings, TrendingUp, BarChart3, Megaphone, User, Heart, Briefcase } from 'lucide-react';
import { getMerchantByOwner } from '../../services/merchantService';
import { fetchAdsByUser, deleteAd } from '../../services/adsService';
import { getFavorites } from '../../services/favoritesService';
import { useAuth } from '../auth/AuthContext';
import CreateAdWizard from '../ads/CreateAdWizard';
import { useToast } from '../../components/Toast';
import UpgradeModal from '../merchants/UpgradeModal';
import { PLANS_CONFIG } from '../../constants/plans';

import DashboardTab from '../merchants/merchant-panel/tabs/DashboardTab';
import AdsTab from '../merchants/merchant-panel/tabs/AdsTab';
import MerchantSettingsTab from '../merchants/merchant-panel/tabs/SettingsTab';
import CampaignTab from '../merchants/merchant-panel/tabs/CampaignTab';
import ReportsTab from '../merchants/merchant-panel/tabs/ReportsTab';

import ResidentTabs from '../community/ResidentTabs';
import FavoritesTab from '../community/resident-panel/tabs/FavoritesTab';
import ResidentSettingsTab from '../community/resident-panel/tabs/SettingsTab';

export default function UnifiedPanel({ onClose }) {
    const { currentUser, isMerchant, isMaster, isAdmin } = useAuth();
    // Determinando o papel base para a UI ("merchant" ou "resident")
    // Se for admin/master, mostramos a interface de resident a não ser que tenham um perfil ativo de merchant.
    // Mas primariamente a refatoração focou em isMerchant vs !isMerchant.
    const isCommercial = isMerchant || isAdmin || isMaster; 
    // Vamos checar estritamente se o layout deve ser comercial ou residencial.
    // Comerciantes logados veem o painel roxo. Moradores o painel verde.
    const uiMode = isMerchant ? 'merchant' : 'resident';

    const [activeTab, setActiveTab] = useState(uiMode === 'merchant' ? 'dashboard' : 'personal');
    
    // Merchant States
    const [merchant, setMerchant] = useState(null);
    const [myAds, setMyAds] = useState([]);
    const [loadingAds, setLoadingAds] = useState(false);
    const [showCreateAd, setShowCreateAd] = useState(false);
    const [adToEdit, setAdToEdit] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    
    // Resident States
    const [favorites, setFavorites] = useState([]);
    const [loadingFavs, setLoadingFavs] = useState(false);
    
    const showToast = useToast();

    // Data Loaders
    useEffect(() => {
        if (!currentUser) return;
        if (uiMode === 'merchant') {
            const loadMerchant = async () => {
                try {
                    const data = await getMerchantByOwner(currentUser.id || currentUser.uid);
                    if (data) {
                        setMerchant(data);
                    } else {
                        // Mock de fallback para quando não tiver aprovado ainda
                        setMerchant({ id: 'temp_dev', name: currentUser.displayName, plan: 'basic', views: 0, clicks: 0 });
                    }
                } catch (err) {
                    console.error("Error fetching merchant:", err);
                    showToast('Erro ao carregar dados comerciais.', 'error');
                }
            };
            loadMerchant();
        }
    }, [currentUser, uiMode]);

    useEffect(() => {
        if (!currentUser) return;
        if (activeTab === 'ads' && uiMode === 'merchant') {
            fetchMyAds();
        }
        if (activeTab === 'favorites') {
            fetchMyFavorites();
        }
    }, [activeTab, currentUser, uiMode]);

    const fetchMyAds = async () => {
        setLoadingAds(true);
        try {
            const data = await fetchAdsByUser(currentUser.id || currentUser.uid);
            setMyAds(data);
        } catch (error) {
            console.error("Error fetching ads:", error);
        } finally {
            setLoadingAds(false);
        }
    };

    const fetchMyFavorites = async () => {
        setLoadingFavs(true);
        try {
            const data = await getFavorites(currentUser.id || currentUser.uid);
            setFavorites(data);
        } catch (error) {
            console.error("Error loading favs:", error);
        } finally {
            setLoadingFavs(false);
        }
    };

    // Actions
    const handleDeleteAd = async (adId) => {
        try {
            await deleteAd(adId);
            setMyAds(prev => prev.filter(ad => ad.id !== adId));
            showToast('Anúncio excluído.', 'success');
        } catch (error) {
            showToast('Erro ao excluir anúncio.', 'error');
        }
    };

    const handleCreateAdClick = () => {
        const planConfig = PLANS_CONFIG[merchant?.plan] ?? PLANS_CONFIG['free'];
        if (myAds.length >= planConfig.adLimit) {
            setShowUpgradeModal(true);
        } else {
            setAdToEdit(null);
            setShowCreateAd(true);
        }
    };

    const handleEditAd = (ad) => {
        setAdToEdit(ad);
        setShowCreateAd(true);
    };

    const handleWizardClose = () => {
        setShowCreateAd(false);
        setAdToEdit(null);
        if (uiMode === 'merchant') fetchMyAds();
    };

    // UI Condicionais
    const headerBgClass = uiMode === 'merchant' ? 'bg-indigo-600' : 'bg-emerald-600';
    const headerIconClass = uiMode === 'merchant' ? 'text-indigo-200' : 'text-emerald-200';
    const headerTextClass = uiMode === 'merchant' ? 'text-indigo-100' : 'text-emerald-100';
    const activeSidebarBg = uiMode === 'merchant' ? 'text-indigo-600 border-indigo-600' : 'text-emerald-600 border-emerald-600';
    const titleText = uiMode === 'merchant' ? 'Painel do Comerciante' : 'Meu Painel';

    return (
        <div className="flex-1 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full min-h-[calc(100vh-160px)] flex flex-col overflow-hidden">
                {/* Header Adaptativo */}
                <div className={`${headerBgClass} p-6 flex justify-between items-center shrink-0`}>
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            {uiMode === 'merchant' ? <Store className={headerIconClass} /> : <User className={headerIconClass} />} 
                            {titleText}
                        </h2>
                        {uiMode === 'merchant' ? (
                            <p className={`${headerTextClass} text-sm`}>
                                Plano Atual: <span className="font-bold bg-white/20 px-2 py-0.5 rounded-md uppercase text-xs ml-1">{merchant?.plan || 'Básico'}</span>
                            </p>
                        ) : (
                            <p className={`${headerTextClass} text-sm`}>
                                Vislumbre seus conteúdos e interações
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {uiMode === 'merchant' && (
                            <button onClick={() => setShowUpgradeModal(true)} className="bg-amber-400 text-amber-900 px-4 py-2 rounded-full font-bold text-sm hover:bg-amber-300 transition-colors flex items-center gap-1 shadow-lg shadow-amber-400/20">
                                <TrendingUp size={16} /> Fazer Upgrade
                            </button>
                        )}
                        {onClose && (
                            <button onClick={onClose} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors">
                                <X size={24} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Adaptativa */}
                    <div className="w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col overflow-y-auto">
                        
                        {uiMode === 'merchant' && (
                            <button onClick={() => setActiveTab('dashboard')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'dashboard' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                                <LayoutDashboard size={18} /> Visão Geral
                            </button>
                        )}

                        <button onClick={() => setActiveTab('personal')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'personal' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            {uiMode === 'merchant' ? <User size={18} /> : <Briefcase size={18} />} 
                            {uiMode === 'merchant' ? 'Aba Pessoal' : 'Meu Conteúdo'}
                        </button>

                        <button onClick={() => setActiveTab('favorites')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'favorites' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <Heart size={18} /> Favoritos
                        </button>

                        <button onClick={() => setActiveTab('settings')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'settings' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <Settings size={18} /> Configurações
                        </button>

                        {/* Aba exclusiva de Upgrade para Morador (Evolution Flow) */}
                        {uiMode === 'resident' && (
                            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800">
                                <button onClick={() => setActiveTab('merchant-setup')} className={`w-full p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'merchant-setup' ? `bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 border-l-4 border-indigo-600` : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'}`}>
                                    <Store size={18} /> Cadastre sua Loja (Grátis)
                                </button>
                            </div>
                        )}

                        {/* Abas exclusivas para comerciantes */}
                        {uiMode === 'merchant' && (
                            <>
                                <button onClick={() => setActiveTab('ads')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'ads' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                                    <Tag size={18} /> Meus Anúncios PRO
                                </button>
                                <button onClick={() => setActiveTab('reports')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'reports' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                                    <BarChart3 size={18} /> Relatórios PRO
                                </button>
                                <button onClick={() => setActiveTab('campaigns')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'campaigns' ? `bg-white dark:bg-slate-900 border-l-4 shadow-sm ${activeSidebarBg}` : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                                    <Megaphone size={18} /> Campanhas PRO
                                </button>
                            </>
                        )}
                    </div>

                    {/* Content Area Adaptativa */}
                    <div className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto p-8">
                        {activeTab === 'dashboard' && uiMode === 'merchant' && (
                            <DashboardTab merchant={merchant} myAds={myAds} onUpgrade={() => setShowUpgradeModal(true)} />
                        )}

                        {activeTab === 'personal' && (
                            <ResidentTabs currentUser={currentUser} />
                        )}
                        
                        {activeTab === 'favorites' && (
                            <FavoritesTab loading={loadingFavs} favorites={favorites} />
                        )}

                        {activeTab === 'settings' && (
                            uiMode === 'merchant' 
                                ? <MerchantSettingsTab merchant={merchant} currentUser={currentUser} onUpdate={(u) => setMerchant(u)} />
                                : <ResidentSettingsTab currentUser={currentUser} />
                        )}

                        {activeTab === 'merchant-setup' && uiMode === 'resident' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 rounded-2xl mb-8 text-white shadow-xl shadow-indigo-600/20">
                                    <h3 className="text-2xl font-bold flex items-center gap-2 mb-2">
                                        <Store size={24} className="text-indigo-200" />
                                        Evolua para Comerciante
                                    </h3>
                                    <p className="text-indigo-100 text-sm opacity-90 max-w-xl">Preencha os dados do seu negócio abaixo. Após o envio, você destravará o modo Empresarial da plataforma gratuitamente, ganhando relatórios, campanhas e gerenciador de anúncios!</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                                    <MerchantSettingsTab merchant={{id: 'temp_dev'}} currentUser={currentUser} onUpdate={(u) => setMerchant(u)} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'ads' && uiMode === 'merchant' && (
                            <AdsTab myAds={myAds} loading={loadingAds} onCreateClick={handleCreateAdClick} onDeleteClick={handleDeleteAd} onEditClick={handleEditAd} />
                        )}

                        {activeTab === 'reports' && uiMode === 'merchant' && (
                            <ReportsTab merchant={merchant} onUpgrade={() => setShowUpgradeModal(true)} />
                        )}

                        {activeTab === 'campaigns' && uiMode === 'merchant' && (
                            <CampaignTab merchant={merchant} onUpgrade={() => setShowUpgradeModal(true)} />
                        )}
                    </div>
                </div>
            </div>

            {/* Modals apenas para comerciante */}
            {uiMode === 'merchant' && (
                <>
                    <UpgradeModal
                        isOpen={showUpgradeModal}
                        onClose={() => setShowUpgradeModal(false)}
                        currentPlan={merchant?.plan || 'basic'}
                        merchantId={merchant?.id}
                        onUpgrade={(newPlan) => setMerchant(prev => ({ ...prev, plan: newPlan }))}
                    />

                    <CreateAdWizard
                        isOpen={showCreateAd}
                        onClose={handleWizardClose}
                        user={currentUser}
                        initialAd={adToEdit}
                    />
                </>
            )}
        </div>
    );
}
