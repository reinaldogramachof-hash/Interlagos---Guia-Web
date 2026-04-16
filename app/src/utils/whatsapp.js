/** Normaliza número de WhatsApp para formato internacional com DDI 55 */
export function cleanWhatsapp(raw = '') {
  const digits = raw.replace(/\D/g, '');
  return digits.startsWith('55') ? digits : `55${digits}`;
}
