import { Search, Store, MapPin, X, Star, ShieldCheck } from 'lucide-react';
import { PLANS_CONFIG } from '../../constants/plans';
import { SkeletonCard } from '../../components/SkeletonCard';
import EmptyState from '../../components/EmptyState';
import PremiumCarousel from './PremiumCarousel';
import ProCarousel from './ProCarousel';
import CouponsCarousel from './CouponsCarousel';
import NeighborhoodFeed from './NeighborhoodFeed';
import useMerchantStore from '../../stores/merchantStore';
import { categories } from '../../constants/categories';

// Badge de status: Aberto entre 7h e 22h (lógica de frontend mockada)
function isOpen() {
  const h = new Date().getHours();
  return h >= 7 && h < 22;
}

function OpenBadge() {
  const open = isOpen();
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${open
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-600'
      }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`} />
      {open ? 'Aberto' : 'Fechado'}
    </span>
  );
}

// Converte nome do plano em label display
const PLAN_LABEL = {
  premium: { label: 'Premium', bg: 'bg-amber-50', text: 'text-amber-700' },
  pro: { label: 'Pro', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  basic: { label: 'Básico', bg: 'bg-gray-100', text: 'text-gray-600' },
  free: { label: 'Grátis', bg: 'bg-gray-50', text: 'text-gray-400' },
};

export default function MerchantsView({ merchants, loading, selectedCategory, searchTerm, onMerchantClick, onViewCoupons }) {
  const setSearchTerm = useMerchantStore(state => state.setSearchTerm);
  const setSelectedCategory = useMerchantStore(state => state.setSelectedCategory);

  const premiumMerchants = merchants.filter(m => m.plan === 'premium');
  const proMerchants = merchants.filter(m => m.plan === 'pro');
  const showCarousels = selectedCategory === 'Todos' && !searchTerm;

  const filteredMerchants = merchants
    .filter(m => {
      const matchesCategory = selectedCategory === 'Todos' || m.category === selectedCategory;
      const matchesSearch = m.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchTerm?.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priority = { premium: 4, pro: 3, basic: 2, free: 1 };
      return (priority[b.plan] ?? 2) - (priority[a.plan] ?? 2);
    });

  return (
    <div className="pb-4">
      {/* Cabecalho Fixo Integrado */}
      <div className="sticky top-14 z-20 bg-gray-50/95 backdrop-blur-md pb-2 shadow-sm border-b border-gray-200">
        {/* Banner Simples Home */}
        <div className="relative h-24 overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800"
                alt="Comércios Locais"
                className="w-full h-full object-cover"
                loading="eager"
                fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-indigo-900/60 to-transparent flex items-center justify-between px-5">
                <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/20">
                        <Store size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white leading-tight tracking-tight">Comércio Local</h2>
                        <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-wider">Apoie os negócios do bairro</p>
                    </div>
                </div>
            </div>
        </div>

        {/* ── Busca + Filtros ── */}
        <div className="px-3 pt-3 space-y-2">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar comércio ou serviço..."
              className="w-full pl-9 pr-9 py-2 bg-white border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-3 px-3 lg:mx-0 lg:px-0">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap min-h-[36px] flex items-center ${selectedCategory === cat.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cupons & Ofertas ── */}
      {showCarousels && (
        <CouponsCarousel onMerchantClick={onMerchantClick} onViewAll={onViewCoupons} />
      )}

      {/* ── Carrosséis de Destaque (preservados) ── */}
      {showCarousels && premiumMerchants.length > 0 && (
        <PremiumCarousel merchants={premiumMerchants} onMerchantClick={onMerchantClick} />
      )}
      {showCarousels && proMerchants.length > 0 && (
        <ProCarousel merchants={proMerchants} onMerchantClick={onMerchantClick} />
      )}
      {showCarousels && (
        <NeighborhoodFeed onMerchantClick={onMerchantClick} />
      )}

      {/* ── Título da seção ── */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
          {searchTerm
            ? `Resultados para "${searchTerm}"`
            : selectedCategory !== 'Todos'
              ? selectedCategory
              : 'Todos os estabelecimentos'}
        </h2>
        <span className="text-xs text-gray-400">
          {filteredMerchants.length} encontrado{filteredMerchants.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Lista estilo iFood ── */}
      {loading ? (
        <SkeletonCard count={5} />
      ) : filteredMerchants.length === 0 ? (
        <EmptyState
          icon={<Search className="text-gray-400" size={28} />}
          title="Nenhum resultado"
          description={`Não encontramos nada para "${searchTerm || selectedCategory}".`}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 px-3">
          {filteredMerchants.map(merchant => {
            const plan = PLAN_LABEL[merchant.plan] ?? PLAN_LABEL.basic;
            return (
              <div
                key={merchant.id}
                onClick={() => onMerchantClick(merchant)}
                className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all active:scale-[0.99]"
              >
                {/* Avatar redondo */}
                <div className="w-16 h-16 rounded-full border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50">
                  {merchant.image_url || merchant.image ? (
                    <img
                      src={merchant.image_url || merchant.image}
                      alt={merchant.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-300 bg-gray-100">
                      {merchant.name?.[0] ?? <Store size={22} />}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight truncate flex items-center gap-1">
                      {merchant.name}
                      {(PLANS_CONFIG[merchant.plan]?.hasVerifiedBadge) && (
                        <ShieldCheck size={14} className="text-amber-500 shrink-0" title="Verificado" />
                      )}
                    </h3>
                    <OpenBadge />
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
                    {merchant.description || 'Estabelecimento local no Parque Interlagos.'}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Categoria */}
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {merchant.category}
                    </span>
                    {/* Plano */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.bg} ${plan.text}`}>
                      {plan.label}
                    </span>
                    {/* Badge de destaque pro/premium */}
                    {(merchant.plan === 'pro' || merchant.plan === 'premium') && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                        <Star size={10} fill="currentColor" /> Destaque
                      </span>
                    )}
                    {/* Endereço resumido */}
                    {merchant.address && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5 truncate max-w-[120px]">
                        <MapPin size={9} />
                        {merchant.address.split('-')[0].trim()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
