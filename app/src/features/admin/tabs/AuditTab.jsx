import { useState, useEffect } from 'react';
import { ClipboardList, AlertTriangle, RefreshCw } from 'lucide-react';
import { fetchAuditLogs } from '../../../services/adminService';
import { useToast } from '../../../components/Toast';

const ACTION_LABELS = {
  approve: { label: 'Aprovação', color: 'bg-emerald-100 text-emerald-700' },
  reject: { label: 'Rejeição', color: 'bg-red-100 text-red-700' },
  escalate: { label: 'Escalonamento', color: 'bg-yellow-100 text-yellow-800' },
  role_change: { label: 'Troca de Role', color: 'bg-purple-100 text-purple-700' },
  resolve_ticket: { label: 'Ticket Resolvido', color: 'bg-blue-100 text-blue-700' },
  backup: { label: 'Backup', color: 'bg-slate-100 text-slate-600' },
  reset: { label: 'Reset DB', color: 'bg-red-200 text-red-800' },
};

function ActionBadge({ action }) {
  const meta = ACTION_LABELS[action] ?? { label: action, color: 'bg-slate-100 text-slate-600' };
  return <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${meta.color}`}>{meta.label}</span>;
}

function DetailsSummary({ log }) {
  if (!log.details || Object.keys(log.details).length === 0) return null;
  const parts = [];
  if (log.target_table) parts.push(log.target_table);
  if (log.details.title || log.details.name) parts.push(`"${log.details.title || log.details.name}"`);
  if (log.details.new_role) parts.push(`→ ${log.details.new_role}`);
  if (log.details.status) parts.push(`status: ${log.details.status}`);
  return <span className="text-xs text-slate-500">{parts.join(' · ')}</span>;
}

export default function AuditTab() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAuditLogs();
      setLogs(data);
    } catch (err) {
      setError(err.message || 'Falha ao buscar dados de auditoria.');
      showToast('Erro ao carregar auditoria.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const approveCount = logs.filter((log) => log.action === 'approve').length;
  const rejectCount = logs.filter((log) => log.action === 'reject').length;
  const roleChanges = logs.filter((log) => log.action === 'role_change').length;

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-sky-100 bg-[linear-gradient(135deg,_rgba(56,189,248,0.10),_rgba(255,255,255,0.96)_38%,_rgba(99,102,241,0.08))] p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700 ring-1 ring-sky-100">
              Trilhas do Sistema
            </div>
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-900 lg:text-xl">
              <ClipboardList className="text-indigo-600" /> Auditoria e Logs Administrativos
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Monitore decisões críticas, alterações de perfil e ações operacionais relevantes em uma linha do tempo consolidada.
            </p>
          </div>
          <button
            onClick={loadLogs}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-indigo-200 hover:text-indigo-600 disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Eventos</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{logs.length}</p>
          </div>
          <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Aprovações</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{approveCount}</p>
          </div>
          <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Rejeições</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{rejectCount}</p>
          </div>
          <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Trocas de Role</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{roleChanges}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center text-slate-400">Carregando logs...</p>
      ) : (
        <>
          {logs.length === 0 && !error && (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
              <ClipboardList className="mx-auto mb-3 text-slate-300" size={36} />
              <p className="font-medium text-slate-500">Nenhuma ação administrativa registrada.</p>
              <p className="mt-1 text-xs text-slate-400">As ações de aprovação, rejeição, escalonamento e troca de role aparecerão aqui.</p>
            </div>
          )}

          {logs.length > 0 && (
            <>
              <div className="hidden overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm lg:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-500">
                    <tr>
                      <th className="w-40 p-4">Data/Hora</th>
                      <th className="w-36 p-4">Ação</th>
                      <th className="p-4">Detalhes</th>
                      <th className="w-44 p-4">Operador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {logs.map((log) => (
                      <tr key={log.id} className="transition-colors hover:bg-slate-50">
                        <td className="whitespace-nowrap p-4 font-mono text-xs text-slate-400">
                          {new Date(log.created_at).toLocaleString('pt-BR')}
                        </td>
                        <td className="p-4">
                          <ActionBadge action={log.action} />
                        </td>
                        <td className="p-4">
                          <DetailsSummary log={log} />
                        </td>
                        <td className="max-w-[160px] truncate p-4 text-xs text-slate-500" title={log.actor_email}>
                          {log.actor_name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 lg:hidden">
                {logs.map((log) => (
                  <div key={log.id} className="rounded-[24px] border border-slate-200 bg-white p-3 text-sm shadow-sm">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <ActionBadge action={log.action} />
                      <span className="font-mono text-xs text-slate-400">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <DetailsSummary log={log} />
                    <p className="mt-1 text-xs text-slate-400">{log.actor_name}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
