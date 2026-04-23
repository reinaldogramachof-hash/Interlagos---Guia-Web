import { ArrowLeft, Share2, ImageIcon, Crown, ShieldCheck, Store } from 'lucide-react';
import { PLANS_CONFIG } from '../../../constants/plans';

export default function StoreHero({ merchant, theme, storeColor, onBack, onShare }) {
  const planConfig = PLANS_CONFIG[merchant?.plan || 'free'] || PLANS_CONFIG.free;
  const showPremiumBadge = planConfig.hasVitrineBadge;
  const showVerified = planConfig.hasVerifiedBadge;
  const showProBadge = merchant?.plan === 'pro';

  return (
    <>
      <div
        className="relative h-56 overflow-hidden"
        style={{ background: merchant.store_cover_url ? undefined : storeColor }}
      >
        {merchant.store_cover_url && (
          <img
            src={merchant.store_cover_url}
            alt={`Capa de ${merchant.name}`}
            className="w-full h-full object-cover"
            loading="eager"
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${theme.heroOverlay}`} />

        <button
          onClick={onBack}
          aria-label="Voltar"
          className="absolute top-3 left-3 w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white active:scale-95 duration-150 cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={onShare}
          aria-label="Compartilhar loja"
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white active:scale-95 duration-150 cursor-pointer"
        >
          <Share2 size={18} />
        </button>

        <div className="absolute bottom-4 left-4 w-14 h-14 rounded-xl border-[3px] border-white shadow-lg overflow-hidden flex-shrink-0"
             style={{ background: storeColor }}>
          {merchant.image_url ? (
            <img src={merchant.image_url} alt={merchant.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon size={18} className="text-white/60" />
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-20 right-14">
          <h1 className="text-white font-black text-2xl leading-tight drop-shadow line-clamp-1 flex items-center gap-2">
            {merchant.name}
            {showVerified && (
              <ShieldCheck size={18} className="text-amber-300 shrink-0" aria-label="Verificado" />
            )}
          </h1>
          {merchant.store_tagline && (
            <p className="text-white/80 text-sm mt-0.5 line-clamp-1">{merchant.store_tagline}</p>
          )}
        </div>
      </div>

      <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-gray-100 mb-3">
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full shadow-sm">
          {merchant.category}
        </span>
        {showPremiumBadge && (
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Crown size={11} /> Premium
          </span>
        )}
        {!showPremiumBadge && showProBadge && (
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Store size={11} /> Pro
          </span>
        )}
      </div>

      {showPremiumBadge && merchant.store_badge_text && (
        <div
          className="mx-4 mb-3 px-4 py-2.5 rounded-xl text-white font-bold text-sm shadow-sm"
          style={{ background: storeColor }}
        >
          {merchant.store_badge_text}
        </div>
      )}
    </>
  );
}
