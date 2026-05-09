import { useState, useEffect, useCallback } from 'react';
import { fetchPendingItems, approveItem, rejectItem } from '../../../services/adminService';
import { useAuth } from '../../auth/AuthContext';
import { Shield, CheckCircle, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { useToast } from '../../../components/Toast';

function ModerationCard({ item, onApprove, onReject, onEscalate }) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [checks, setChecks] = useState({
    realPhoto: false,
    safeDescription: false,
    safeHistory: false,
    communitySense: false,
  });
  const allChecked = Object.values(checks).every(Boolean);

  if (isReviewing) {
    return (
      <div className="animate-in fade-in rounded-[24px] border border-indigo-100 bg-gradient-to-br from-slate-50 to-indigo-50/60 p-6 shadow-sm">
        <h4 className="mb-2 text-lg font-black text-slate-900">Revisão de Segurança</h4>
        <p className="mb-4 text-sm text-slate-500">Antes de aprovar, confirme os pontos abaixo.</p>
        <div className="mb-6 space-y-3">
          {[
            { key: 'realPhoto', label: 'A foto parece real e legítima?' },
            { key: 'safeDescription', label: 'A descrição não contém dados sensíveis ou ofensivos?' },
            { key: 'safeHistory', label: 'O usuário não possui histórico suspeito?' },
            { key: 'communitySense', label: 'O pedido faz sentido para a comunidade?' },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={checks[key]}
                onChange={() => setChecks((prev) => ({ ...prev, [key]: !prev[key] }))}
                className="h-5 w-5 rounded text-indigo-600"
              />
              <span className="text-sm font-medium text-slate-700">{label}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onApprove(item._table, item.id)}
            disabled={!allChecked}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <CheckCircle size={20} /> Confirmar Aprovação
          </button>
          <button
            onClick={() => setIsReviewing(false)}
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  const tableLabels = {
    ads: 'Anúncio',
    campaigns: 'Campanha',
    merchants: 'Novo Comércio',
    news: 'Notícia',
  };
  const tableBgColors = {
    ads: 'bg-slate-100 text-slate-600',
    campaigns: 'bg-indigo-50 text-indigo-600',
    merchants: 'bg-emerald-50 text-emerald-700',
    news: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="flex items-start justify-between gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="min-w-0 flex-1">
        <span className={`mb-3 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] ${tableBgColors[item._table] || 'bg-slate-100 text-slate-600'}`}>
          {tableLabels[item._table] || item._table}
        </span>
        <h4 className="text-lg font-black text-slate-900">{item.title || item.name}</h4>
        <p className="mb-2 mt-2 line-clamp-2 text-sm text-slate-500">{item.description}</p>
        <p className="text-xs text-slate-400">Autor: {item.author_name || item.author?.name || 'Desconhecido'}</p>
        {item.image_url && (
          <img
            src={item.image_url}
            alt="Imagem do item"
            className="mt-3 h-32 w-full rounded-2xl border border-slate-100 object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          onClick={() => setIsReviewing(true)}
          className="flex items-center justify-center gap-1 rounded-xl bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700 transition-colors hover:bg-indigo-100"
        >
          <Shield size={16} /> Revisar
        </button>
        <button
          onClick={() => onEscalate(item._table, item.id, item.title)}
          className="rounded-xl bg-yellow-50 p-2 text-sm font-bold text-yellow-700 transition-colors hover:bg-yellow-100"
          title="Escalar para Master"
        >
          <AlertTriangle size={16} />
        </button>
        <button
          onClick={() => onReject(item._table, item.id)}
          className="rounded-xl bg-red-50 p-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-100"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default function ApprovalsTab({ onEscalate, onCountChange }) {
  const { currentUser } = useAuth();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const showToast = useToast();

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const all = await fetchPendingItems();
      setPending(all);
      onCountChange?.(all.length);
    } catch (error) {
      setLoadError(error.message || 'Erro ao carregar itens pendentes.');
      showToast(`Erro ao carregar itens pendentes: ${error.message || 'verifique sua conexão'}`, 'error');
      onCountChange?.(0);
    } finally {
      setLoading(false);
    }
  }, [onCountChange, showToast]);

  useEffect(() => {
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, [fetchPending]);

  const actor = { id: currentUser?.id, email: currentUser?.email };

  const handleApprove = async (table, id) => {
    try {
      await approveItem(table, id, actor);
      showToast('Item aprovado com sucesso!', 'success');
      fetchPending();
    } catch (e) {
      showToast(`Erro ao aprovar item: ${e.message || 'desconhecido'}`, 'error');
    }
  };

  const handleReject = async (table, id) => {
    try {
      await rejectItem(table, id, actor);
      showToast('Item rejeitado.', 'info');
      fetchPending();
    } catch (e) {
      showToast(`Erro ao rejeitar: ${e.message || 'desconhecido'}`, 'error');
    }
  };

  const pendingByType = pending.reduce((acc, item) => {
    acc[item._table] = (acc[item._table] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(135deg,_rgba(16,185,129,0.10),_rgba(255,255,255,0.95)_38%,_rgba(99,102,241,0.08))] p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-100">
              Moderação
            </div>
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-900 lg:text-xl">
              <CheckCircle className="text-emerald-500" /> Itens Pendentes de Aprovação
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Revise os envios mais recentes, confirme critérios de segurança e encaminhe casos sensíveis para a Torre de Controle.
            </p>
          </div>
          <button
            onClick={fetchPending}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-50"
            title="Atualizar"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Fila total</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{pending.length}</p>
            <p className="mt-1 text-xs text-slate-500">Itens aguardando decisão</p>
          </div>
          <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Comércios</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{pendingByType.merchants || 0}</p>
            <p className="mt-1 text-xs text-slate-500">Cadastros aguardando liberação</p>
          </div>
          <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Conteúdo</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{(pendingByType.news || 0) + (pendingByType.ads || 0)}</p>
            <p className="mt-1 text-xs text-slate-500">Notícias e anúncios</p>
          </div>
          <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Campanhas</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{pendingByType.campaigns || 0}</p>
            <p className="mt-1 text-xs text-slate-500">Ações sociais pendentes</p>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center text-slate-400">Carregando itens pendentes...</p>
      ) : (
        <>
          {!loadError && pending.length === 0 && (
            <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-8 text-center shadow-sm">
              <CheckCircle className="mx-auto mb-2 text-emerald-500" size={32} />
              <p className="font-medium text-emerald-800">Tudo limpo! Nada para moderar.</p>
            </div>
          )}
          <div className="space-y-4">
            {pending.map((item) => (
              <ModerationCard
                key={item.id}
                item={item}
                onApprove={handleApprove}
                onReject={handleReject}
                onEscalate={onEscalate}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
