import { useState, useEffect } from 'react';
import { ClipboardList } from 'lucide-react';

// TODO Fase 2: substituir por query real ao Supabase (tabela audit_logs)
const MOCK_LOGS = [
  { id: 1, action: 'User Login', details: 'Admin user logged in', timestamp: new Date(), user: 'admin@temnobairro.com' },
  { id: 2, action: 'Merchant Created', details: 'New merchant "Padaria X" created', timestamp: new Date(Date.now() - 3600000), user: 'master@temnobairro.com' },
  { id: 3, action: 'Ad Approved', details: 'Ad "Promoção Relâmpago" approved', timestamp: new Date(Date.now() - 7200000), user: 'master@temnobairro.com' },
];

export default function AuditTab() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(MOCK_LOGS);
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
                <td className="p-4 text-slate-500 font-mono text-xs">{log.timestamp.toLocaleString()}</td>
                <td className="p-4 font-bold text-slate-700">{log.action}</td>
                <td className="p-4 text-slate-600">{log.details}</td>
                <td className="p-4 text-slate-500 text-xs">{log.user}</td>
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
