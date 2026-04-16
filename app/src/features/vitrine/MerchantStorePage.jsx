import { useState, useEffect } from 'react';
import { ArrowLeft, Share2, ImageIcon, Crown, ExternalLink, MessageCircle } from 'lucide-react';
import { getMerchantById } from '../../services/merchantService';
import { getMerchantPosts } from '../../services/merchantPostsService';
import { PLANS_CONFIG } from '../../constants/plans';
import { useToast } from '../../components/Toast';
import StoreProductCard from './StoreProductCard';
import { cleanWhatsapp } from '../../utils/whatsapp';

const STORE_THEMES = {
  negocios:    { heroOverlay: 'from-slate-900/80 via-slate-800/50 to-slate-900/10', cardCls: 'bg-white border border-gray-100 shadow-sm rounded-2xl',                    ctaBg: 'bg-indigo-600 hover:bg-indigo-700',   priceCls: 'text-indigo-600'  },
  mercado:     { heroOverlay: 'from-green-950/85 via-green-800/50 to-green-900/10', cardCls: 'bg-white border border-green-100 shadow-sm rounded-xl',                     ctaBg: 'bg-emerald-600 hover:bg-emerald-700', priceCls: 'text-emerald-600' },
  atelier:     { heroOverlay: 'from-pink-950/75 via-rose-800/40 to-pink-900/10',    cardCls: 'bg-white border border-pink-100 shadow-md rounded-3xl',                      ctaBg: 'bg-pink-600 hover:bg-pink-700',       priceCls: 'text-pink-600'    },
  'dark-tech': { heroOverlay: 'from-gray-950/95 via-gray-800/65 to-gray-900/15',    cardCls: 'bg-white/85 backdrop-blur-sm border border-gray-200/60 shadow-lg rounded-2xl', ctaBg: 'bg-amber-500 hover:bg-amber-600',   priceCls: 'text-amber-600'   },
  luxury:      { heroOverlay: 'from-black/85 via-black/50 to-black/10',             cardCls: 'bg-white border-0 shadow-xl rounded-3xl',                                    ctaBg: 'bg-gray-900 hover:bg-black',          priceCls: 'text-gray-900'    },
  vibrante:    { heroOverlay: 'from-violet-950/85 via-fuchsia-800/55 to-violet-900/10', cardCls: 'bg-white border border-violet-100 shadow-md rounded-2xl',                ctaBg: 'bg-violet-600 hover:bg-violet-700',   priceCls: 'text-violet-600'  },
};

export default function MerchantStorePage({ merchant: initialMerchant, onBack, onMerchantClick }) {
  const showToast = useToast();
  const [merchant, setMerchant] = useState(initialMerchant?._needsFetch ? null : initialMerchant);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      let m = merchant;
      if (!m) {
        m = await getMerchantById(initialMerchant.id);
        if (!m) { onBack(); return; }
        setMerchant(m);
      }
      const planConfig = PLANS_CONFIG[m.plan || 'free'] || PLANS_CONFIG.free;
      if (!planConfig.hasVitrineStore) { onBack(); return; }
      const data = await getMerchantPosts(m.id);
      setPosts((data || []).filter(p => p.is_active));
      setLoading(false);
    }
    load();
  }, [initialMerchant?.id]);

  const plan = merchant?.plan || 'free';
  const planConfig = PLANS_CONFIG[plan] || PLANS_CONFIG.free;
  const storeColor = merchant?.store_color || '#4f46e5';
  const theme = merchant?.store_theme || 'negocios';
  const t = STORE_THEMES[theme] || STORE_THEMES.negocios;
  const hasStickyWA = planConfig.hasVitrineProductCTA && merchant?.whatsapp;

  function handleShare() {
    const url = `https://temnobairro.online/interlagos/?store=${merchant.id}`;
    if (navigator.share) {
      navigator.share({ title: merchant.name, url }).catch(() => {});
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

      {/* HERO h-56 — nome e tagline DENTRO */}
      <div className="relative h-56 overflow-hidden"
        style={{ background: merchant.store_cover_url ? undefined : storeColor }}>
        {merchant.store_cover_url && (
          <img src={merchant.store_cover_url} alt="capa" className="w-full h-full object-cover" />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${t.heroOverlay}`} />

        <button onClick={onBack}
          className="absolute top-3 left-3 w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white active:scale-95 duration-150 cursor-pointer">
          <ArrowLeft size={18} />
        </button>
        <button onClick={handleShare}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white active:scale-95 duration-150 cursor-pointer">
          <Share2 size={18} />
        </button>

        {/* Nome + tagline no rodapé do hero */}
        <div className="absolute bottom-4 left-4 right-16">
          <h1 className="text-white font-black text-2xl leading-tight drop-shadow line-clamp-1">{merchant.name}</h1>
          {merchant.store_tagline && (
            <p className="text-white/75 text-sm mt-0.5 line-clamp-1">{merchant.store_tagline}</p>
          )}
        </div>
      </div>

      {/* PERFIL — avatar + badges */}
      <div className="-mt-8 px-4 flex items-end justify-between mb-3">
        <div className="flex items-end gap-3">
          <div className="w-16 h-16 rounded-2xl border-2 border-white shadow-lg overflow-hidden flex-shrink-0"
            style={{ background: storeColor }}>
            {merchant.image_url
              ? <img src={merchant.image_url} alt={merchant.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={22} className="text-white/60" /></div>}
          </div>
          <div className="pb-1">
            <span className="text-[10px] font-bold text-indigo-600 bg-white border border-indigo-100 px-2 py-0.5 rounded-full shadow-sm">
              {merchant.category}
            </span>
          </div>
        </div>
        {planConfig.hasVitrineBadge && (
          <div className="pb-1">
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Crown size={11} /> Premium
            </span>
          </div>
        )}
      </div>

      {/* FAIXA PREMIUM */}
      {planConfig.hasVitrineBadge && merchant.store_badge_text && (
        <div className="mx-4 mb-3 px-4 py-2.5 rounded-xl text-white font-bold text-sm shadow-sm" style={{ background: storeColor }}>
          {merchant.store_badge_text}
        </div>
      )}

      {/* LINKS RÁPIDOS */}
      <div className="px-4 flex gap-2 flex-wrap mb-4">
        {merchant.whatsapp && (
          <a href={`https://wa.me/${cleanWhatsapp(merchant.whatsapp)}`} target="_blank" rel="noopener noreferrer"
            className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200 min-h-[36px] flex items-center cursor-pointer">
            📱 WhatsApp
          </a>
        )}
        {merchant.instagram && (
          <a href={`https://instagram.com/${merchant.instagram}`} target="_blank" rel="noopener noreferrer"
            className="text-xs font-bold bg-pink-50 text-pink-700 px-3 py-1.5 rounded-full border border-pink-200 min-h-[36px] flex items-center cursor-pointer">
            📸 Instagram
          </a>
        )}
      </div>

      {/* SOBRE A LOJA (Premium) */}
      {merchant.store_description && planConfig.hasVitrineBadge && (
        <div className="border-l-4 pl-4 py-1 mx-4 mb-4" style={{ borderColor: storeColor }}>
          <p className="text-sm text-gray-600 leading-relaxed">{merchant.store_description}</p>
        </div>
      )}

      {/* VER LOJA COMPLETA */}
      {merchant.store_url && planConfig.hasStoreUrl && (
        <div className="mx-4 mb-4">
          <button onClick={() => window.open(merchant.store_url, '_blank')}
            className="w-full h-11 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-150 cursor-pointer"
            style={{ color: storeColor, borderColor: storeColor }}>
            <ExternalLink size={16} /> Ver Loja Completa
          </button>
        </div>
      )}

      {/* GRID DE PRODUTOS */}
      <div className="px-3">
        <div className="flex items-center gap-2 mb-3">
          <Crown size={14} className="text-amber-500" />
          <h2 className="font-bold text-sm text-gray-700">Produtos e Serviços</h2>
          {posts.length > 0 && <span className="text-[10px] text-gray-400 ml-auto">{posts.length} {posts.length === 1 ? 'item' : 'itens'}</span>}
        </div>
        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">Nenhum item publicado ainda.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {posts.map((post, index) => (
              <StoreProductCard key={post.id} post={post} merchant={merchant}
                planConfig={planConfig} theme={t} storeColor={storeColor}
                isFeatured={index === 0} onMerchantClick={onMerchantClick} />
            ))}
          </div>
        )}
      </div>

      {/* STICKY CTA WHATSAPP (Premium) */}
      {hasStickyWA && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 pb-4 bg-white/90 backdrop-blur-md border-t border-gray-100">
          <a href={`https://wa.me/${cleanWhatsapp(merchant.whatsapp)}?text=${encodeURIComponent('Olá! Vi sua loja no app Tem no Bairro e gostaria de mais informações!')}`}
            target="_blank" rel="noopener noreferrer"
            className="w-full h-14 rounded-2xl font-bold text-white flex items-center justify-center gap-3 text-sm shadow-lg bg-emerald-500 hover:bg-emerald-600 active:scale-[0.97] transition-all duration-150 cursor-pointer">
            <MessageCircle size={22} />
            Falar com {merchant.name}
          </a>
        </div>
      )}
    </div>
  );
}
