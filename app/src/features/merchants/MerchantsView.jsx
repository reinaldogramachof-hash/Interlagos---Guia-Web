import { useMemo } from 'react';
import { Store, MapPin, Star, ShieldCheck } from 'lucide-react';
import { PLANS_CONFIG } from '../../constants/plans';
import { SkeletonCard } from '../../components/SkeletonCard';
import EmptyState from '../../components/EmptyState';
import PremiumCarousel from './PremiumCarousel';
import ProCarousel from './ProCarousel';
import CouponsCarousel from './CouponsCarousel';
import NeighborhoodFeed from './NeighborhoodFeed';
import useMerchantStore from '../../stores/merchantStore';
import { categories } from '../../constants/categories';
import { PageHero, SearchBar, CategoryChips, SectionHeader } from '../../components/mobile';

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

const PLAN_LABEL = {
  premium: { label: 'Premium', bg: 'bg-amber-50', text: 'text-amber-700' },
  pro: { label: 'Pro', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  basic: { label: 'Básico', bg: 'bg-gray-100', text: 'text-gray-600' },
  free: { label: 'Grátis', bg: 'bg-gray-50', text: 'text-gray-400' },
};

export default function MerchantsView({ merchants, loading, selectedCategory, searchTerm, onMerchantClick, onViewCoupons }) {
  const setSearchTerm = useMerchantStore(state => state.setSearchTerm);
  const setSelectedCategory = useMerchantStore(state => state.setSelectedCategory);

  const premiumMerchants = useMemo(
    () => merchants.filter(m => m.plan === 'premium'),
    [merchants]
  );
  const proMerchants = useMemo(
    () => merchants.filter(m => m.plan === 'pro'),
    [merchants]
  );
  const showCarousels = selectedCategory === 'Todos' && !searchTerm;

  const filteredMerchants = useMemo(() => {
    const normalizedSearch = searchTerm?.toLowerCase() || '';

    return merchants
      .filter(m => {
        const matchesCategory = selectedCategory === 'Todos' || m.category === selectedCategory;
        const matchesSearch = !normalizedSearch ||
          m.name?.toLowerCase().includes(normalizedSearch) ||
          m.description?.toLowerCase().includes(normalizedSearch);
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const priority = { premium: 4, pro: 3, basic: 2, free: 1 };
        return (priority[b.plan] ?? 2) - (priority[a.plan] ?? 2);
      });
  }, [merchants, selectedCategory, searchTerm]);

  return (
    <div className="mobile-page">
      <div className="sticky top-14 z-20 mobile-sticky-panel pb-2 shadow-sm">
        <PageHero
          section="merchants"
          title="Comércio Local"
          subtitle="Apoie os negócios do bairro"
          icon={Store}
          imageSrc="/banner-comercio.svg"
          compact
        />

        <div className="px-3 pt-3 space-y-2">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar comércio ou serviço..."
          />
          <CategoryChips
            items={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            section="merchants"
            getId={(item) => item.id}
            getLabel={(item) => item.label}
          />
        </div>
      </div>

      {showCarousels && (
        <CouponsCarousel onMerchantClick={onMerchantClick} onViewAll={onViewCoupons} />
      )}

      {showCarousels && premiumMerchants.length > 0 && (
        <PremiumCarousel merchants={premiumMerchants} onMerchantClick={onMerchantClick} />
      )}
      {showCarousels && proMerchants.length > 0 && (
        <ProCarousel merchants={proMerchants} onMerchantClick={onMerchantClick} />
      )}
      {showCarousels && (
        <NeighborhoodFeed onMerchantClick={onMerchantClick} />
      )}

      <SectionHeader
        title={searchTerm
          ? `Resultados para "${searchTerm}"`
          : selectedCategory !== 'Todos'
            ? selectedCategory
            : 'Todos os estabelecimentos'}
        subtitle={`${filteredMerchants.length} encontrado${filteredMerchants.length !== 1 ? 's' : ''}`}
      />

      {loading ? (
        <SkeletonCard count={5} />
      ) : filteredMerchants.length === 0 ? (
        <EmptyState
          icon={<Store className="text-gray-400" size={28} />}
          title="Nenhum resultado"
          description={`Não encontramos nada para "${searchTerm || selectedCategory}".`}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 px-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredMerchants.map(merchant => {
            const plan = PLAN_LABEL[merchant.plan] ?? PLAN_LABEL.basic;
            return (
              <div
                key={merchant.id}
                onClick={() => onMerchantClick(merchant)}
                className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all active:scale-[0.99]"
              >
                <div className="w-16 h-16 rounded-full border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50">
                  {merchant.image_url || merchant.image ? (
                    <img
                      src={merchant.image_url || merchant.image}
                      alt={merchant.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-300 bg-gray-100">
                      {merchant.name?.[0] ?? <Store size={22} />}
                    </div>
                  )}
                </div>

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
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {merchant.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.bg} ${plan.text}`}>
                      {plan.label}
                    </span>
                    {(merchant.plan === 'pro' || merchant.plan === 'premium') && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                        <Star size={10} fill="currentColor" /> Destaque
                      </span>
                    )}
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
