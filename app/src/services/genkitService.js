import { supabase } from '../lib/supabaseClient';

const GENKIT_API_URL = import.meta.env.VITE_GENKIT_API_URL
  || 'http://localhost:5001/interlagos-conectado/us-central1/mainChatFlow';

export const sendMessageToGenkit = async ({ message, context, userProfile: _userProfile, history = [] }) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Usuário não autenticado.');

  const token = session.access_token;

  const payload = {
    userId: session.user.id,
    message,
    currentContext: context,
    userProfile: {
      name: session.user.user_metadata?.full_name || 'Usuário',
      isPremium: false,
      hasCompletedOnboarding: true,
    },
    locale: 'pt-BR',
    timestamp: new Date().toISOString(),
    history,
  };

  const response = await fetch(GENKIT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Erro na requisição: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
};
