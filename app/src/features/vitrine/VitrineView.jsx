import { useState, useEffect, useMemo } from 'react';
import { Store, Crown, Search } from 'lucide-react';
import { getVitrineStoreMerchants } from '../../services/merchantService';
import CouponsCarousel from '../merchants/CouponsCarousel';
import StoreStoriesBar from './StoreStoriesBar';
import StorePremiumCard from './StorePremiumCard';
import StoreProCard from './StoreProCard';
import { categories } from '../../constants/categories';
import { PageHero, SearchBar, CategoryChips } from '../../components/mobile';

const SectionTitle = ({ icon: Icon, title, iconClass }) => (
  <div className="flex items-center gap-1.5 px-4 pt-4 pb-2">
    <Icon size={14} className={iconClass} />
    <h2 className="text-sm font-bold text-gray-800">{title}</h2>
  </div>
);

const VitrineSkeleton = () => (
  <div className="px-4 animate-pulse">
    <div className="mt-6 h-60 bg-gray-200 rounded-2xl mb-4" />
    <div className="h-60 bg-gray-200 rounded-2xl mb-8" />
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-44 bg-gray-200 rounded-xl" />
      ))}
    </div>
  </div>
);

const Header = ({ searchTerm, setSearchTerm, activeCategory, setActiveCategory }) => (
  <header className="sticky top-14 z-30 mobile-sticky-panel pb-2 shadow-sm">
    <PageHero
      section="vitrine"
      title="Vitrine do Bairro"
      subtitle="Explore as lojas da região"
      icon={Store}
      imageSrc="/vitrine-bg.png"
      compact
    />

    <div className="px-3 pt-3 space-y-2">
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar loja por nome ou categoria..."
      />
      <CategoryChips
        items={categories}
        value={activeCategory}
        onChange={setActiveCategory}
        section="vitrine"
        getId={(item) => item.id}
        getLabel={(item) => item.label}
        getIcon={(item) => item.icon}
      />
    </div>
  </header>
);

export default function VitrineView({ onMerchantClick, onStoreClick, onViewCoupons }) {
  const neighborhood = import.meta.env.VITE_NEIGHBORHOOD;
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    let isMounted = true;
    getVitrineStoreMerchants(neighborhood).then(data => {
      if (isMounted) {
        setMerchants(data || []);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [neighborhood]);

  const filteredMerchants = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();

    return merchants.filter(m => {
      const matchSearch = !normalizedSearch ||
        m.name?.toLowerCase().includes(normalizedSearch) ||
        m.category?.toLowerCase().includes(normalizedSearch) ||
        m.store_tagline?.toLowerCase().includes(normalizedSearch);
      const matchCat = activeCategory === 'Todos' ||
        m.category?.toLowerCase().includes(activeCategory.toLowerCase());
      return matchSearch && matchCat;
    }).sort((a, b) => {
      const priority = { premium: 4, pro: 3, basic: 2, free: 1 };
      return (priority[b.plan] ?? 2) - (priority[a.plan] ?? 2);
    });
  }, [merchants, searchTerm, activeCategory]);

  const { premiumMerchants, proMerchants } = useMemo(() => {
    return {
      premiumMerchants: merchants.filter(m => m.plan === 'premium'),
      proMerchants: merchants.filter(m => m.plan === 'pro')
    };
  }, [merchants]);

  if (loading) return (
    <div className="mobile-page bg-gray-50 pb-20">
      <Header searchTerm="" setSearchTerm={() => {}} activeCategory="Todos" setActiveCategory={() => {}} />
      <VitrineSkeleton />
    </div>
  );

  const isFiltering = searchTerm || activeCategory !== 'Todos';

  return (
    <div className="mobile-page bg-gray-50 pb-20">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <main className="mt-2">
        {!isFiltering && <CouponsCarousel onMerchantClick={onMerchantClick} onViewAll={onViewCoupons} />}

        {isFiltering ? (
          <section className="mt-4">
            <div className="px-4 pb-2 flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide truncate">
                {searchTerm ? `Resultados para "${searchTerm}"` : activeCategory}
              </h2>
              <span className="text-xs text-gray-400 shrink-0">
                {filteredMerchants.length} encontrada{filteredMerchants.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filteredMerchants.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20 px-8">
                <Search size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Nenhuma loja encontrada</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Tente ajustar a sua busca ou o filtro de categoria.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredMerchants.map(m => (
                  m.plan === 'premium' ? (
                    <StorePremiumCard key={m.id} merchant={m} onStoreClick={onStoreClick} />
                  ) : (
                    <div key={m.id} className="px-4">
                      <StoreProCard merchant={m} onStoreClick={onStoreClick} />
                    </div>
                  )
                ))}
              </div>
            )}
          </section>
        ) : (
          merchants.length > 0 ? (
            <>
              <StoreStoriesBar merchants={merchants} onStoreClick={onStoreClick} />

              {premiumMerchants.length > 0 && (
                <section className="mb-6">
                  <SectionTitle icon={Crown} title="Lojas em Destaque" iconClass="text-amber-500" />
                  {premiumMerchants.map(m => (
                    <StorePremiumCard key={m.id} merchant={m} onStoreClick={onStoreClick} />
                  ))}
                </section>
              )}

              {proMerchants.length > 0 && (
                <section className="mb-6">
                  <SectionTitle icon={Store} title="Lojas Pro" iconClass="text-indigo-500" />
                  <div className="grid grid-cols-2 gap-3 px-4">
                    {proMerchants.map(m => (
                      <StoreProCard key={m.id} merchant={m} onStoreClick={onStoreClick} />
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-20 px-8">
              <Store size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900">Nenhuma loja disponível ainda</h3>
              <p className="text-sm text-gray-500 mt-2">
                Em breve teremos lojas incríveis para você explorar nesta região.
              </p>
            </div>
          )
        )}
      </main>
    </div>
  );
}
