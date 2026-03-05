import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { createNotification } from '../../../services/notificationService';
import { useAuth } from '../../../context/AuthContext';
import { Shield, CheckCircle, AlertTriangle, X } from 'lucide-react';

function ModerationCard({ item, onApprove, onReject, onEscalate }) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [checks, setChecks] = useState({ realPhoto: false, safeDescription: false, safeHistory: false, communitySense: false });
  const allChecked = Object.values(checks).every(Boolean);

  if (isReviewing) {
    return (
      <div className="bg-slate-50 border-2 border-indigo-100 p-6 rounded-xl shadow-sm animate-in fade-in">
        <h4 className="font-bold text-lg text-slate-900 mb-2">Revisão de Segurança</h4>
        <p className="text-sm text-slate-500 mb-4">Para aprovar este item, verifique os pontos abaixo:</p>
        <div className="space-y-3 mb-6">
          {[
            { key: 'realPhoto',        label: 'A foto parece real e legítima?' },
            { key: 'safeDescription',  label: 'A descrição não contém dados sensíveis ou ofensivos?' },
            { key: 'safeHistory',      label: 'O usuário não possui histórico suspeito?' },
            { key: 'communitySense',   label: 'O pedido faz sentido para a comunidade?' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
              <input type="checkbox" checked={checks[key]} onChange={() => setChecks(p => ({ ...p, [key]: !p[key] }))} className="w-5 h-5 text-indigo-600 rounded" />
              <span className="text-sm font-medium text-slate-700">{label}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => onApprove(item._table, item.id)} disabled={!allChecked} className="flex-1 bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
            <CheckCircle size={20} /> Confirmar Aprovação
          </button>
          <button onClick={() => setIsReviewing(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold">Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-start">
      <div>
        <span className={`text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block ${item._table === 'ads' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-100 text-indigo-600'}`}>
          {item._table === 'ads' ? 'Anúncio' : 'Campanha'}
        </span>
        <h4 className="font-bold text-lg text-slate-900">{item.title}</h4>
        <p className="text-slate-500 text-sm mb-2 line-clamp-2">{item.description}</p>
        <p className="text-xs text-slate-400">Autor: {item.author_name || item.author?.name || 'Desconhecido'}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setIsReviewing(true)} className="bg-indigo-50 text-indigo-700 p-2 rounded-lg hover:bg-indigo-100 font-bold text-sm flex items-center gap-1">
          <Shield size={16} /> Revisar
        </button>
        <button onClick={() => onEscalate(item._table, item.id, item.title)} className="bg-yellow-50 text-yellow-700 p-2 rounded-lg hover:bg-yellow-100 font-bold text-sm" title="Escalar para Master">
          <AlertTriangle size={16} />
        </button>
        <button onClick={() => onReject(item._table, item.id)} className="bg-red-50 text-red-700 p-2 rounded-lg hover:bg-red-100 font-bold text-sm">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default function ApprovalsTab({ onEscalate, onCountChange }) {
  const [pending, setPending] = useState([]);

  const fetchPending = async () => {
    const [{ data: ads }, { data: campaigns }] = await Promise.all([
      supabase.from('ads').select('*').eq('status', 'pending'),
      supabase.from('campaigns').select('*').eq('status', 'pending'),
    ]);
    const all = [
      ...(ads || []).map(a => ({ ...a, _table: 'ads' })),
      ...(campaigns || []).map(c => ({ ...c, _table: 'campaigns' })),
    ];
    setPending(all);
    onCountChange?.(all.length);
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (table, id) => {
    const item = pending.find(i => i.id === id);
    await supabase.from(table).update({ status: 'approved' }).eq('id', id);
    if (item?.seller_id || item?.author_id) {
      await createNotification(
        item.seller_id || item.author_id,
        'Aprovação Concluída',
        `Seu ${table === 'ads' ? 'anúncio' : 'campanha'} "${item.title}" foi aprovado!`,
        'success'
      );
    }
    fetchPending();
  };

  const handleReject = async (table, id) => {
    if (!window.confirm('Rejeitar e excluir este item?')) return;
    const item = pending.find(i => i.id === id);
    await supabase.from(table).delete().eq('id', id);
    if (item?.seller_id || item?.author_id) {
      await createNotification(
        item.seller_id || item.author_id,
        'Item Rejeitado',
        `Seu ${table === 'ads' ? 'anúncio' : 'campanha'} "${item.title}" não atendeu às diretrizes.`,
        'warning'
      );
    }
    fetchPending();
  };

  return (
    <div className="space-y-8">
      <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
        <CheckCircle className="text-emerald-500" /> Itens Pendentes de Aprovação
      </h3>
      {pending.length === 0 && (
        <div className="p-8 bg-emerald-50 rounded-xl text-center border border-emerald-100">
          <CheckCircle className="mx-auto text-emerald-500 mb-2" size={32} />
          <p className="text-emerald-800 font-medium">Tudo limpo! Nada para moderar.</p>
        </div>
      )}
      <div className="space-y-4">
        {pending.map(item => (
          <ModerationCard key={item.id} item={item} onApprove={handleApprove} onReject={handleReject} onEscalate={onEscalate} />
        ))}
      </div>
    </div>
  );
}
