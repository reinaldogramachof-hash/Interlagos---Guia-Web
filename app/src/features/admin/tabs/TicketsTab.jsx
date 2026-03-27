import { useState, useEffect } from 'react';
import { fetchOpenTickets, resolveTicket } from '../../../services/adminService';
import { useAuth } from '../../auth/AuthContext';
import { FileText, CheckCircle } from 'lucide-react';
import { useToast } from '../../../components/Toast';

export default function TicketsTab({ onCountChange }) {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const showToast = useToast();

  const fetchTickets = async () => {
    try {
      const data = await fetchOpenTickets();
      setTickets(data);
      onCountChange?.(data.length);
    } catch (error) {
      showToast('Erro ao carregar tickets.', 'error');
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleResolve = async (ticketId, resolution) => {
    try {
      await resolveTicket(ticketId, {
        status: resolution,
        resolved_at: new Date().toISOString(),
        resolved_by: currentUser.email,
      });
      showToast(`Ticket ${resolution}.`, 'success');
      fetchTickets();
    } catch (error) {
      showToast('Erro ao resolver ticket.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><FileText className="text-indigo-600" /> Solicitações e Documentos (Master Inbox)</h3>
      <div className="grid grid-cols-1 gap-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="bg-white p-6 rounded-xl border border-l-4 border-l-yellow-500 border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-full uppercase">{ticket.type || 'Ticket'}</span>
                <h4 className="font-bold text-slate-900 text-lg mt-1">{ticket.subject || 'Item #' + ticket.id}</h4>
                {ticket.body && <p className="text-sm text-slate-500">Motivo: <span className="italic">"{ticket.body}"</span></p>}
                <p className="text-xs text-slate-400 mt-1">Enviado por: {ticket.resolved_by || 'Sistema'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleResolve(ticket.id, 'approved')} className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-200 flex items-center gap-2"><CheckCircle size={16} /> Aprovar</button>
                <button onClick={() => handleResolve(ticket.id, 'dismissed')} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-200">Arquivar</button>
              </div>
            </div>
          </div>
        ))}
        {tickets.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <CheckCircle className="mx-auto mb-3 text-slate-300" size={48} />
            <p className="text-slate-500 font-medium">Nenhuma solicitação pendente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
