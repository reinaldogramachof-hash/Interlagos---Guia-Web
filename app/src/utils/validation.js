/**
 * validation.js - Utilitários de Validação de Input
 * Última atualização: 2026-01-07
 */

/**
 * Valida formato de email
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se válido
 */
export const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Valida nome (displayName, nome de usuário, etc)
 * @param {string} name - Nome a ser validado
 * @param {number} minLength - Tamanho mínimo (padrão: 2)
 * @param {number} maxLength - Tamanho máximo (padrão: 100)
 * @returns {boolean} True se válido
 */
export const validateName = (name, minLength = 2, maxLength = 100) => {
  if (typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

/**
 * Valida texto genérico (descrições, mensagens, etc)
 * @param {string} text - Texto a ser validado
 * @param {number} maxLength - Tamanho máximo (padrão: 5000)
 * @param {boolean} allowEmpty - Permite texto vazio (padrão: false)
 * @returns {boolean} True se válido
 */
export const validateText = (text, maxLength = 5000, allowEmpty = false) => {
  if (typeof text !== 'string') return false;
  const trimmed = text.trim();
  
  if (!allowEmpty && trimmed.length === 0) return false;
  return trimmed.length <= maxLength;
};

/**
 * Valida telefone brasileiro (com ou sem código de país)
 * Formatos aceitos: (11) 91234-5678, 11912345678, +5511912345678
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} True se válido
 */
export const validatePhone = (phone) => {
  if (typeof phone !== 'string') return false;
  const phoneRegex = /^(\+55)?\s?(\()?\d{2}(\))?\s?\d{4,5}-?\d{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Valida URL (http/https)
 * @param {string} url - URL a ser validada
 * @returns {boolean} True se válido
 */
export const validateURL = (url) => {
  if (typeof url !== 'string') return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Valida dados de comerciante (merchant)
 * @param {Object} data - Dados do comerciante
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateBusinessData = (data) => {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Dados inválidos'] };
  }

  if (!validateName(data.name, 2, 200)) {
    errors.push('Nome do negócio deve ter entre 2 e 200 caracteres');
  }

  if (data.description && !validateText(data.description, 5000)) {
    errors.push('Descrição deve ter até 5000 caracteres');
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Telefone inválido (formato: (11) 91234-5678)');
  }

  if (data.email && !validateEmail(data.email)) {
    errors.push('Email inválido');
  }

  if (data.website && !validateURL(data.website)) {
    errors.push('Website deve ser uma URL válida (http:// ou https://)');
  }

  if (data.category && typeof data.category !== 'string') {
    errors.push('Categoria inválida');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Valida dados de anúncio (ad)
 * @param {Object} data - Dados do anúncio
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateAdData = (data) => {
  const errors = [];
  const validCategories = ['Vendas', 'Empregos', 'Imóveis', 'Serviços'];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Dados inválidos'] };
  }

  if (!validateName(data.title, 5, 150)) {
    errors.push('Título deve ter entre 5 e 150 caracteres');
  }

  if (!validateText(data.description, 2000)) {
    errors.push('Descrição deve ter entre 1 e 2000 caracteres');
  }

  if (!data.category || !validCategories.includes(data.category)) {
    errors.push(`Categoria deve ser: ${validCategories.join(', ')}`);
  }

  if (data.price !== undefined && data.price !== null) {
    if (typeof data.price !== 'number' || data.price < 0) {
      errors.push('Preço deve ser um número positivo');
    }
  }

  if (data.whatsapp && !validatePhone(data.whatsapp)) {
    errors.push('WhatsApp inválido');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Valida dados de usuário
 * @param {Object} data - Dados do usuário
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateUserData = (data) => {
  const errors = [];
  const validRoles = ['resident', 'merchant', 'admin', 'master'];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Dados inválidos'] };
  }

  if (!validateEmail(data.email)) {
    errors.push('Email inválido');
  }

  if (!validateName(data.displayName, 2, 100)) {
    errors.push('Nome deve ter entre 2 e 100 caracteres');
  }

  if (data.role && !validRoles.includes(data.role)) {
    errors.push(`Role deve ser: ${validRoles.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Sanitiza input removendo tags HTML e scripts
 * @param {string} input - Input a ser sanitizado
 * @returns {string} Input sanitizado
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    // Remove scripts
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove tags HTML
    .replace(/<[^>]*>?/gm, '')
    // Remove eventos inline
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Trim whitespace
    .trim();
};

/**
 * Sanitiza objeto completo recursivamente
 * @param {Object|Array|string} data - Dados a serem sanitizados
 * @returns {Object|Array|string} Dados sanitizados
 */
export const sanitizeObject = (data) => {
  if (typeof data === 'string') {
    return sanitizeInput(data);
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeObject(item));
  }

  if (data && typeof data === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }

  return data;
};

/**
 * Valida senha (força mínima)
 * @param {string} password - Senha a ser validada
 * @returns {Object} { valid: boolean, errors: string[], strength: number }
 */
export const validatePassword = (password) => {
  const errors = [];
  let strength = 0;

  if (typeof password !== 'string') {
    return { valid: false, errors: ['Senha inválida'], strength: 0 };
  }

  if (password.length < 6) {
    errors.push('Senha deve ter pelo menos 6 caracteres');
  } else {
    strength += 1;
  }

  if (password.length >= 8) {
    strength += 1;
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    strength += 1;
  }

  if (/\d/.test(password)) {
    strength += 1;
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    strength += 1;
  }

  return {
    valid: errors.length === 0,
    errors,
    strength // 0-5 (0: muito fraca, 5: muito forte)
  };
};
