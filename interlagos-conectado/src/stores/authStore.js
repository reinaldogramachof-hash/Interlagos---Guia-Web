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
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session });
      if (session) get()._fetchProfile(session.user.id);
      else set({ loading: false });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session });
      if (session) await get()._fetchProfile(session.user.id);
      else set({ profile: null, loading: false });
    });

    return () => subscription.unsubscribe();
  },

  _fetchProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!data) {
      // Perfil não existe — criar automaticamente
      const user = get().session?.user;
      if (user) {
        const { data: newProfile } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            display_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            photo_url: user.user_metadata?.avatar_url || null,
            role: 'resident',
          })
          .select()
          .single();
        set({ profile: newProfile, loading: false });
      } else {
        set({ loading: false });
      }
    } else {
      set({ profile: data, loading: false });
    }
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  },

  signInWithMagicLink: async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
  },

  signInWithPassword: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
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
