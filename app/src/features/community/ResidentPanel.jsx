import React, { useState } from 'react';
import { X, User, Heart, Settings, ShoppingBag } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import ResidentTabs from './ResidentTabs';
import FavoritesTab from './resident-panel/tabs/FavoritesTab';
import SettingsTab from './resident-panel/tabs/SettingsTab';
import { getFavorites } from '../../services/favoritesService';
import { useToast } from '../../components/Toast';

const SIDEBAR_ITEMS = [
  { id: 'content', label: 'Meu Conteúdo', icon: ShoppingBag },
  { id: 'favorites', label: 'Favoritos', icon: Heart },
  { id: 'settings', label: 'Meus Dados', icon: Settings },
];

export default function ResidentPanel({ onClose }) {
  const { currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState('content');
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);
  const showToast = useToast();

  const loadFavorites = async () => {
    setFavLoading(true);
    try {
      const data = await getFavorites(currentUser.uid);
      setFavorites(data);
    } catch {
      showToast('Erro ao carregar favoritos.', 'error');
    } finally {
      setFavLoading(false);
    }
  };

  const handleSectionChange = (id) => {
    setActiveSection(id);
    if (id === 'favorites') loadFavorites();
  };

  return (
    <div className="flex-1 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full min-h-[calc(100vh-160px)] flex flex-col overflow-hidden">
        <div className="bg-emerald-600 p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="text-emerald-200" /> Área do Morador
            </h2>
            <p className="text-emerald-100 text-sm">Gerencie seus classificados, notícias e campanhas</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors">
              <X size={24} />
            </button>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
            {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleSectionChange(id)}
                className={`p-4 text-left font-bold text-sm flex items-center gap-3 transition-colors ${
                  activeSection === id
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 border-l-4 border-emerald-600'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto p-6">
            {activeSection === 'content' && <ResidentTabs currentUser={currentUser} />}
            {activeSection === 'favorites' && <FavoritesTab loading={favLoading} favorites={favorites} />}
            {activeSection === 'settings' && <SettingsTab currentUser={currentUser} />}
          </div>
        </div>
      </div>
    </div>
  );
}
