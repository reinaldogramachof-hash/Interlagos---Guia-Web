import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchAdsByUser } from '../../../../services/adsService';
import { fetchCampaignsByUser } from '../../../../services/communityService';
import { fetchNewsByAuthor } from '../../../../services/newsService';

export default function ActivitiesTab({ currentUser }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) { setLoading(false); return; }

    const load = async () => {
      setLoading(true);
      try {
        const [ads, campaigns, news] = await Promise.all([
          fetchAdsByUser(currentUser.id).catch(() => []),
          fetchCampaignsByUser(currentUser.id).catch(() => []),
          fetchNewsByAuthor(currentUser.id).catch(() => []),
        ]);

        const merged = [
          ...(ads || []).map(a => ({ ...a, type: 'Classificado' })),
          ...(campaigns || []).map(c => ({ ...c, type: 'Campanha' })),
          ...(news || []).map(n => ({ ...n, type: 'Notícia' })),
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setActivities(merged);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentUser?.id]);

  const statusLabel = (status) => {
    if (status === 'active' || status === 'approved') return { text: 'Aprovado', cls: 'bg-emerald-100 text-emerald-700' };
    if (status === 'pending') return { text: 'Em Análise', cls: 'bg-yellow-100 text-yellow-700' };
    if (status === 'rejected') return { text: 'Rejeitado', cls: 'bg-red-100 text-red-700' };
    return { text: status || 'Inativo', cls: 'bg-slate-100 text-slate-700' };
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Histórico de Atividades</h3>
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" size={28} /></div>
      ) : activities.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500">Você ainda não criou nenhum anúncio, campanha ou notícia.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map(item => {
            const st = statusLabel(item.status);
            return (
              <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{item.type}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.text}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{item.title || item.name}</h4>
                </div>
                <div className="text-sm text-slate-500">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
