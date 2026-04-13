import React, { useState } from 'react';
import { LayoutDashboard, Tag, Megaphone, BarChart3, Settings, Lock, Star, ShieldCheck, LifeBuoy, MessageSquare } from 'lucide-react';
import { PLANS_CONFIG, hasPlanAccess } from '../../constants/plans';
import DashboardTab from './merchant-panel/tabs/DashboardTab';
import AdsTab from './merchant-panel/tabs/AdsTab';
import CampaignTab from './merchant-panel/tabs/CampaignTab';
import ReportsTab from './merchant-panel/tabs/ReportsTab';
import MerchantSettingsTab from './merchant-panel/tabs/SettingsTab';
import TermsTab from '../terms/TermsTab';

const TABS = [
  { id: 'dashboard', label: 'Visão Geral',  icon: LayoutDashboard, minPlan: 'free' },
  { id: 'ads',       label: 'Anúncios',     icon: Tag,             minPlan: 'basic' },
  { id: 'campaigns', label: 'Campanhas',    icon: Megaphone,       minPlan: 'premium' },
  { id: 'reports',   label: 'Relatórios',   icon: BarChart3,       minPlan: 'pro' },
  { id: 'settings',  label: 'Configurações',icon: Settings,        minPlan: 'free' },
  { id: 'terms',     label: 'Termos',       icon: ShieldCheck,    minPlan: 'free' },
  { id: 'support',   label: 'Suporte',      icon: LifeBuoy,       minPlan: 'free' },
];

const UpgradeAccess = ({ title, desc, onUpgrade }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in zoom-in-95 duration-300">
    <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mb-4">
      <Star size={32} fill="currentColor" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mb-6">{desc}</p>
    <button
      onClick={onUpgrade}
      className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
    >
      Fazer Upgrade Agora
    </button>
  </div>
);

export default function MerchantTabs({ 
  merchant, currentUser, myAds, loadingAds, onUpgrade, onCreateAdClick, onDeleteAd, onEditAd, onMerchantUpdate 
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const plan = merchant?.plan || 'free';
  const photoLimit = PLANS_CONFIG[plan]?.photoLimit ?? 1;

  const hasAccess = (tabId) => {
    const tab = TABS.find(t => t.id === tabId);
    if (!tab || tab.minPlan === 'free') return true;
    return hasPlanAccess(plan, tab.minPlan);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-max min-w-full">
          {TABS.map(({ id, label, icon: Icon }) => {
            const blocked = !hasAccess(id);
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {blocked ? <Lock size={12} className="text-slate-400" /> : <Icon size={13} />}
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <DashboardTab 
          merchant={merchant} 
          myAds={myAds} 
          onUpgrade={onUpgrade} 
          currentUser={currentUser}
          onNavigate={setActiveTab}
        />
      )}
      
      {activeTab === 'ads' && (
        hasAccess('ads') 
          ? <AdsTab myAds={myAds} loading={loadingAds} onCreateClick={onCreateAdClick} onDeleteClick={onDeleteAd} onEditClick={onEditAd} photoLimit={photoLimit} />
          : <UpgradeAccess 
              title="Classificados PRO" 
              desc="Aumente seu alcance! Publique anúncios detalhados de seus produtos no guia do bairro." 
              onUpgrade={onUpgrade} 
            />
      )}

      {activeTab === 'campaigns' && (
        hasAccess('campaigns')
          ? <CampaignTab merchant={merchant} onUpgrade={onUpgrade} />
          : <UpgradeAccess 
              title="Campanhas de Impacto" 
              desc="Dispare notificações e apareça no topo das buscas para todos os moradores." 
              onUpgrade={onUpgrade} 
            />
      )}

      {activeTab === 'reports' && (
        hasAccess('reports')
          ? <ReportsTab merchant={merchant} onUpgrade={onUpgrade} />
          : <UpgradeAccess 
              title="Análise Inteligente" 
              desc="Veja quem está visitando seu perfil e quais produtos são os mais clicados." 
              onUpgrade={onUpgrade} 
            />
      )}

      {activeTab === 'settings' && <MerchantSettingsTab merchant={merchant} currentUser={currentUser} onUpdate={onMerchantUpdate} />}
      {activeTab === 'terms' && <TermsTab onAccepted={() => {}} />}
      {activeTab === 'support' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center animate-in fade-in duration-500">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Suporte via Plataforma</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Comerciantes possuem atendimento prioritário via chat interno. Em breve você poderá abrir tickets diretamente por aqui.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-xs text-slate-400 inline-block">
            Módulo em desenvolvimento
          </div>
        </div>
      )}
    </div>
  );
}
