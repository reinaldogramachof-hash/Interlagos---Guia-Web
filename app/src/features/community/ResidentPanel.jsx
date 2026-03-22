import React, { useState, useEffect } from 'react';
import { X, User, Heart, List, Settings, Megaphone } from 'lucide-react';
import { useToast } from '../../components/Toast';
import { useAuth } from '../auth/AuthContext';
import { getFavorites } from '../../services/favoritesService';
import { fetchCampaignsByUser } from '../../services/communityService';
import { fetchAdsByUser } from '../../services/adsService';
import ActivitiesTab from './resident-panel/tabs/ActivitiesTab';
import AdsTab from './resident-panel/tabs/AdsTab';
import FavoritesTab from './resident-panel/tabs/FavoritesTab';
import SettingsTab from './resident-panel/tabs/SettingsTab';

export default function ResidentPanel({ onClose }) {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('activities');
    const { showToast } = useToast();
    const [myActivities, setMyActivities] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (activeTab === 'activities' || activeTab === 'ads') {
            fetchMyActivities();
        } else if (activeTab === 'favorites') {
            fetchFavorites();
        }
    }, [activeTab]);

    const fetchMyActivities = async () => {
        setLoading(true);
        try {
            const [campaigns, ads] = await Promise.all([
                fetchCampaignsByUser(currentUser.uid),
                fetchAdsByUser(currentUser.uid),
            ]);
            const activities = [
                ...campaigns.map(item => ({ ...item, type: 'Campanha' })),
                ...ads.map(item => ({ ...item, type: 'Anúncio' })),
            ];
            setMyActivities(activities);
        } catch (error) {
            console.error("Error fetching activities:", error);
            showToast('Erro ao carregar seu perfil.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const favs = await getFavorites(currentUser.uid);
            setFavorites(favs);
        } catch (error) {
            console.error("Error fetching favorites:", error);
            showToast('Erro ao carregar dados do comércio.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full min-h-[calc(100vh-160px)] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="bg-emerald-600 p-6 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <User className="text-emerald-200" /> Área do Morador
                        </h2>
                        <p className="text-emerald-100 text-sm">Acompanhe suas interações</p>
                    </div>
                    <button onClick={onClose} className="bg-white/10 text-white p-2 rounded-full hover:bg-white/20 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                        <button onClick={() => setActiveTab('activities')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 ${activeTab === 'activities' ? 'bg-white dark:bg-slate-900 text-emerald-600 border-l-4 border-emerald-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <List size={18} /> Minhas Atividades
                        </button>
                        <button onClick={() => setActiveTab('ads')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 ${activeTab === 'ads' ? 'bg-white dark:bg-slate-900 text-emerald-600 border-l-4 border-emerald-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <Megaphone size={18} /> Meus Anúncios
                        </button>
                        <button onClick={() => setActiveTab('favorites')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 ${activeTab === 'favorites' ? 'bg-white dark:bg-slate-900 text-emerald-600 border-l-4 border-emerald-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <Heart size={18} /> Favoritos
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`p-4 text-left font-bold text-sm flex items-center gap-3 ${activeTab === 'settings' ? 'bg-white dark:bg-slate-900 text-emerald-600 border-l-4 border-emerald-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}`}>
                            <Settings size={18} /> Meus Dados
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto p-6">

                        {activeTab === 'activities' && <ActivitiesTab loading={loading} myActivities={myActivities} />}
                        {activeTab === 'ads' && <AdsTab loading={loading} myActivities={myActivities} currentUser={currentUser} />}
                        {activeTab === 'favorites' && <FavoritesTab loading={loading} favorites={favorites} />}
                        {activeTab === 'settings' && <SettingsTab currentUser={currentUser} />}

                    </div>
                </div>
            </div>
        </div>
    );
}
