import { useState, useEffect } from 'react';
import { fetchUsers, updateUserRole } from '../../../services/adminService';
import { fetchUserConsents } from '../../../services/consentService';
import { User, Search } from 'lucide-react';
import { useToast } from '../../../components/Toast';

// Nota: criação de usuário via Supabase Admin requer Edge Function (service_role key).
// Por ora, este painel apenas GERENCIA perfis existentes.

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [consentsMap, setConsentsMap] = useState({});
  const showToast = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);

      // Carregar status de aceite dos termos para os primeiros 20 usuários
      const topUsers = data.slice(0, 20);
      const results = await Promise.allSettled(topUsers.map(u => fetchUserConsents(u.id)));
      const map = {};
      topUsers.forEach((u, i) => {
        const r = results[i];
        if (r.status === 'fulfilled') {
          const termConsent = r.value.find(c => c.consent_type === 'platform_terms_v1');
          map[u.id] = termConsent ? termConsent.created_at || termConsent.accepted_at : null;
        }
      });
      setConsentsMap(map);
    } catch (error) {
      showToast('Erro ao carregar usuários.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      showToast(`Cargo alterado para ${newRole}.`, 'success');
      loadUsers();
    } catch (e) {
      showToast('Erro ao alterar cargo.', 'error');
    }
  };

  const handleBan = async (userId) => {
    try {
      await updateUserRole(userId, 'banned');
      showToast('Usuário banido.', 'success');
      loadUsers();
    } catch (e) {
      showToast('Erro ao banir usuário.', 'error');
    }
  };

  const filtered = users.filter(u =>
    u.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><User className="text-indigo-600" /> Gerenciamento de Usuários</h3>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input className="pl-9 p-2 border rounded-lg w-64 text-slate-900" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-lg">
        Para criar novos usuários admin/master, use o Dashboard do Supabase → Authentication → Users.
      </div>
      {loading ? (
        <p className="text-center text-slate-400 py-10">Carregando usuários...</p>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr><th className="p-4">Usuário</th><th className="p-4">Função</th><th className="p-4">Termos</th><th className="p-4 text-right">Ações</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="p-4 flex items-center gap-3">
                    {user.photo_url
                      ? <img src={user.photo_url} loading="lazy" className="w-8 h-8 rounded-full object-cover" onError={e => { e.target.onerror=null; e.target.style.display='none'; }} />
                      : <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold text-sm">{user.display_name?.[0]?.toUpperCase() ?? '?'}</div>
                    }
                    <div><div className="font-bold text-slate-900">{user.display_name || 'Sem Nome'}</div><div className="text-xs text-slate-400">{String(user.id).slice(0, 8)}…</div></div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'master' ? 'bg-purple-100 text-purple-700' : user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                      {user.role || 'resident'}
                    </span>
                  </td>
                  <td className="p-4">
                    {consentsMap[user.id] !== undefined ? (
                      consentsMap[user.id]
                        ? <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">✓ Aceito</span>
                        : <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Pendente</span>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {user.role !== 'master' && (
                      <>
                        {user.role === 'admin'
                          ? <button onClick={() => handleRoleChange(user.id, 'resident')} className="text-orange-600 hover:bg-orange-50 px-3 py-1 rounded-lg font-bold text-xs border border-orange-200">Rebaixar</button>
                          : <button onClick={() => handleRoleChange(user.id, 'admin')} className="text-brand-600 hover:bg-brand-50 px-3 py-1 rounded-lg font-bold text-xs border border-brand-200">Promover Admin</button>
                        }
                        <button onClick={() => handleBan(user.id)} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg font-bold text-xs border border-red-200">Banir</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
