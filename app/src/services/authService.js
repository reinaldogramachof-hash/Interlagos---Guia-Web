import { supabase } from '../lib/supabaseClient';
import { validateEmail, validateName, sanitizeInput, sanitizeObject } from '../utils/validation';

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

export const updateUserProfile = async (userId, data) => {
  // R4: sanitiza tags HTML de todos os campos string
  const cleanData = sanitizeObject(data);

  if (cleanData.display_name !== undefined && cleanData.display_name !== null) {
    if (!validateName(cleanData.display_name)) {
      throw new Error('Nome de exibção inválido.');
    }
  }

  const { data: result, error } = await supabase
    .from('profiles')
    .update(cleanData)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return result;
};
