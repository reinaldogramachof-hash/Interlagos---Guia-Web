import React, { useState } from 'react';
import { ShoppingBag, Newspaper, Heart } from 'lucide-react';
import MyAdsTab from './resident-panel/tabs/MyAdsTab';
import MyNewsTab from './resident-panel/tabs/MyNewsTab';
import MyCampaignsTab from './resident-panel/tabs/MyCampaignsTab';
import NewsResponsibilityModal from '../news/NewsResponsibilityModal';
import CreateNewsModal from '../news/CreateNewsModal';

const TABS = [
  { id: 'ads', label: 'Meus Classificados', icon: ShoppingBag },
  { id: 'news', label: 'Minhas Notícias', icon: Newspaper },
  { id: 'campaigns', label: 'Minhas Campanhas', icon: Heart },
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
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === id
                ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon size={14} /> <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.split(' ').pop()}</span>
          </button>
        ))}
      </div>

      {activeTab === 'ads' && <MyAdsTab currentUser={currentUser} />}
      {activeTab === 'news' && <MyNewsTab currentUser={currentUser} onCreateNews={handleCreateNews} />}
      {activeTab === 'campaigns' && <MyCampaignsTab currentUser={currentUser} />}

      <NewsResponsibilityModal
        isOpen={showResponsibility}
        userId={currentUser.uid}
        onConfirm={handleAcceptResponsibility}
        onCancel={() => setShowResponsibility(false)}
      />
      <CreateNewsModal
        isOpen={showCreateNews}
        userId={currentUser.uid}
        onClose={() => setShowCreateNews(false)}
      />
    </div>
  );
}
