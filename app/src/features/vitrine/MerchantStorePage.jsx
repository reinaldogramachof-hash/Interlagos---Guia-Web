import { useState, useEffect, useMemo } from 'react';
import { getMerchantById } from '../../services/merchantService';
import { getMerchantPosts } from '../../services/merchantPostsService';
import { PLANS_CONFIG } from '../../constants/plans';
import { useToast } from '../../components/Toast';
import StoreHero from './store-parts/StoreHero';
import StoreQuickActions from './store-parts/StoreQuickActions';
import StoreCatalog from './store-parts/StoreCatalog';
import StoreStickyCTA from './store-parts/StoreStickyCTA';
import { StoreAbout, StoreHours, StoreLocation, StoreExternalUrl } from './store-parts/StoreInfoBlocks';
import { resolveTheme } from './store-parts/storeThemes';

export default function MerchantStorePage({ merchant: initialMerchant, onBack, onMerchantClick }) {
  const showToast = useToast();
  const [merchant, setMerchant] = useState(initialMerchant?._needsFetch ? null : initialMerchant);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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
      <StoreHero merchant={merchant} theme={theme} storeColor={storeColor} onBack={onBack} onShare={handleShare} />
      <StoreQuickActions merchant={merchant} />
      <StoreAbout merchant={merchant} storeColor={storeColor} />
      <StoreHours merchant={merchant} storeColor={storeColor} />
      <StoreLocation merchant={merchant} storeColor={storeColor} />
      <StoreExternalUrl merchant={merchant} storeColor={storeColor} />
      <StoreCatalog
        posts={filteredPosts}
        activeFilter={filter}
        onFilterChange={setFilter}
        merchant={merchant}
        planConfig={planConfig}
        theme={theme}
        storeColor={storeColor}
        onMerchantClick={onMerchantClick}
      />
      {hasStickyWA && <StoreStickyCTA merchant={merchant} />}
    </div>
  );
}
