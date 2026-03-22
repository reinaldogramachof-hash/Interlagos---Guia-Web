/**
 * AuthContext — camada de compatibilidade para migração gradual.
 *
 * Redireciona todo o estado para o authStore Zustand.
 * Componentes antigos continuam funcionando com useAuth().
 * Componentes novos devem usar useAuthStore() diretamente.
 */
import useAuthStore, {
  selectCurrentUser,
  selectIsAdmin,
  selectIsMaster,
  selectIsMerchant,
  selectIsResident,
} from '../../stores/authStore';

export function useAuth() {
  const session  = useAuthStore(s => s.session);
  const profile  = useAuthStore(s => s.profile);
  const loading  = useAuthStore(s => s.loading);
  const logout   = useAuthStore(s => s.logout);

  return {
    currentUser: selectCurrentUser({ session, profile }),
    userRole:    profile?.role || null,
    loading,
    logout,
    isAdmin:    selectIsAdmin({ profile }),
    isMaster:   selectIsMaster({ profile }),
    isMerchant: selectIsMerchant({ profile }),
    isResident: selectIsResident({ profile }),
  };
}

export function AuthProvider({ children }) {
  const loading = useAuthStore(s => s.loading);
  // init() é chamado em main.jsx — não chamar aqui para evitar double-invoke do StrictMode

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }
  return children;
}
