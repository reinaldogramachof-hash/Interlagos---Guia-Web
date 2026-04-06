import { useState, useEffect } from 'react';
import { ClipboardList, AlertTriangle } from 'lucide-react';
import { fetchAuditLogs } from '../../../services/adminService';
import { useToast } from '../../../components/Toast';

export default function AuditTab() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        setError(null);
        const data = await fetchAuditLogs();
        setLogs(data);
      } catch (err) {
        setError(err.message || 'Falha ao buscar dados de auditoria.');
        showToast('Erro ao carregar auditoria.', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
        <ClipboardList className="text-indigo-600" /> Auditoria e Logs do Sistema
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-3 text-red-700 text-sm">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <p className="text-center text-slate-400 py-10">Carregando logs...</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Data/Hora</th>
                <th className="p-4">Ação</th>
                <th className="p-4">Detalhes</th>
                <th className="p-4">Usuário</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-500 font-mono text-xs">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-4 font-bold text-slate-700">{log.action}</td>
                  <td className="p-4 text-slate-600">{log.details}</td>
                  <td className="p-4 text-slate-500 text-xs">{log.user_name || log.profiles?.display_name || log.user_id}</td>
                </tr>
              ))}
              {logs.length === 0 && !error && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400">Nenhum log registrado recentemente.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
