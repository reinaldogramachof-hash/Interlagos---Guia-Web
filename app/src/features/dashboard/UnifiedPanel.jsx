import React, { useState, useEffect } from 'react';
import { X, TrendingUp, User, Store, Menu } from 'lucide-react';
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
import PollsTab from '../community/resident-panel/tabs/PollsTab';
import SuggestionsTab from '../community/resident-panel/tabs/SuggestionsTab';
import PanelSidebar from './PanelSidebar';

export default function UnifiedPanel({ onClose }) {
    const { currentUser, isMerchant } = useAuth();
    const uiMode = isMerchant ? 'merchant' : 'resident';
    const [activeTab, setActiveTab] = useState(uiMode === 'merchant' ? 'dashboard' : 'personal');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const [merchant, setMerchant] = useState(null);
    const [myAds, setMyAds] = useState([]);
    const [loadingAds, setLoadingAds] = useState(false);
    const [showCreateAd, setShowCreateAd] = useState(false);
    const [adToEdit, setAdToEdit] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [loadingFavs, setLoadingFavs] = useState(false);
    
    const showToast = useToast();

    useEffect(() => {
        if (!currentUser || uiMode !== 'merchant') return;
        getMerchantByOwner(currentUser.id || currentUser.uid)
            .then(data => setMerchant(data || { id: 'temp_dev', name: currentUser.displayName, plan: 'basic', views: 0, clicks: 0 }))
            .catch(() => showToast('Erro ao carregar dados comerciais.', 'error'));
    }, [currentUser, uiMode]);

    useEffect(() => {
        if (!currentUser) return;
        if (activeTab === 'ads' && uiMode === 'merchant') fetchMyAds();
        if (activeTab === 'favorites') fetchMyFavorites();
    }, [activeTab, currentUser, uiMode]);

    const fetchMyAds = async () => {
        setLoadingAds(true);
        try {
            const data = await fetchAdsByUser(currentUser.id || currentUser.uid);
            setMyAds(data);
        } catch (error) { console.error("Error fetching ads:", error); }
        finally { setLoadingAds(false); }
    };

    const fetchMyFavorites = async () => {
        setLoadingFavs(true);
        try {
            const data = await getFavorites(currentUser.id || currentUser.uid);
            setFavorites(data);
        } catch (error) { console.error("Error loading favs:", error); }
        finally { setLoadingFavs(false); }
    };

    const handleDeleteAd = async (adId) => {
        try {
            await deleteAd(adId);
            setMyAds(prev => prev.filter(ad => ad.id !== adId));
            showToast('Anúncio excluído.', 'success');
        } catch (error) { showToast('Erro ao excluir anúncio.', 'error'); }
    };

    const handleCreateAdClick = () => {
        const planConfig = PLANS_CONFIG[merchant?.plan] ?? PLANS_CONFIG['free'];
        if (myAds.length >= planConfig.adLimit) setShowUpgradeModal(true);
        else { setAdToEdit(null); setShowCreateAd(true); }
    };

    const handleWizardClose = () => {
        setShowCreateAd(false);
        setAdToEdit(null);
        if (uiMode === 'merchant') fetchMyAds();
    };

    const theme = uiMode === 'merchant' 
        ? { bg: 'bg-indigo-600', icon: 'text-indigo-200', text: 'text-indigo-100', title: 'Painel do Comerciante' }
        : { bg: 'bg-emerald-600', icon: 'text-emerald-200', text: 'text-emerald-100', title: 'Meu Painel' };

    return (
        <div className="flex-1 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full min-h-[calc(100vh-160px)] flex flex-col overflow-hidden">
                <div className={`${theme.bg} p-6 flex justify-between items-center shrink-0`}>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-white p-2 bg-white/10 rounded-lg hover:bg-white/20">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                                {uiMode === 'merchant' ? <Store className={theme.icon} /> : <User className={theme.icon} />} 
                                {theme.title}
                            </h2>
                            <p className={`${theme.text} text-xs md:text-sm`}>
                                {uiMode === 'merchant' ? `Plano: ${merchant?.plan || 'Básico'}` : 'Vislumbre seus conteúdos e interações'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {uiMode === 'merchant' && (
                            <button onClick={() => setShowUpgradeModal(true)} className="bg-amber-400 text-amber-900 px-3 md:px-4 py-2 rounded-full font-bold text-xs md:text-sm hover:bg-amber-300 transition-colors flex items-center gap-1 shadow-lg shadow-amber-400/20">
                                <TrendingUp size={16} /> <span className="hidden sm:inline">Fazer Upgrade</span>
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
                    <PanelSidebar 
                        uiMode={uiMode} 
                        activeTab={activeTab} 
                        onTabChange={setActiveTab} 
                        isOpen={sidebarOpen} 
                        onClose={() => setSidebarOpen(false)} 
                    />

                    <div className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto p-4 md:p-8">
                        {activeTab === 'dashboard' && uiMode === 'merchant' && <DashboardTab merchant={merchant} myAds={myAds} onUpgrade={() => setShowUpgradeModal(true)} />}
                        {activeTab === 'personal' && <ResidentTabs currentUser={currentUser} />}
                        {activeTab === 'favorites' && <FavoritesTab loading={loadingFavs} favorites={favorites} />}
                        {activeTab === 'polls' && uiMode === 'resident' && <PollsTab currentUser={currentUser} />}
                        {activeTab === 'suggestions' && uiMode === 'resident' && <SuggestionsTab currentUser={currentUser} />}
                        {activeTab === 'settings' && (uiMode === 'merchant' ? <MerchantSettingsTab merchant={merchant} currentUser={currentUser} onUpdate={setMerchant} /> : <ResidentSettingsTab currentUser={currentUser} />)}
                        {activeTab === 'merchant-setup' && uiMode === 'resident' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 rounded-2xl mb-8 text-white shadow-xl shadow-indigo-600/20">
                                    <h3 className="text-2xl font-bold flex items-center gap-2 mb-2"><Store size={24} className="text-indigo-200" />Evolua para Comerciante</h3>
                                    <p className="text-indigo-100 text-sm opacity-90 max-w-xl">Preencha os dados abaixo para destravar o modo Empresarial gratuitamente.</p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                                    <MerchantSettingsTab merchant={{id: 'temp_dev'}} currentUser={currentUser} onUpdate={setMerchant} />
                                </div>
                            </div>
                        )}
                        {activeTab === 'ads' && uiMode === 'merchant' && <AdsTab myAds={myAds} loading={loadingAds} onCreateClick={handleCreateAdClick} onDeleteClick={handleDeleteAd} onEditClick={(ad) => { setAdToEdit(ad); setShowCreateAd(true); }} />}
                        {activeTab === 'reports' && uiMode === 'merchant' && <ReportsTab merchant={merchant} onUpgrade={() => setShowUpgradeModal(true)} />}
                        {activeTab === 'campaigns' && uiMode === 'merchant' && <CampaignTab merchant={merchant} onUpgrade={() => setShowUpgradeModal(true)} />}
                    </div>
                </div>
            </div>

            {uiMode === 'merchant' && (
                <>
                    <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} currentPlan={merchant?.plan || 'basic'} merchantId={merchant?.id} onUpgrade={(newPlan) => setMerchant(prev => ({ ...prev, plan: newPlan }))} />
                    <CreateAdWizard isOpen={showCreateAd} onClose={handleWizardClose} user={currentUser} initialAd={adToEdit} />
                </>
            )}
        </div>
    );
}
