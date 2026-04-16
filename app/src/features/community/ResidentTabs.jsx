import React, { useState } from 'react';
import { ShoppingBag, Newspaper, Heart, Star, Lightbulb, BarChart2, Settings, ShieldCheck, LifeBuoy, Mail } from 'lucide-react';
import MyAdsTab from './resident-panel/tabs/MyAdsTab';
import MyNewsTab from './resident-panel/tabs/MyNewsTab';
import MyCampaignsTab from './resident-panel/tabs/MyCampaignsTab';
import FavoritesTab from './resident-panel/tabs/FavoritesTab';
import SuggestionsTab from './resident-panel/tabs/SuggestionsTab';
import PollsTab from './resident-panel/tabs/PollsTab';
import ActivitiesTab from './resident-panel/tabs/ActivitiesTab';
import SettingsTab from './resident-panel/tabs/SettingsTab';
import TermsTab from '../terms/TermsTab';
import NewsResponsibilityModal from '../news/NewsResponsibilityModal';
import CreateNewsModal from '../news/CreateNewsModal';

const TABS = [
  { id: 'ads',         label: 'Classificados', icon: ShoppingBag },
  { id: 'news',        label: 'Notícias',       icon: Newspaper },
  { id: 'campaigns',   label: 'Campanhas',      icon: Heart },
  { id: 'favorites',   label: 'Favoritos',      icon: Star },
  { id: 'suggestions', label: 'Sugestões',      icon: Lightbulb },
  { id: 'polls',       label: 'Enquetes',       icon: BarChart2 },
  { id: 'activities',  label: 'Atividades',     icon: BarChart2 },
  { id: 'settings',    label: 'Configurações',  icon: Settings },
  { id: 'terms',        label: 'Termos',          icon: ShieldCheck },
  { id: 'support',      label: 'Suporte',         icon: LifeBuoy },
];

export default function ResidentTabs({ currentUser }) {
  const [activeTab, setActiveTab] = useState('ads');
  const [showResponsibility, setShowResponsibility] = useState(false);
  const [showCreateNews, setShowCreateNews] = useState(false);

  const handleCreateNews = () => setShowResponsibility(true);
  const handleAcceptResponsibility = () => {
    setShowResponsibility(false);
    setShowCreateNews(true);
  };

  return (
    <div className="space-y-4">
      {/* Nav scrollável — cabe em 375px sem quebrar */}
      <div className="overflow-x-auto pb-1 -mx-1 px-1">
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-max min-w-full">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                activeTab === id
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon size={13} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'ads'         && <MyAdsTab       currentUser={currentUser} />}
      {activeTab === 'news'        && <MyNewsTab       currentUser={currentUser} onCreateNews={handleCreateNews} />}
      {activeTab === 'campaigns'   && <MyCampaignsTab  currentUser={currentUser} />}
      {activeTab === 'favorites'   && <FavoritesTab    currentUser={currentUser} />}
      {activeTab === 'suggestions' && <SuggestionsTab  currentUser={currentUser} />}
      {activeTab === 'polls'       && <PollsTab        currentUser={currentUser} />}
      {activeTab === 'activities'  && <ActivitiesTab   currentUser={currentUser} />}
      {activeTab === 'settings'    && <SettingsTab     currentUser={currentUser} />}
      {activeTab === 'terms'       && <TermsTab        onAccepted={() => {}} />}
      {activeTab === 'support'     && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center animate-in fade-in duration-500">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Suporte por E-mail</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Para dúvidas, sugestões ou problemas técnicos, envie um e-mail para nossa equipe.
          </p>
          <a href="mailto:contato@temnobairro.com.br" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
            contato@temnobairro.com.br
          </a>
        </div>
      )}

      <NewsResponsibilityModal
        isOpen={showResponsibility}
        userId={currentUser.id}
        onConfirm={handleAcceptResponsibility}
        onCancel={() => setShowResponsibility(false)}
      />
      <CreateNewsModal
        isOpen={showCreateNews}
        userId={currentUser.id}
        onClose={() => setShowCreateNews(false)}
      />
    </div>
  );
}
