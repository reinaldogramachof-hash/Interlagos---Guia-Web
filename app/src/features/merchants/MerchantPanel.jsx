import React, { useState, useEffect } from 'react';
import { X, LayoutDashboard, Tag, Store, Settings, TrendingUp, BarChart3, Megaphone, User } from 'lucide-react';
import { getMerchantByOwner } from '../../services/merchantService';
import { fetchAdsByUser, deleteAd } from '../../services/adsService';
import { useAuth } from '../auth/AuthContext';
import CreateAdWizard from '../ads/CreateAdWizard';
import { useToast } from '../../components/Toast';
import UpgradeModal from './UpgradeModal';
import { PLANS_CONFIG } from '../../constants/plans';

import DashboardTab from './merchant-panel/tabs/DashboardTab';
import AdsTab from './merchant-panel/tabs/AdsTab';
import SettingsTab from './merchant-panel/tabs/SettingsTab';
import CampaignTab from './merchant-panel/tabs/CampaignTab';
import ReportsTab from './merchant-panel/tabs/ReportsTab';
import ResidentTabs from '../community/ResidentTabs';

export default function MerchantPanel({ onClose }) {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [myAds, setMyAds] = useState([]);
    const [merchant, setMerchant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateAd, setShowCreateAd] = useState(false);
    const [adToEdit, setAdToEdit] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const showToast = useToast();

    // Fetch Merchant Profile
    useEffect(() => {
        if (!currentUser) return;
        const loadMerchant = async () => {
            try {
                const data = await getMerchantByOwner(currentUser.uid);
                if (data) {
                    setMerchant(data);
                } else {
                    setMerchant({ id: 'temp_dev', name: currentUser.displayName, plan: 'basic', views: 0, clicks: 0 });
                }
            } catch (err) {
                console.error("Error fetching merchant:", err);
                showToast('Erro ao carregar dados do painel.', 'error');
            }
        };
        loadMerchant();
    }, [currentUser]);

    useEffect(() => {
        if (activeTab === 'ads' && currentUser) {
            fetchMyAds();
        }
    }, [activeTab, currentUser]);

    const fetchMyAds = async () => {
        setLoading(true);
        try {
            const data = await fetchAdsByUser(currentUser.uid);
            setMyAds(data);
        } catch (error) {
            console.error("Error fetching ads:", error);
            showToast('Erro ao carregar anúncios.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAd = async (adId) => {
        try {
            await deleteAd(adId);
            setMyAds(prev => prev.filter(ad => ad.id !== adId));
            showToast('Anúncio excluído.', 'success');
        } catch (error) {
            console.error("Error deleting ad:", error);
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
        fetchMyAds();
    };

    return (
        <div className="flex-1 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full min-h-[calc(100vh-160px)] flex flex-col overflow-hidden">

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
                        <button onClick={() => setShowUpgradeModal(true)} className="bg-amber-400 text-amber-900 px-4 py-2 rounded-full font-bold text-sm hover:bg-amber-300 transition-colors flex items-center gap-1 shadow-lg shadow-amber-400/20">
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
                        <button onClick={() => setActiveTab('dashboard')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-900 text-indigo-600 border-l-4 border-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <LayoutDashboard size={18} /> Visão Geral
                        </button>
                        <button onClick={() => setActiveTab('personal')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'personal' ? 'bg-white dark:bg-slate-900 text-indigo-600 border-l-4 border-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <User size={18} /> Pessoal
                        </button>
                        <button onClick={() => setActiveTab('ads')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'ads' ? 'bg-white dark:bg-slate-900 text-indigo-600 border-l-4 border-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <Tag size={18} /> Meus Anúncios
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'settings' ? 'bg-white dark:bg-slate-900 text-indigo-600 border-l-4 border-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <Settings size={18} /> Configurações
                        </button>
                        <button onClick={() => setActiveTab('reports')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'reports' ? 'bg-white dark:bg-slate-900 text-indigo-600 border-l-4 border-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <BarChart3 size={18} /> Relatórios
                        </button>
                        <button onClick={() => setActiveTab('campaigns')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${activeTab === 'campaigns' ? 'bg-white dark:bg-slate-900 text-indigo-600 border-l-4 border-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <Megaphone size={18} /> Campanhas
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto p-8">
                        {activeTab === 'dashboard' && (
                            <DashboardTab
                                merchant={merchant}
                                myAds={myAds}
                                onUpgrade={() => setShowUpgradeModal(true)}
                            />
                        )}

                        {activeTab === 'personal' && (
                            <ResidentTabs currentUser={currentUser} />
                        )}

                        {activeTab === 'ads' && (
                            <AdsTab
                                myAds={myAds}
                                loading={loading}
                                onCreateClick={handleCreateAdClick}
                                onDeleteClick={handleDeleteAd}
                                onEditClick={handleEditAd}
                            />
                        )}

                        {activeTab === 'settings' && (
                            <SettingsTab 
                                merchant={merchant} 
                                currentUser={currentUser} 
                                onUpdate={(updated) => setMerchant(updated)} 
                            />
                        )}

                        {activeTab === 'reports' && (
                            <ReportsTab merchant={merchant} onUpgrade={() => setShowUpgradeModal(true)} />
                        )}
                        {activeTab === 'campaigns' && (
                            <CampaignTab merchant={merchant} onUpgrade={() => setShowUpgradeModal(true)} />
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

            <CreateAdWizard
                isOpen={showCreateAd}
                onClose={handleWizardClose}
                user={currentUser}
                initialAd={adToEdit}
            />
        </div>
    );
}
