import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { fetchNewsByAuthor, deleteNews } from '../../../../services/newsService';
import { useToast } from '../../../../components/Toast';

export default function MyNewsTab({ currentUser, onCreateNews }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await fetchNewsByAuthor(currentUser.id);
      setNews(data);
    } catch {
      showToast('Erro ao carregar notícias.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNews(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir esta notícia?')) return;
    try {
      await deleteNews(id, currentUser.id);
      setNews(prev => prev.filter(n => n.id !== id));
      showToast('Notícia excluída.', 'success');
    } catch {
      showToast('Erro ao excluir.', 'error');
    }
  };

  const statusLabel = (s) => {
    if (s === 'active') return { text: 'Publicada', cls: 'bg-emerald-100 text-emerald-700' };
    if (s === 'pending') return { text: 'Em análise', cls: 'bg-yellow-100 text-yellow-700' };
    if (s === 'rejected') return { text: 'Rejeitada', cls: 'bg-red-100 text-red-700' };
    return { text: s || 'Rascunho', cls: 'bg-slate-100 text-slate-700' };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Minhas Notícias</h3>
        <button onClick={onCreateNews} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors">
          <PlusCircle size={16} /> Nova Notícia
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" size={28} /></div>
      ) : news.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <p className="text-slate-500">Nenhuma notícia publicada ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {news.map(item => {
            const st = statusLabel(item.status);
            return (
              <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.text}</span>
                      <span className="text-xs text-slate-400">{item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : ''}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
