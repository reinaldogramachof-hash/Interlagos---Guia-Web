/**
 * AuthContext — camada de compatibilidade para migração gradual.
 *
 * Redireciona todo o estado para o authStore Zustand.
 * Componentes antigos continuam funcionando com useAuth().
 * Componentes novos devem usar useAuthStore() diretamente.
 */
import { useEffect } from 'react';
import useAuthStore, {
  selectCurrentUser,
  selectIsAdmin,
  selectIsMaster,
  selectIsMerchant,
  selectIsResident,
} from '../stores/authStore';

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
  const init    = useAuthStore(s => s.init);

  useEffect(() => {
    const unsubscribe = init();
    return unsubscribe;
  }, []);

  if (loading) return null;
  return children;
}
