import { Store, MessageCircle } from 'lucide-react';
import { cleanWhatsapp } from '../../utils/whatsapp';

export default function StoreProCard({ merchant, onStoreClick }) {
  const waNumber = cleanWhatsapp(merchant.whatsapp || '');
  const waMsg = encodeURIComponent(`Olá! Vi a loja ${merchant.name} no Tem no Bairro e tenho interesse!`);

  return (
    <div 
      onClick={() => onStoreClick(merchant)}
      className="rounded-xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform bg-white shadow-sm border border-gray-100"
    >
      <div className="aspect-[4/3] relative">
        {merchant.store_cover_url ? (
          <img src={merchant.store_cover_url} alt={merchant.name} className="w-full h-full object-cover" />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-white"
            style={{ backgroundColor: merchant.store_color || '#6366f1' }}
          >
            <Store size={32} />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-indigo-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
          PRO
        </div>
      </div>
      <div className="p-2.5">
        <h3 className="font-bold text-xs text-gray-900 line-clamp-1">{merchant.name}</h3>
        {merchant.store_tagline && (
          <p className="text-[10px] text-gray-500 italic mt-0.5 line-clamp-1">{merchant.store_tagline}</p>
        )}
        <div className="mt-1.5">
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full inline-block">
            {merchant.category}
          </span>
        </div>
        {merchant.whatsapp && (
          <a
            href={`https://wa.me/${waNumber}?text=${waMsg}`}
            target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="mt-2.5 w-full h-8 bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform"
          >
            <MessageCircle size={14} /> WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
