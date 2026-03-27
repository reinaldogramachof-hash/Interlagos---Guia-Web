import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

/**
 * authStore — fonte única de verdade para autenticação.
 * Substitui Firebase Auth + Firestore para gestão de sessão e perfil.
 */
const useAuthStore = create((set, get) => ({
  session: null,
  profile: null,
  loading: true,

  init: () => {
    // Safety: se após 10s loading ainda for true (ex: sem rede), força false
    const safetyTimer = setTimeout(() => {
      if (get().loading) set({ loading: false });
    }, 10000);

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(safetyTimer);
        set({ session });
        if (session) get()._fetchProfile(session.user.id);
        else set({ loading: false });
      })
      .catch(() => {
        clearTimeout(safetyTimer);
        set({ loading: false });
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        set({ session });
        if (session) await get()._fetchProfile(session.user.id);
        else set({ profile: null, loading: false });
      } catch (err) {
        console.error('[authStore] onAuthStateChange error:', err);
        set({ loading: false });
      }
    });

    return () => subscription.unsubscribe();
  },

  _fetchProfile: async (userId) => {
    const queryWithTimeout = (query, ms = 6000) =>
      Promise.race([
        query,
        new Promise((_, rej) => setTimeout(() => rej(new Error('query_timeout')), ms)),
      ]);

    try {
      const { data } = await queryWithTimeout(
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
      );

      if (!data) {
        const user = get().session?.user;
        if (user) {
          const { data: newProfile } = await queryWithTimeout(
            supabase
              .from('profiles')
              .upsert({
                id: user.id,
                display_name: user.user_metadata?.full_name || user.email?.split('@')[0],
                photo_url: user.user_metadata?.avatar_url || null,
                role: 'resident',
              })
              .select()
              .single()
          );
          set({ profile: newProfile || null, loading: false });
        } else {
          set({ loading: false });
        }
      } else {
        set({ profile: data, loading: false });
      }
    } catch (err) {
      console.error('[authStore] _fetchProfile error:', err.message);
      set({ loading: false });
    }
  },

  signInWithGoogle: async () => {
    const redirectTo = window.location.origin + import.meta.env.BASE_URL;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) throw error;
  },

  signInWithMagicLink: async (email) => {
    const redirectTo = window.location.origin + import.meta.env.BASE_URL;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) throw error;
  },

  signInWithPassword: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  refreshProfile: () => {
    const userId = get().session?.user?.id;
    if (userId) get()._fetchProfile(userId);
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ session: null, profile: null });
  },
}));

// Selectors — usar fora do hook com useAuthStore.getState()
export const selectCurrentUser = (state) => {
  if (!state.session) return null;
  return {
    id: state.session.user.id,
    uid: state.session.user.id,
    email: state.session.user.email,
    displayName: state.profile?.display_name || state.session.user.email?.split('@')[0],
    photoURL: state.profile?.photo_url || null,
  };
};

export const selectRole = (state) => state.profile?.role || null;
export const selectPlan = (state) => state.profile?.plan || 'none';
export const selectIsAdmin = (state) => ['admin', 'master'].includes(state.profile?.role);
export const selectIsMaster = (state) => state.profile?.role === 'master';
export const selectIsMerchant = (state) => state.profile?.role === 'merchant';
export const selectIsResident = (state) => state.profile?.role === 'resident';

export default useAuthStore;
