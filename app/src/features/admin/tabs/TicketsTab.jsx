import { useState, useEffect } from 'react';
import { fetchOpenTickets, resolveTicket } from '../../../services/adminService';
import { useAuth } from '../../auth/AuthContext';
import { AlertTriangle, CheckCircle, ExternalLink, FileText } from 'lucide-react';
import { useToast } from '../../../components/Toast';

const TABLE_LABELS = {
  ads: 'Anúncio',
  merchants: 'Comércio',
  news: 'Notícia',
  campaigns: 'Campanha',
  suggestions: 'Sugestão',
};

export default function TicketsTab({ onCountChange }) {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const showToast = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchOpenTickets();
      setTickets(data);
      onCountChange?.(data.length);
    } catch (error) {
      setLoadError(error.message || 'Erro ao carregar tickets.');
      showToast(`Erro ao carregar tickets: ${error.message || 'desconhecido'}`, 'error');
      onCountChange?.(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleResolve = async (ticketId, resolution) => {
    try {
      await resolveTicket(
        ticketId,
        {
          status: resolution,
          resolved_by: currentUser?.email || currentUser?.id,
        },
        { id: currentUser?.id, email: currentUser?.email }
      );
      const label = resolution === 'resolved' ? 'aprovado' : 'arquivado';
      showToast(`Ticket ${label} com sucesso.`, 'success');
      fetchTickets();
    } catch (error) {
      showToast(`Erro ao resolver ticket: ${error.message || 'desconhecido'}`, 'error');
    }
  };

  const escalations = tickets.filter((ticket) => ticket.type === 'escalation').length;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-amber-100 bg-[linear-gradient(135deg,_rgba(245,158,11,0.12),_rgba(255,255,255,0.95)_42%,_rgba(59,130,246,0.06))] p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700 ring-1 ring-amber-100">
              Governança Master
            </div>
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-900 lg:text-xl">
              <FileText className="text-indigo-600" /> Solicitações e Documentos
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Centralize pendências sensíveis, decisões operacionais e itens escalados pelo time administrativo.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Abertos</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{tickets.length}</p>
            </div>
            <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Escalonados</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{escalations}</p>
            </div>
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
        <p className="py-10 text-center text-slate-400">Carregando tickets...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="rounded-[24px] border border-slate-200 border-l-[6px] border-l-yellow-500 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-yellow-800">
                      {ticket.type || 'Ticket'}
                    </span>
                    {ticket.ref_table && (
                      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-600">
                        <ExternalLink size={10} />
                        {TABLE_LABELS[ticket.ref_table] || ticket.ref_table}
                        {ticket.ref_id && <span className="font-mono opacity-60">#{ticket.ref_id.slice(0, 6)}</span>}
                      </span>
                    )}
                  </div>
                  <h4 className="text-lg font-black text-slate-900">{ticket.subject || `Item #${ticket.id}`}</h4>
                  {ticket.body && (
                    <p className="mt-1 text-sm text-slate-500">
                      Motivo: <span className="italic">"{ticket.body}"</span>
                    </p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    Enviado por {ticket.author?.display_name || (ticket.author_id ? String(ticket.author_id).slice(0, 8) : 'Sistema')}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleResolve(ticket.id, 'resolved')}
                    className="flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-200"
                  >
                    <CheckCircle size={16} /> Aprovar
                  </button>
                  <button
                    onClick={() => handleResolve(ticket.id, 'rejected')}
                    className="min-h-[44px] rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    Arquivar
                  </button>
                </div>
              </div>
            </div>
          ))}

          {tickets.length === 0 && !loadError && (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
              <CheckCircle className="mx-auto mb-3 text-slate-300" size={48} />
              <p className="font-medium text-slate-500">Nenhuma solicitação pendente.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
