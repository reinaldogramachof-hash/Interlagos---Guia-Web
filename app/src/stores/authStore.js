import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

const normalizeEmail = (value) => value.trim().toLowerCase();

// Flag para evitar _fetchProfile paralelo (race condition no startup)
let _profileFetchInFlight = false;

/**
 * authStore — fonte única de verdade para autenticação.
 *
 * Correções de sessão implementadas:
 * - [Bug#3] Race condition: flag _profileFetchInFlight evita dupla chamada em startup.
 * - [Bug#4] Sessão offline: profile null não desloga o usuário — session é o guard correto.
 * - [Bug#6] Safety timer: o timer não apaga a session; quando getSession() resolve depois,
 *           o estado de sessão é corrigido sem flash visual.
 * - [Bug#1] Visibilidade do app: listener de visibilitychange chama refreshSession()
 *           quando o app volta ao foco para mitigar o congelamento de timers no mobile.
 */
const useAuthStore = create((set, get) => ({
  session: null,
  profile: null,
  loading: true,

  init: () => {
    // [Bug#6] Safety timer — libera a UI após 10s mesmo sem rede,
    // mas NÃO apaga a session que possa ter vindo do getSession() local.
    const safetyTimer = setTimeout(() => {
      if (get().loading) {
        console.warn('[authStore] Safety timer disparou — força loading:false mas mantém session.');
        set({ loading: false });
      }
    }, 10000);

    // Inicialização principal: lê sessão do localStorage (funciona offline)
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        clearTimeout(safetyTimer);
        set({ session });
        if (session) {
          get()._fetchProfile(session.user.id);
        } else {
          set({ loading: false });
        }
      })
      .catch((err) => {
        console.error('[authStore] getSession error:', err);
        clearTimeout(safetyTimer);
        // Mesmo em erro, não força logout — pode ser falha de rede
        set({ loading: false });
      });

    // [Bug#3] Listener de eventos — sincroniza mudanças de sessão em tempo real.
    // getSession() e onAuthStateChange podem disparar simultaneamente no startup:
    // a flag _profileFetchInFlight garante que _fetchProfile rode só uma vez.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.debug(`[authStore] onAuthStateChange: ${event}`, session?.user?.email);

      // Só atualiza session; não dispara fetchProfile se já está em andamento (race startup)
      set({ session });

      if (event === 'SIGNED_OUT' || !session) {
        _profileFetchInFlight = false;
        set({ profile: null, loading: false });
        return;
      }

      // INITIAL_SESSION é disparado pelo SDK simultaneamente com getSession() no startup.
      // Deixamos getSession() ser o responsável; aqui apenas sincronizamos mudanças reais.
      if (event === 'INITIAL_SESSION') {
        // Não duplicamos: getSession().then() já agendou o fetchProfile
        return;
      }

      // TOKEN_REFRESHED, SIGNED_IN, USER_UPDATED → busca/atualiza perfil
      try {
        await get()._fetchProfile(session.user.id);
      } catch (err) {
        console.error('[authStore] onAuthStateChange _fetchProfile error:', err);
        set({ loading: false });
      }
    });

    // [Bug#1] Resilência mobile — quando o app volta do background,
    // força um refreshSession() para mitigar timers congelados pelo SO/browser.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        supabase.auth.getSession().then(({ data: { session } }) => {
          const currentSession = get().session;
          // Só atualiza se houve mudança real (evita re-renders desnecessários)
          if (session?.access_token !== currentSession?.access_token) {
            console.debug('[authStore] Sessão atualizada por visibilitychange.');
            set({ session });
            if (!session) {
              set({ profile: null });
            }
          }
        }).catch(() => {
          // Silencia erros offline — app continua com session do localStorage
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Retorna função de cleanup (para testes e StrictMode)
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  },

  _fetchProfile: async (userId) => {
    // [Bug#3] Evita chamadas paralelas — se já há uma em voo, ignora
    if (_profileFetchInFlight) {
      console.debug('[authStore] _fetchProfile já em andamento, ignorando chamada duplicada.');
      return;
    }
    _profileFetchInFlight = true;

    const queryWithTimeout = (query, ms = 8000) =>
      Promise.race([
        query,
        new Promise((_, rej) => setTimeout(() => rej(new Error('query_timeout')), ms)),
      ]);

    try {
      const { data, error } = await queryWithTimeout(
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
      );

      // [Bug#4] Timeout ou erro de rede — mantemos a session, só zeramos loading.
      // O usuário continua "logado" via session; profile fica null, o que é aceitável.
      if (error) {
        console.warn('[authStore] _fetchProfile query error:', error.message);
        set({ loading: false });
        return;
      }

      if (!data) {
        // Novo usuário — cria perfil via upsert
        const user = get().session?.user;
        if (!user) { set({ loading: false }); return; }

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
        set({ profile: data, loading: false });
      }
    } catch (err) {
      // [Bug#4] Timeout ou qualquer falha — not logged out, apenas sem profile
      console.error('[authStore] _fetchProfile error:', err.message);
      set({ loading: false });
    } finally {
      _profileFetchInFlight = false;
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
    // Sem emailRedirectTo → Supabase envia código de 6 dígitos (OTP),
    // não um link. O verifyOtp() processa o código dentro do próprio app.
    const cleanEmail = normalizeEmail(email);
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: window.location.origin + import.meta.env.BASE_URL,
        shouldCreateUser: true,
        data: {
          display_name: cleanEmail.split('@')[0],
          role: 'resident',
        },
      },
    });
    if (error) throw error;
  },

  /**
   * Verifica o código OTP de 6 dígitos enviado por e-mail.
   * Substitui o clique no link mágico — funciona dentro do app (PWA-safe).
   * @param {string} email  — e-mail do usuário
   * @param {string} token  — código de 6 dígitos digitado pelo usuário
   */
  verifyOtp: async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email: normalizeEmail(email),
      token: token.trim(),
      type: 'email',
    });
    if (error) throw error;
    return data;
  },

  signInWithPassword: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizeEmail(email), password });
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
    uid: state.session.user.id,  // @deprecated — use id
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
