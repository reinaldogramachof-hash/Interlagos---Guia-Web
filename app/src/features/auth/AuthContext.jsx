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
  // init() é chamado em main.jsx — não chamar aqui para evitar double-invoke do StrictMode.
  // A shell pública não deve esperar a autenticação resolver; telas protegidas usam
  // requireAuth/useAuthStore para decidir login, perfil e permissões.
  return children;
}
