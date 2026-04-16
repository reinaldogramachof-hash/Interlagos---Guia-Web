import { useState, useEffect } from 'react';
import { ChevronUp, Lightbulb, Trash2, ChevronDown, TrendingUp, BarChart2, AlertCircle } from 'lucide-react';
import { adminFetchSuggestions, updateSuggestionStatus, adminDeleteSuggestion, fetchSuggestionStats, SUGGESTION_CATEGORIES } from '../../../services/communityService';
import { useToast } from '../../../components/Toast';
import PollsTab from './PollsTab';

const STATUS_CONFIG = {
  pending:     { label: 'Pendente',     bg: 'bg-amber-100 text-amber-700' },
  reviewed:    { label: 'Em Análise',   bg: 'bg-blue-100 text-blue-700' },
  implemented: { label: 'Implementada', bg: 'bg-emerald-100 text-emerald-700' },
  rejected:    { label: 'Rejeitada',    bg: 'bg-red-100 text-red-700' },
};

const FILTERS = [
  { id: 'all',         label: 'Todas' },
  { id: 'pending',     label: 'Pendentes' },
  { id: 'reviewed',    label: 'Em Análise' },
  { id: 'implemented', label: 'Implementadas' },
  { id: 'rejected',    label: 'Rejeitadas' },
];

function SuggestionCard({ item, onStatusChange, onDelete, onCreatePoll }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pending;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 transition-all hover:border-slate-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
              {item.title || 'Sugestão'}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${cfg.bg}`}>
              {cfg.label}
            </span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{item.description}</p>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400 font-medium">
            <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
              <ChevronUp size={12} />
              {item.votes ?? 0} votos
            </span>
            <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onCreatePoll(item)}
            className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Transformar em Enquete"
          >
            <BarChart2 size={16} />
          </button>
          <button
            onClick={() => setOpen(p => !p)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            title="Mudar Status"
          >
            <ChevronDown size={16} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Excluir esta sugestão permanentemente?')) onDelete(item.id);
            }}
            className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
          {Object.entries(STATUS_CONFIG).map(([key, { label, bg }]) => (
            <button
              key={key}
              disabled={item.status === key}
              onClick={() => { onStatusChange(item.id, key); setOpen(false); }}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm ${bg}`}
            >
              Marcar como {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SuggestionsTab() {
  const [suggestions, setSuggestions] = useState([]);
  const [stats, setStats]             = useState({});
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('all');
  const [pollRedirect, setPollRedirect] = useState(null);
  const showToast = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [data, sData] = await Promise.all([
        adminFetchSuggestions(),
        fetchSuggestionStats()
      ]);
      setSuggestions(data);
      setStats(sData);
    } catch {
      showToast('Erro ao carregar sugestões.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateSuggestionStatus(id, status);
      showToast('Status atualizado.', 'success');
      setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    } catch {
      showToast('Erro ao atualizar status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteSuggestion(id);
      showToast('Sugestão excluída.', 'info');
      setSuggestions(prev => prev.filter(s => s.id !== id));
    } catch {
      showToast('Erro ao excluir sugestão.', 'error');
    }
  };

  const trends = Object.entries(stats)
    .filter(([_, count]) => count >= 20)
    .sort((a, b) => b[1] - a[1]);

  if (pollRedirect) {
    return (
      <div className="animate-in fade-in duration-500">
        <button 
          onClick={() => setPollRedirect(null)}
          className="mb-6 text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
        >
          &larr; Voltar para Sugestões
        </button>
        <PollsTab 
          initialData={{ question: pollRedirect.description }} 
          onCreated={() => { setPollRedirect(null); load(); }} 
        />
      </div>
    );
  }

  const filtered = filter === 'all' ? suggestions : suggestions.filter(s => s.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="text-amber-500" size={22} />
        <h3 className="font-bold text-lg text-slate-800">Sugestões da Comunidade</h3>
        <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{suggestions.length} total</span>
      </div>

      {/* Barra de Tendências */}
      {trends.length > 0 && (
        <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-600/20 animate-in slide-in-from-right duration-500">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-indigo-200" />
            <h4 className="font-bold text-sm uppercase tracking-widest">Tendências Identificadas</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trends.map(([cat, count]) => (
              <div key={cat} className="bg-white/10 border border-white/10 rounded-xl p-3 backdrop-blur-sm flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-indigo-200 uppercase">{cat}</p>
                  <p className="text-sm font-bold">{count} sugestões</p>
                </div>
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xs ring-2 ring-white/20">
                  +20
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-indigo-200 bg-black/10 p-2 rounded-lg inline-flex">
            <AlertCircle size={12} />
            Estes temas atingiram o limiar de 20 sugestões. Considere abrir uma enquete.
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === f.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium">Analisando sugestões...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <Lightbulb size={40} className="mx-auto mb-3 text-slate-200" />
          <p className="font-bold text-slate-400">{filter === 'all' ? 'Nenhuma sugestão ainda.' : 'Nenhuma sugestão neste filtro.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(item => (
            <SuggestionCard
              key={item.id}
              item={item}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onCreatePoll={() => setPollRedirect(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
