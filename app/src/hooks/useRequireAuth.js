import { useCallback, useRef } from 'react';
import useAuthStore from '../stores/authStore';
import useUiStore from '../stores/uiStore';

export function useRequireAuth() {
  // [Bug#4] Guard correto é session, não profile.
  // profile pode ser null offline (timeout de rede) sem que o usuário esteja deslogado.
  const session = useAuthStore(state => state.session);
  const setIsLoginOpen = useUiStore(state => state.setIsLoginOpen);
  const pendingActionRef = useRef(null);

  const requireAuth = useCallback((action) => {
    if (session) { action(); }
    else { pendingActionRef.current = action; setIsLoginOpen(true); }
  }, [session, setIsLoginOpen]);

  const handleLoginSuccess = useCallback(() => {
    setIsLoginOpen(false);
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      setTimeout(action, 80);
    }
  }, [setIsLoginOpen]);

  return { requireAuth, handleLoginSuccess };
}

export default useRequireAuth;
