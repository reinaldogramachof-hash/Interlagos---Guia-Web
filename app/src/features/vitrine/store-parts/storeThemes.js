export const STORE_THEMES = {
  negocios: {
    heroOverlay: 'from-slate-900/80 via-slate-800/50 to-slate-900/10',
    cardCls: 'bg-white border border-gray-100 shadow-sm rounded-2xl',
    ctaBg: 'bg-indigo-600 hover:bg-indigo-700',
    priceCls: 'text-indigo-600',
  },
  mercado: {
    heroOverlay: 'from-green-950/85 via-green-800/50 to-green-900/10',
    cardCls: 'bg-white border border-green-100 shadow-sm rounded-xl',
    ctaBg: 'bg-emerald-600 hover:bg-emerald-700',
    priceCls: 'text-emerald-600',
  },
  atelier: {
    heroOverlay: 'from-pink-950/75 via-rose-800/40 to-pink-900/10',
    cardCls: 'bg-white border border-pink-100 shadow-md rounded-3xl',
    ctaBg: 'bg-pink-600 hover:bg-pink-700',
    priceCls: 'text-pink-600',
  },
  'dark-tech': {
    heroOverlay: 'from-gray-950/95 via-gray-800/65 to-gray-900/15',
    cardCls: 'bg-white/85 backdrop-blur-sm border border-gray-200/60 shadow-lg rounded-2xl',
    ctaBg: 'bg-amber-500 hover:bg-amber-600',
    priceCls: 'text-amber-600',
  },
  luxury: {
    heroOverlay: 'from-black/85 via-black/50 to-black/10',
    cardCls: 'bg-white border-0 shadow-xl rounded-3xl',
    ctaBg: 'bg-gray-900 hover:bg-black',
    priceCls: 'text-gray-900',
  },
  vibrante: {
    heroOverlay: 'from-violet-950/85 via-fuchsia-800/55 to-violet-900/10',
    cardCls: 'bg-white border border-violet-100 shadow-md rounded-2xl',
    ctaBg: 'bg-violet-600 hover:bg-violet-700',
    priceCls: 'text-violet-600',
  },
};

export function resolveTheme(name) {
  return STORE_THEMES[name] || STORE_THEMES.negocios;
}

export const POST_FILTERS = [
  { id: 'all', label: 'Tudo' },
  { id: 'product', label: 'Produtos' },
  { id: 'service', label: 'Serviços' },
  { id: 'news', label: 'Novidades' },
  { id: 'promo', label: 'Promoções' },
];
