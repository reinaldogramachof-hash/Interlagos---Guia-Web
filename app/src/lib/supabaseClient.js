import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Variáveis de ambiente ausentes. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Chave explícita evita conflito se dois módulos criarem o cliente.
    // Sem isso, o Supabase usa 'sb-<ref>-auth-token' como padrão.
    storageKey: 'tnb-auth-token',
    // Garante uso do localStorage nativo (imune a SW, já que SW não tem
    // acesso ao localStorage da página principal).
    storage: window.localStorage,
  },
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});
