import { useState, useEffect, useMemo } from 'react';
import { Store, ImageIcon, Crown } from 'lucide-react';
import { getNeighborhoodPosts } from '../../services/merchantPostsService';
import CouponsCarousel from '../merchants/CouponsCarousel';
import { PageHero, CategoryChips, SectionHeader } from '../../components/mobile';

const TYPE_BADGE = {
  product: { label: 'Produto', cls: 'bg-blue-100 text-blue-700' },
  service: { label: 'Serviço', cls: 'bg-amber-100 text-amber-700' },
  news:    { label: 'Novidade', cls: 'bg-emerald-100 text-emerald-700' },
  promo:   { label: 'Promoção', cls: 'bg-indigo-100 text-indigo-700' },
};

const PLAN_BADGE = {
  premium: { label: '⭐ Premium', cls: 'bg-white/95 text-amber-600 ring-1 ring-amber-400 shadow-sm' },
  pro:     { label: 'Pro',       cls: 'bg-white/95 text-indigo-600 ring-1 ring-indigo-400 shadow-sm' },
};

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'product', label: 'Produtos' },
  { id: 'service', label: 'Serviços' },
  { id: 'news', label: 'Novidades' },
  { id: 'promo', label: 'Promoções' },
];

function buildMerchantObj(post) {
  return {
    id: post.merchant_id,
    name: post.merchants?.name,
    plan: post.merchants?.plan,
    image_url: post.merchants?.image_url,
    category: post.merchants?.category,
    whatsapp: post.merchants?.whatsapp,
    store_color: post.merchants?.store_color,
    store_cover_url: post.merchants?.store_cover_url,
    store_tagline: post.merchants?.store_tagline,
  };
}

export default function VitrineView({ onMerchantClick, onStoreClick, onViewCoupons }) {
  const neighborhood = import.meta.env.VITE_NEIGHBORHOOD;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    getNeighborhoodPosts(neighborhood, 60).then(data => {
      if (isMounted) { setPosts(data); setLoading(false); }
    });
    return () => { isMounted = false; };
  }, [neighborhood]);

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'all') return posts;
    return posts.filter(p => p.type === activeFilter);
  }, [posts, activeFilter]);

  const featuredMerchants = useMemo(() => {
    if (activeFilter !== 'all') return [];
    const seen = new Set();
    return posts
      .filter(p => p.merchants?.plan === 'premium' && !seen.has(p.merchant_id) && seen.add(p.merchant_id))
      .map(buildMerchantObj);
  }, [posts, activeFilter]);

  function handleCardClick(post) {
    const plan = post.merchants?.plan || 'free';
    const merchant = buildMerchantObj(post);
    if ((plan === 'pro' || plan === 'premium') && onStoreClick) {
      onStoreClick(merchant);
    } else {
      onMerchantClick(merchant);
    }
  }

  return (
    <div className="mobile-page bg-gray-50">
      <header className="sticky top-14 z-30 mobile-sticky-panel pb-2 shadow-sm">
        <PageHero
          section="vitrine"
          title="Vitrine do Bairro"
          subtitle="Explore as lojas da região"
          icon={Store}
          compact
        />

        <div className="px-3 pt-3">
          <CategoryChips
            items={FILTERS}
            value={activeFilter}
            onChange={setActiveFilter}
            section="vitrine"
            getId={(item) => item.id}
            getLabel={(item) => item.label}
          />
        </div>
      </header>

      <CouponsCarousel onMerchantClick={onMerchantClick} onViewAll={onViewCoupons} />

      {featuredMerchants.length > 0 && (
        <section className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-1.5 mb-3">
            <Crown size={14} className="text-amber-500" />
            <h2 className="text-sm font-bold text-gray-700">Lojas em Destaque</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {featuredMerchants.map(m => (
              <div key={m.id} onClick={() => onStoreClick?.(m)}
                className="w-40 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-transform shadow-sm border border-gray-100 bg-white">
                <div className="h-20 relative"
                  style={{ background: m.store_cover_url ? undefined : (m.store_color || '#4f46e5') }}>
                  {m.store_cover_url && (
                    <img src={m.store_cover_url} alt={m.name} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute bottom-0 left-3 translate-y-1/2 w-10 h-10 rounded-full border-2 border-white shadow bg-gray-100 overflow-hidden">
                    {m.image_url
                      ? <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Store size={12} className="text-gray-400" /></div>}
                  </div>
                </div>
                <div className="pt-5 px-3 pb-2">
                  <p className="font-bold text-xs text-gray-900 truncate">{m.name}</p>
                  <span className="text-[10px] font-bold text-amber-600">⭐ Premium</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <SectionHeader
        title={activeFilter === 'all' ? 'Publicações da Vitrine' : FILTERS.find(f => f.id === activeFilter)?.label}
        subtitle={`${filteredPosts.length} item${filteredPosts.length !== 1 ? 's' : ''}`}
      />

      <main className="p-4 pt-1">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="w-full aspect-square bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPosts.map(post => {
              const typeBadge = TYPE_BADGE[post.type] ?? TYPE_BADGE.product;
              const plan = post.merchants?.plan?.toLowerCase() || 'basic';
              const planBadge = PLAN_BADGE[plan];
              return (
                <div key={post.id}
                  className="flex flex-col cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => handleCardClick(post)}>
                  <div className="relative mb-2">
                    {post.image_url ? (
                      <img src={post.image_url} alt={post.title} loading="lazy"
                        className="w-full aspect-square object-cover rounded-xl bg-gray-100" />
                    ) : (
                      <div className="w-full aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
                        <ImageIcon size={28} className="text-gray-300" />
                      </div>
                    )}
                    <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${typeBadge.cls}`}>
                      {typeBadge.label}
                    </span>
                    {planBadge && (
                      <span className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${planBadge.cls}`}>
                        {planBadge.label}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight">{post.title}</h3>
                  {post.price != null && (
                    <p className="text-emerald-600 font-bold text-xs mt-0.5">
                      R$ {Number(post.price).toLocaleString('pt-BR')}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 truncate mt-1">{post.merchants?.name}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Store size={32} className="text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-bold mb-1">Nenhuma vitrine ainda</h3>
            <p className="text-sm text-gray-500 max-w-[250px]">
              Os comerciantes ainda não publicaram produtos ou serviços.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
