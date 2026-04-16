import React, { useState, useEffect } from 'react';
import { X, TrendingUp, User, Store } from 'lucide-react';
import { getMerchantByOwner } from '../../services/merchantService';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../../components/Toast';
import UpgradeModal from '../merchants/UpgradeModal';
import { PLANS_CONFIG } from '../../constants/plans';
import { hasAcceptedCurrentTerms } from '../../services/consentService';
import TermsTab from '../terms/TermsTab';

import ResidentTabs from '../community/ResidentTabs';
import PanelSidebar from './PanelSidebar';
import MerchantTabs from '../merchants/MerchantTabs';
import MerchantSettingsTab from '../merchants/merchant-panel/tabs/SettingsTab';

export default function UnifiedPanel({ onClose }) {
    const { currentUser, isMerchant } = useAuth();
    const uiMode = isMerchant ? 'merchant' : 'resident';
    const [activeTab, setActiveTab] = useState(uiMode === 'merchant' ? 'business' : 'personal');
    
    const [merchant, setMerchant] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    
    const showToast = useToast();

    // Auto-redirect para termos se não aceitos
    useEffect(() => {
        if (!currentUser?.id) return;
        hasAcceptedCurrentTerms(currentUser.id).then(accepted => {
            if (!accepted) setActiveTab('terms');
        }).catch(() => {});
    }, [currentUser?.id]);

    useEffect(() => {
        if (!currentUser || uiMode !== 'merchant') return;
        getMerchantByOwner(currentUser.id || currentUser.uid)
            .then(data => setMerchant(data || { id: 'temp_dev', name: currentUser.displayName, plan: 'basic', views: 0, clicks: 0 }))
            .catch(() => showToast('Erro ao carregar dados comerciais.', 'error'));
    }, [currentUser?.id, uiMode]);

    const theme = uiMode === 'merchant' 
        ? { bg: 'bg-indigo-600', icon: 'text-indigo-200', text: 'text-indigo-100', title: 'Painel do Comerciante' }
        : { bg: 'bg-emerald-600', icon: 'text-emerald-200', text: 'text-emerald-100', title: 'Meu Painel' };

    return (
        <div className="flex-1 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full min-h-[calc(100vh-160px)] flex flex-col overflow-hidden">
                <div className={`${theme.bg} p-6 flex justify-between items-center shrink-0`}>
                    <div className="flex items-center gap-3">
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

                {/* Segmented control mobile — substitui o drawer hamburguer */}
                <div className="md:hidden flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 border-b border-slate-200 dark:border-slate-700">
                    {uiMode === 'merchant' && (
                        <button
                            onClick={() => setActiveTab('business')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                                activeTab === 'business'
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm'
                                    : 'text-slate-500'
                            }`}
                        >
                            <Store size={13} /> Meu Negócio
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                            activeTab === 'personal'
                                ? `bg-white dark:bg-slate-700 ${uiMode === 'merchant' ? 'text-indigo-600' : 'text-emerald-600'} shadow-sm`
                                : 'text-slate-500'
                        }`}
                    >
                        <User size={13} /> Pessoal
                    </button>
                    {uiMode === 'resident' && (
                        <button
                            onClick={() => setActiveTab('merchant-setup')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-colors ${
                                activeTab === 'merchant-setup'
                                    ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm'
                                    : 'text-indigo-500'
                            }`}
                        >
                            <Store size={13} /> Cadastrar Loja
                        </button>
                    )}

                </div>

                <div className="flex flex-1 overflow-hidden">
                    <PanelSidebar 
                        uiMode={uiMode} 
                        activeTab={activeTab} 
                        onTabChange={setActiveTab} 
                    />

                    <div className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto p-4 md:p-8">
                        {activeTab === 'business' && uiMode === 'merchant' && (
                            <MerchantTabs
                                merchant={merchant}
                                currentUser={currentUser}
                                onUpgrade={() => setShowUpgradeModal(true)}
                                onMerchantUpdate={setMerchant}
                            />
                        )}
                        {activeTab === 'personal' && <ResidentTabs currentUser={currentUser} />}
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
                        {activeTab === 'terms' && (
                            <TermsTab onAccepted={() => setActiveTab(uiMode === 'merchant' ? 'business' : 'personal')} />
                        )}
                    </div>
                </div>
            </div>

            {uiMode === 'merchant' && (
                <>
                    <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} currentPlan={merchant?.plan || 'basic'} merchantId={merchant?.id} onUpgrade={(newPlan) => setMerchant(prev => ({ ...prev, plan: newPlan }))} />
                </>
            )}
        </div>
    );
}
