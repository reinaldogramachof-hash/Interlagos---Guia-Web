import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchUsers, searchUsers, updateUserRole } from '../../../services/adminService';
import { fetchUserConsents } from '../../../services/consentService';
import { useAuth } from '../../auth/AuthContext';
import { AlertTriangle, ChevronLeft, ChevronRight, Search, User } from 'lucide-react';
import { useToast } from '../../../components/Toast';
import UserDetailsModal from './UserDetailsModal';

const PAGE_SIZE = 50;

async function loadConsentsForUsers(users) {
  const results = await Promise.allSettled(users.map((u) => fetchUserConsents(u.id)));
  const map = {};
  users.forEach((u, i) => {
    const result = results[i];
    if (result.status === 'fulfilled') {
      const termConsent = result.value.find((consent) => consent.consent_type === 'platform_terms_v1');
      map[u.id] = termConsent ? termConsent.created_at || termConsent.accepted_at : null;
    }
  });
  return map;
}

export default function UsersTab() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [consentsMap, setConsentsMap] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const showToast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const searchTimeout = useRef(null);

  const loadPage = useCallback(async (term, pageNum) => {
    setLoading(true);
    setLoadError(null);
    try {
      let data;
      if (term.trim()) {
        data = await searchUsers(term.trim(), PAGE_SIZE);
        setPage(1);
        setHasMore(false);
      } else {
        data = await fetchUsers(pageNum, PAGE_SIZE);
        setHasMore(data.length === PAGE_SIZE);
      }
      setUsers(data);
      const map = await loadConsentsForUsers(data);
      setConsentsMap(map);
    } catch (error) {
      setLoadError(error.message || 'Erro ao carregar usuários.');
      showToast('Erro ao carregar usuários.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadPage('', 1);
  }, [loadPage]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      loadPage(val, 1);
    }, 350);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole, { id: currentUser?.id, email: currentUser?.email });
      showToast(`Cargo alterado para ${newRole}.`, 'success');
      loadPage(searchTerm, page);
    } catch (e) {
      showToast(`Erro ao alterar cargo: ${e.message || 'desconhecido'}`, 'error');
    }
  };

  const handleBan = async (userId) => {
    try {
      await updateUserRole(userId, 'banned', { id: currentUser?.id, email: currentUser?.email });
      showToast('Usuário banido.', 'success');
      loadPage(searchTerm, page);
    } catch (e) {
      showToast(`Erro ao banir usuário: ${e.message || 'desconhecido'}`, 'error');
    }
  };

  const goToPage = (next) => {
    setPage(next);
    loadPage(searchTerm, next);
  };

  const masters = users.filter((user) => user.role === 'master').length;
  const admins = users.filter((user) => user.role === 'admin').length;
  const banned = users.filter((user) => user.role === 'banned').length;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-indigo-100 bg-[linear-gradient(135deg,_rgba(99,102,241,0.10),_rgba(255,255,255,0.95)_38%,_rgba(14,165,233,0.08))] p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-700 ring-1 ring-indigo-100">
              Diretório Administrativo
            </div>
            <h3 className="flex items-center gap-2 text-lg font-black text-slate-900 lg:text-xl">
              <User className="text-indigo-600" size={20} /> Gerenciamento de Usuários
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Consulte o diretório da plataforma, acompanhe aceite de termos e gerencie permissões com mais contexto operacional.
            </p>
          </div>
          <div className="relative w-full xl:w-80">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 pl-9 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Buscar por nome, email ou ID..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Visíveis</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{users.length}</p>
          </div>
          <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Masters</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{masters}</p>
          </div>
          <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Admins</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{admins}</p>
          </div>
          <div className="rounded-2xl bg-white/85 p-4 ring-1 ring-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Banidos</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{banned}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        Para criar novos usuários admin/master, use o Dashboard do Supabase → Authentication → Users.
      </div>

      {loadError && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center text-slate-400">Carregando usuários...</p>
      ) : !loadError && users.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-slate-400">
          Nenhum usuário encontrado.
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-500">
                <tr>
                  <th className="p-4">Usuário</th>
                  <th className="p-4">Função</th>
                  <th className="p-4">Termos</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-slate-50">
                    <td className="p-4">
                      <button type="button" onClick={() => setSelectedUser(user)} className="group flex items-center gap-3 text-left">
                        {user.photo_url ? (
                          <img
                            src={user.photo_url}
                            alt={`Foto de ${user.display_name || user.email}`}
                            className="h-8 w-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600" aria-label="Avatar">
                            {user.display_name?.[0]?.toUpperCase() ?? '?'}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-brand-600">
                            {user.display_name || user.full_name || 'Sem Nome'}
                          </div>
                          <div className="text-xs text-slate-400">{user.email || `${String(user.id).slice(0, 8)}...`}</div>
                        </div>
                      </button>
                    </td>
                    <td className="p-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${
                        user.role === 'master'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'admin'
                            ? 'bg-indigo-100 text-indigo-700'
                            : user.role === 'banned'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role || 'resident'}
                      </span>
                    </td>
                    <td className="p-4">
                      {consentsMap[user.id] !== undefined ? (
                        consentsMap[user.id] ? (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">✓ Aceito</span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-700">Pendente</span>
                        )
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="space-x-2 p-4 text-right">
                      <button onClick={() => setSelectedUser(user)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100">
                        Detalhes
                      </button>
                      {user.role !== 'master' && (
                        <>
                          {user.role === 'admin' ? (
                            <button onClick={() => handleRoleChange(user.id, 'resident')} className="rounded-lg border border-orange-200 px-3 py-2 text-xs font-bold text-orange-600 transition-colors hover:bg-orange-50">
                              Rebaixar
                            </button>
                          ) : user.role !== 'banned' ? (
                            <button onClick={() => handleRoleChange(user.id, 'admin')} className="rounded-lg border border-brand-200 px-3 py-2 text-xs font-bold text-brand-600 transition-colors hover:bg-brand-50">
                              Promover Admin
                            </button>
                          ) : null}
                          {user.role !== 'banned' ? (
                            <button onClick={() => handleBan(user.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50">
                              Banir
                            </button>
                          ) : (
                            <button onClick={() => handleRoleChange(user.id, 'resident')} className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-50">
                              Reativar
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 lg:hidden">
            {users.map((user) => (
              <div key={user.id} className="space-y-3 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <button type="button" onClick={() => setSelectedUser(user)} className="group flex flex-1 items-center gap-3 text-left">
                    {user.photo_url ? (
                      <img
                        src={user.photo_url}
                        alt={`Foto de ${user.display_name || user.email}`}
                        className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600" aria-label="Avatar">
                        {user.display_name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="truncate font-bold text-slate-900">{user.display_name || user.full_name || 'Sem Nome'}</div>
                      <div className="truncate text-xs text-slate-400">{user.email || `${String(user.id).slice(0, 8)}...`}</div>
                    </div>
                  </button>
                  <button onClick={() => setSelectedUser(user)} className="flex min-h-[44px] flex-shrink-0 items-center rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100">
                    Detalh.
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Função:</span>
                    <div className="mt-1">
                      <span className={`inline-block rounded-full px-2 py-1 text-[10px] font-bold ${
                        user.role === 'master'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'admin'
                            ? 'bg-indigo-100 text-indigo-700'
                            : user.role === 'banned'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role || 'resident'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Termos:</span>
                    <div className="mt-1">
                      {consentsMap[user.id] !== undefined ? (
                        consentsMap[user.id] ? (
                          <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700">✓ Aceito</span>
                        ) : (
                          <span className="inline-block rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-700">Pendente</span>
                        )
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </div>
                  </div>
                </div>

                {user.role !== 'master' && (
                  <div className="flex flex-wrap gap-2">
                    {user.role === 'admin' ? (
                      <button onClick={() => handleRoleChange(user.id, 'resident')} className="flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-orange-200 px-3 py-2 text-xs font-bold text-orange-600 transition-colors hover:bg-orange-50">
                        Rebaixar
                      </button>
                    ) : user.role !== 'banned' ? (
                      <button onClick={() => handleRoleChange(user.id, 'admin')} className="flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-brand-200 px-3 py-2 text-xs font-bold text-brand-600 transition-colors hover:bg-brand-50">
                        Promover
                      </button>
                    ) : null}
                    {user.role !== 'banned' ? (
                      <button onClick={() => handleBan(user.id)} className="flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50">
                        Banir
                      </button>
                    ) : (
                      <button onClick={() => handleRoleChange(user.id, 'resident')} className="flex min-h-[44px] flex-1 items-center justify-center rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-50">
                        Reativar
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!searchTerm.trim() && (page > 1 || hasMore) && (
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1 || loading}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} /> Anterior
              </button>
              <span className="text-sm text-slate-500">Página {page}</span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={!hasMore || loading}
                className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Próxima <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          termsAcceptedAt={consentsMap[selectedUser.id] ?? selectedUser.terms_accepted_at}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
