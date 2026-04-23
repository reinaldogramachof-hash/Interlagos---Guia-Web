import { Crown, Store, MessageCircle, Star } from 'lucide-react';
import { cleanWhatsapp } from '../../utils/whatsapp';

export default function StorePremiumCard({ merchant, onStoreClick }) {
  const waNumber = cleanWhatsapp(merchant.whatsapp || '');
  const waMsg = encodeURIComponent(`Olá! Vi a loja ${merchant.name} no Tem no Bairro e tenho interesse!`);

  return (
    <div 
      onClick={() => onStoreClick(merchant)}
      className="rounded-2xl overflow-hidden shadow-md cursor-pointer active:scale-[0.98] transition-all bg-white border border-amber-100/60 mb-4 mx-4"
    >
      <div className="h-36 relative">
        {merchant.store_cover_url ? (
          <img src={merchant.store_cover_url} alt={merchant.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ backgroundColor: merchant.store_color || '#fcd34d' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute top-2 right-2 bg-amber-400/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Crown size={10} /> Premium
        </div>
        <div 
          className="absolute bottom-0 left-3 translate-y-1/2 w-12 h-12 rounded-xl border-2 border-white shadow-md overflow-hidden bg-white"
          style={{ backgroundColor: !merchant.image_url ? (merchant.store_color || '#6366f1') : undefined }}
        >
          {merchant.image_url ? (
            <img src={merchant.image_url} alt={merchant.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <Store size={18} />
            </div>
          )}
        </div>
      </div>
      <div className="pt-8 px-4 pb-4">
        <h3 className="font-black text-base text-gray-900 line-clamp-1">{merchant.name}</h3>
        {merchant.store_tagline && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{merchant.store_tagline}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
              {merchant.category}
            </span>
            {merchant.review_count > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                {Number(merchant.avg_rating).toFixed(1)}
                <span className="text-gray-400 font-normal">({merchant.review_count})</span>
              </span>
            )}
          </div>
          <span className="text-xs font-bold" style={{ color: merchant.store_color || '#6366f1' }}>
            Ver loja →
          </span>
        </div>
        {merchant.whatsapp && (
          <a
            href={`https://wa.me/${waNumber}?text=${waMsg}`}
            target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="mt-3 w-full h-10 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
          >
            <MessageCircle size={14} /> Falar no WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
