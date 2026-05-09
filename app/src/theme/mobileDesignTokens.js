export const sectionThemes = {
  news: {
    id: 'news',
    label: 'Jornal',
    accent: 'indigo',
    iconBg: 'bg-indigo-500/15',
    iconText: 'text-white',
    chipActive: 'bg-brand-600 text-white shadow-brand-600/10',
    badge: 'bg-indigo-50 text-indigo-700',
    heroGradient: 'from-indigo-950/90 via-indigo-900/60 to-transparent',
  },
  vitrine: {
    id: 'vitrine',
    label: 'Vitrine',
    accent: 'amber',
    iconBg: 'bg-white/10',
    iconText: 'text-white',
    chipActive: 'bg-brand-600 text-white shadow-brand-600/10',
    badge: 'bg-amber-50 text-amber-700',
    heroGradient: 'from-violet-950/90 via-violet-900/60 to-transparent',
  },
  merchants: {
    id: 'merchants',
    label: 'Comércios',
    accent: 'emerald',
    iconBg: 'bg-white/10',
    iconText: 'text-white',
    chipActive: 'bg-brand-600 text-white shadow-brand-600/10',
    badge: 'bg-emerald-50 text-emerald-700',
    heroGradient: 'from-indigo-950/85 via-indigo-900/45 to-transparent',
  },
  ads: {
    id: 'ads',
    label: 'Classificados',
    accent: 'orange',
    iconBg: 'bg-white/10',
    iconText: 'text-white',
    chipActive: 'bg-brand-600 text-white shadow-brand-600/10',
    badge: 'bg-orange-50 text-orange-700',
    heroGradient: 'from-violet-950/90 via-violet-900/60 to-transparent',
  },
  campaigns: {
    id: 'campaigns',
    label: 'Campanhas',
    accent: 'rose',
    iconBg: 'bg-white/10',
    iconText: 'text-white',
    chipActive: 'bg-brand-600 text-white shadow-brand-600/10',
    badge: 'bg-rose-50 text-rose-700',
    heroGradient: 'from-rose-950/85 via-rose-900/55 to-transparent',
  },
};

export const mobileUi = {
  page: {
    background: 'bg-gray-50',
    bottomPadding: 'pb-24',
    horizontalPadding: 'px-3',
  },
  hero: {
    height: 'h-28',
    compactHeight: 'h-24',
    overlayPadding: 'px-5',
    iconBox: 'bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20',
    title: 'text-xl font-black text-white leading-tight tracking-tight',
    subtitle: 'text-indigo-100 text-[10px] font-bold uppercase tracking-wider',
  },
  search: {
    wrapper: 'relative',
    input: 'w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-full text-base md:text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm',
    icon: 'absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400',
    clearButton: 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors',
  },
  chips: {
    row: 'flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-3 px-3',
    item: 'flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap min-h-[36px] inline-flex items-center gap-1.5',
    inactive: 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300',
  },
  card: {
    base: 'bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden',
    interactive: 'transition-all active:scale-[0.99] hover:shadow-md',
    body: 'p-3',
  },
  badge: {
    base: 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
    soft: 'bg-gray-100 text-gray-600',
  },
};

export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}
