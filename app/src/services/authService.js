import { supabase } from '../lib/supabaseClient';
import { validateEmail, validateName, sanitizeInput } from '../utils/validation';

export const getUserRole = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  if (error) { console.error('authService.getUserRole:', error); return null; }
  return data?.role || null;
};

export const createUserProfile = async (user, additionalData = {}) => {
  if (!user?.id) throw new Error('Usuário inválido: ID ausente');

  const email = user.email;
  const displayName = user.user_metadata?.full_name || email?.split('@')[0] || '';

  if (!validateEmail(email)) throw new Error('Email inválido');
  const sanitizedName = sanitizeInput(displayName);
  if (!validateName(sanitizedName)) throw new Error('Nome deve ter entre 2 e 100 caracteres');

  const validRoles = ['resident', 'merchant'];
  const role = additionalData.role && validRoles.includes(additionalData.role)
    ? additionalData.role
    : 'resident';

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      display_name: sanitizedName,
      photo_url: user.user_metadata?.avatar_url || null,
      role,
    })
    .select('role')
    .single();

  if (error) throw new Error('Falha ao criar perfil: ' + error.message);
  return data.role;
};
