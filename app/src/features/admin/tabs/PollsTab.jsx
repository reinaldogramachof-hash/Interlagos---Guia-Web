import { useState, useEffect } from 'react';
import { BarChart2, Plus, Trash2, CheckCircle, X, Search, Clock, Calendar } from 'lucide-react';
import { adminFetchPolls, createPoll, updatePollStatus, deletePoll } from '../../../services/pollsService';
import { useToast } from '../../../components/Toast';

const STATUS_CONFIG = {
  draft:  { label: 'Rascunho',  bg: 'bg-slate-100 text-slate-600' },
  active: { label: 'Ativa',     bg: 'bg-emerald-100 text-emerald-700' },
  closed: { label: 'Encerrada', bg: 'bg-red-100 text-red-700' },
};

// ─── Sub-componente: formulário de criação ──────────────────
function PollCreateForm({ onCreate, onCancel, initialData }) {
  const [question, setQuestion] = useState(initialData?.question || '');
  const [expiresAt, setExpiresAt] = useState('');
  const [options, setOptions]   = useState(['', '']);
  const [saving, setSaving]     = useState(false);
  const showToast = useToast();

  const addOption    = () => setOptions(p => [...p, '']);
  const removeOption = (i) => setOptions(p => p.filter((_, idx) => idx !== i));
  const setOption    = (i, val) => setOptions(p => p.map((o, idx) => idx === i ? val : o));

  const handleSubmit = async () => {
    const validOpts = options.map(o => o.trim()).filter(Boolean);
    if (!question.trim()) return showToast('Informe a pergunta.', 'warning');
    if (validOpts.length < 2) return showToast('Adicione ao menos 2 opções.', 'warning');
    setSaving(true);
    try {
      await onCreate(question.trim(), validOpts, expiresAt || null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h4 className="font-bold text-slate-800 flex items-center gap-2">
        <Plus size={18} className="text-indigo-600" /> Nova Enquete
      </h4>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Pergunta</label>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="O que a comunidade decide?"
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block flex items-center gap-1">
          <Calendar size={12} /> Expiração (Opcional)
        </label>
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={e => setExpiresAt(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-inner"
        />
        <p className="text-[10px] text-slate-400 mt-1">A enquete será encerrada automaticamente nesta data.</p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Opções</label>
        {options.map((opt, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={opt}
              onChange={e => setOption(i, e.target.value)}
              placeholder={`Opção ${i + 1}`}
              className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {options.length > 2 && (
              <button onClick={() => removeOption(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <X size={16} />
              </button>
            )}
          </div>
        ))}
        <button onClick={addOption} className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors mt-1">
          <Plus size={14} /> Adicionar opção
        </button>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <CheckCircle size={16} /> Criar como Rascunho
        </button>
        <button onClick={onCancel} className="px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── Sub-componente: detalhe de enquete ─────────────────────
function PollDetail({ poll, onStatusChange, onDelete }) {
  const totalVotes = poll.poll_options?.reduce((acc, opt) => acc + (opt.poll_votes?.length ?? 0), 0) ?? 0;
  const cfg = STATUS_CONFIG[poll.status] ?? STATUS_CONFIG.draft;
  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div>
        <div className="flex gap-2 mb-2">
           <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${cfg.bg}`}>{cfg.label}</span>
           {isExpired && poll.status === 'active' && (
             <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded flex items-center gap-1">
               <Clock size={10} /> Expirada
             </span>
           )}
        </div>
        <h4 className="font-bold text-slate-900 text-base leading-snug">{poll.question}</h4>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-2">
          <span>{totalVotes} voto(s)</span>
          <span>Início: {new Date(poll.created_at).toLocaleDateString('pt-BR')}</span>
          {poll.expires_at && (
            <span className="flex items-center gap-1 text-indigo-500 font-medium">
              <Clock size={12} /> Expira: {new Date(poll.expires_at).toLocaleString('pt-BR')}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {(poll.poll_options ?? [])
          .sort((a, b) => a.display_order - b.display_order)
          .map(opt => {
            const count = opt.poll_votes?.length ?? 0;
            const pct   = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            return (
              <div key={opt.id}>
                <div className="flex justify-between text-sm mb-1 px-1">
                  <span className="font-medium text-slate-700">{opt.text}</span>
                  <span className="text-slate-500 text-xs font-bold">{count} ({pct}%)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
        {poll.status === 'draft' && (
          <button onClick={() => onStatusChange(poll.id, 'active')} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/10">
            Publicar Enquete
          </button>
        )}
        {poll.status === 'active' && (
          <button onClick={() => onStatusChange(poll.id, 'closed')} className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-all shadow-md shadow-amber-500/10">
            Encerrar Manualmente
          </button>
        )}
        <button
          onClick={() => { if (window.confirm('Excluir esta enquete?')) onDelete(poll.id); }}
          className="ml-auto px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 flex items-center gap-1 transition-all"
        >
          <Trash2 size={16} /> Excluir
        </button>
      </div>
    </div>
  );
}

// ─── Tab principal ───────────────────────────────────────────
export default function PollsTab({ initialData, onCreated }) {
  const [polls, setPolls]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [creating, setCreating]     = useState(!!initialData);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const showToast = useToast();

  const load = async () => {
    setLoading(true);
    try { setPolls(await adminFetchPolls()); }
    catch { showToast('Erro ao carregar enquetes.', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async (question, options, expiresAt) => {
    try {
      await createPoll(question, options, expiresAt);
      showToast('Enquete criada como rascunho.', 'success');
      setCreating(false);
      onCreated?.(); // Notifica component pai se necessário (ex: Sugestões)
      await load();
    } catch {
      showToast('Erro ao criar enquete.', 'error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updatePollStatus(id, status);
      showToast('Status atualizado.', 'success');
      setPolls(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } catch {
      showToast('Erro ao atualizar status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePoll(id);
      showToast('Enquete excluída.', 'info');
      setPolls(prev => prev.filter(p => p.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch {
      showToast('Erro ao excluir enquete.', 'error');
    }
  };

  const filtered = polls.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.question.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = polls.find(p => p.id === selectedId) ?? null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="text-indigo-500" size={22} />
          <h3 className="font-bold text-lg text-slate-800">Enquetes</h3>
        </div>
        <button
          onClick={() => { setCreating(true); setSelectedId(null); }}
          className="sm:ml-auto flex items-center justify-center gap-1.5 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <Plus size={18} /> Nova Enquete
        </button>
      </div>

      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por pergunta..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
          />
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {['all', 'draft', 'active', 'closed'].map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f === 'all' ? 'Todas' : STATUS_CONFIG[f].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Lista */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
               <Clock className="animate-spin text-indigo-300 mb-2" size={32} />
               <p className="text-sm text-slate-400 font-medium">Sincronizando dados...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
              <BarChart2 size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="text-slate-400 font-medium">{search ? 'Nenhuma correspondência.' : 'Nenhuma enquete criada.'}</p>
            </div>
          ) : filtered.map(poll => {
            const totalV = poll.poll_options?.reduce((a, o) => a + (o.poll_votes?.length ?? 0), 0) ?? 0;
            const cfg = STATUS_CONFIG[poll.status] ?? STATUS_CONFIG.draft;
            const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date();
            
            return (
              <button
                key={poll.id}
                onClick={() => { setSelectedId(poll.id); setCreating(false); }}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${selectedId === poll.id ? 'border-indigo-400 bg-indigo-50/50 ring-1 ring-indigo-400/20' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${cfg.bg}`}>{cfg.label}</span>
                  {isExpired && poll.status === 'active' && <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5"><Clock size={10}/> Expirada</span>}
                </div>
                <p className="font-bold text-sm text-slate-800 line-clamp-2 mb-3 group-hover:text-indigo-900">{poll.question}</p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full font-medium text-[10px]">{totalV} votos</span>
                  <span className="ml-auto flex items-center gap-1 font-medium">{new Date(poll.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detalhe / Formulário */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[300px] shadow-sm sticky top-4">
          {creating ? (
            <PollCreateForm onCreate={handleCreate} onCancel={() => setCreating(false)} initialData={initialData} />
          ) : selected ? (
            <PollDetail poll={selected} onStatusChange={handleStatusChange} onDelete={handleDelete} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400">
              <BarChart2 size={48} className="mb-4 opacity-10 text-indigo-600" />
              <p className="text-sm font-semibold text-slate-300">Selecione uma enquete para gerenciar</p>
              <p className="text-[11px] text-slate-300 mt-1 max-w-[200px] text-center">Visualize resultados, encerre votações ou exclua registros.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
