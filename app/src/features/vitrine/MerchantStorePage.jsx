import { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { getMerchantById } from '../../services/merchantService';
import { getMerchantPosts } from '../../services/merchantPostsService';
import { PLANS_CONFIG } from '../../constants/plans';
import { useToast } from '../../components/Toast';
import { cleanWhatsapp } from '../../utils/whatsapp';
import StoreHero from './store-parts/StoreHero';
import StoreQuickActions from './store-parts/StoreQuickActions';
import StoreCatalog from './store-parts/StoreCatalog';
import StoreStickyCTA from './store-parts/StoreStickyCTA';
import { StoreAbout, StoreHours, StoreLocation, StoreExternalUrl, StoreSocialLinks } from './store-parts/StoreInfoBlocks';
import { resolveTheme } from './store-parts/storeThemes';
import { StoreReviews } from './store-parts/StoreReviews';
import PostDetailSheet from './PostDetailSheet';

export default function MerchantStorePage({ merchant: initialMerchant, onBack }) {
  const showToast = useToast();
  const [merchant, setMerchant] = useState(initialMerchant?._needsFetch ? null : initialMerchant);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      let m = merchant;
      if (!m) {
        m = await getMerchantById(initialMerchant.id);
        if (cancelled) return;
        if (!m) { onBack(); return; }
        setMerchant(m);
      }
      const planConfig = PLANS_CONFIG[m.plan || 'free'] || PLANS_CONFIG.free;
      if (!planConfig.hasVitrineStore) { onBack(); return; }
      const data = await getMerchantPosts(m.id);
      if (cancelled) return;
      setPosts((data || []).filter((p) => p.is_active));
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [initialMerchant?.id]);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(([e]) => setStickyVisible(!e.isIntersecting), { threshold: 0 });
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const plan = merchant?.plan || 'free';
  const planConfig = PLANS_CONFIG[plan] || PLANS_CONFIG.free;
  const storeColor = merchant?.store_color || '#4f46e5';
  const theme = resolveTheme(merchant?.store_theme || 'negocios');
  const hasStickyWA = planConfig.hasVitrineProductCTA && merchant?.whatsapp;

  const filteredPosts = useMemo(
    () => (filter === 'all' ? posts : posts.filter((p) => p.type === filter)),
    [posts, filter]
  );

  function handleShare() {
    if (!merchant) return;
    const base = window.location.origin + window.location.pathname.replace(/\/$/, '');
    const url = `${base}/?store=${merchant.id}`;
    if (navigator.share) {
      navigator.share({ title: merchant.name, text: merchant.store_tagline || merchant.name, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => showToast('Link copiado!', 'success'));
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`Confira a loja ${merchant.name}: ${url}`)}`);
    }
  }

  if (loading || !merchant) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="h-56 bg-gray-200 animate-pulse" />
        <div className="p-4 grid grid-cols-2 gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${hasStickyWA ? 'pb-32' : 'pb-20'}`}>
      <div className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300 ${stickyVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="h-14 flex items-center px-4 gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform cursor-pointer">
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {merchant.image_url && (
              <img src={merchant.image_url} alt={merchant.name} className="w-7 h-7 rounded-lg object-cover flex-shrink-0" />
            )}
            <span className="font-bold text-sm text-gray-900 truncate">{merchant.name}</span>
          </div>
          {merchant.whatsapp && (
            <a
              href={`https://wa.me/${cleanWhatsapp(merchant.whatsapp)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3 rounded-xl bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0"
            >
              <MessageCircle size={14} /> WA
            </a>
          )}
        </div>
      </div>

      <div ref={heroRef}>
        <StoreHero merchant={merchant} theme={theme} storeColor={storeColor} onBack={onBack} onShare={handleShare} />
      </div>
      <StoreQuickActions merchant={merchant} />
      <StoreAbout merchant={merchant} storeColor={storeColor} />
      <StoreHours merchant={merchant} storeColor={storeColor} />
      <StoreLocation merchant={merchant} storeColor={storeColor} />
      <StoreExternalUrl merchant={merchant} storeColor={storeColor} />
      <StoreSocialLinks merchant={merchant} storeColor={storeColor} />
      <StoreCatalog
        posts={filteredPosts}
        activeFilter={filter}
        onFilterChange={setFilter}
        merchant={merchant}
        planConfig={planConfig}
        theme={theme}
        storeColor={storeColor}
        onPostClick={setSelectedPost}
      />
      {planConfig.hasStoreReviews && (
        <StoreReviews
          merchant={merchant}
          storeColor={storeColor}
          planConfig={planConfig}
        />
      )}
      {hasStickyWA && <StoreStickyCTA merchant={merchant} />}
      {selectedPost && (
        <PostDetailSheet
          post={selectedPost}
          merchant={merchant}
          storeColor={storeColor}
          theme={theme}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
