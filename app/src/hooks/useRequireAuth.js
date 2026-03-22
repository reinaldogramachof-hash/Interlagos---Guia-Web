import { useRef } from 'react';
import useAuthStore from '../stores/authStore';
import useUiStore from '../stores/uiStore';

export function useRequireAuth() {
  const profile = useAuthStore(state => state.profile);
  const setIsLoginOpen = useUiStore(state => state.setIsLoginOpen);
  const pendingActionRef = useRef(null);

  const requireAuth = (action) => {
    if (profile) { action(); }
    else { pendingActionRef.current = action; setIsLoginOpen(true); }
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      setTimeout(action, 80);
    }
  };

  return { requireAuth, handleLoginSuccess };
}

export default useRequireAuth;
