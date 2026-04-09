import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react';
import { fetchAdsByUser, deleteAd } from '../../../../services/adsService';
import { useToast } from '../../../../components/Toast';
import CreateAdWizard from '../../../ads/CreateAdWizard';

export default function MyAdsTab({ currentUser }) {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [adToEdit, setAdToEdit] = useState(null);
  const showToast = useToast();

  const loadAds = async () => {
    setLoading(true);
    try {
      const data = await fetchAdsByUser(currentUser.uid);
      setAds(data);
    } catch (err) {
      showToast('Erro ao carregar classificados.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAds(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este classificado?')) return;
    try {
      await deleteAd(id);
      setAds(prev => prev.filter(a => a.id !== id));
      showToast('Classificado excluído.', 'success');
    } catch {
      showToast('Erro ao excluir.', 'error');
    }
  };

  const handleEdit = (ad) => {
    setAdToEdit(ad);
    setShowWizard(true);
  };

  const handleWizardClose = () => {
    setShowWizard(false);
    setAdToEdit(null);
    loadAds();
  };

  const statusLabel = (s) => {
    if (s === 'approved' || s === 'active') return { text: 'Ativo', cls: 'bg-emerald-100 text-emerald-700' };
    if (s === 'pending') return { text: 'Em análise', cls: 'bg-yellow-100 text-yellow-700' };
    if (s === 'rejected') return { text: 'Rejeitado', cls: 'bg-red-100 text-red-700' };
    return { text: s || 'Inativo', cls: 'bg-slate-100 text-slate-700' };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Meus Classificados</h3>
        <button onClick={() => { setAdToEdit(null); setShowWizard(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <PlusCircle size={16} /> Novo Classificado
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" size={28} /></div>
      ) : ads.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500">Nenhum classificado criado ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ads.map(ad => {
            const st = statusLabel(ad.status);
            return (
              <div key={ad.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{ad.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.text}</span>
                      <span className="text-xs text-slate-400">{ad.created_at ? new Date(ad.created_at).toLocaleDateString('pt-BR') : ''}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleEdit(ad)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(ad.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateAdWizard isOpen={showWizard} onClose={handleWizardClose} user={currentUser} initialAd={adToEdit} />
    </div>
  );
}
