import { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';
import { fetchAuditLogs } from '../../../services/adminService';
import { useToast } from '../../../components/Toast';

export default function AuditTab() {
  const [logs, setLogs] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await fetchAuditLogs();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
        showToast('Erro ao carregar auditoria.', 'error');
      }
    };
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
        <ClipboardList className="text-indigo-600" /> Auditoria e Logs do Sistema
      </h3>

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
                <td className="p-4 text-slate-500 text-xs">{log.profiles?.display_name || log.user_id}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-400">Nenhum log registrado recentemente.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
