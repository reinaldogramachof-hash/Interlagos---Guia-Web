import { ShoppingBag, Wrench, Megaphone, Tag, MessageCircle } from 'lucide-react';
import { cleanWhatsapp } from '../../utils/whatsapp';

const TYPE_BADGE = {
  product: { label: 'Produto',   cls: 'bg-blue-100 text-blue-700' },
  service: { label: 'Serviço',   cls: 'bg-amber-100 text-amber-700' },
  news:    { label: 'Novidade',  cls: 'bg-emerald-100 text-emerald-700' },
  promo:   { label: 'Promoção',  cls: 'bg-indigo-100 text-indigo-700' },
};

const TYPE_ICON = {
  product: ShoppingBag,
  service: Wrench,
  news:    Megaphone,
  promo:   Tag,
};

export default function StoreProductCard({ post, merchant, planConfig, theme, storeColor, isFeatured, onPostClick }) {
  const badge = TYPE_BADGE[post.type] ?? TYPE_BADGE.product;
  const Icon = TYPE_ICON[post.type] ?? ShoppingBag;
  const waNumber = cleanWhatsapp(merchant.whatsapp || '');
  const waMsg = encodeURIComponent(`Olá! Vi ${post.title} na Vitrine do bairro e tenho interesse!`);
  const priceCls = theme?.priceCls || 'text-indigo-600';
  const ctaBg   = theme?.ctaBg   || 'bg-indigo-600 hover:bg-indigo-700';
  const color   = storeColor || '#4f46e5';

  return (
    <div
      className={`flex flex-col cursor-pointer active:scale-[0.98] transition-transform duration-150 ${isFeatured ? 'col-span-2' : ''}`}
      onClick={() => onPostClick(post)}
    >
      <div className="relative mb-2">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.title}
            loading="lazy"
            className={`w-full object-cover rounded-xl ${isFeatured ? 'aspect-video' : 'aspect-square'}`}
          />
        ) : (
          <div
            className={`w-full rounded-xl flex flex-col items-center justify-center gap-2 ${isFeatured ? 'aspect-video' : 'aspect-square'}`}
            style={{ background: `linear-gradient(135deg, ${color}20, ${color}08)`, borderWidth: 1, borderStyle: 'solid', borderColor: `${color}25` }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${color}18` }}>
              <Icon size={isFeatured ? 22 : 18} style={{ color }} />
            </div>
            {isFeatured && (
              <p className="text-xs font-semibold text-center px-4 leading-snug" style={{ color: `${color}99` }}>
                {post.title}
              </p>
            )}
          </div>
        )}

        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>
          {badge.label}
        </span>

        {post.type === 'promo' && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
            OFERTA
          </span>
        )}

        {planConfig.hasVitrineProductCTA && merchant.whatsapp && (
          <a
            href={`https://wa.me/${waNumber}?text=${waMsg}`}
            target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className={`absolute bottom-2 right-2 text-white font-bold rounded-xl shadow-md min-h-[32px] flex items-center justify-center gap-1 ${isFeatured ? 'text-sm px-4 py-1.5' : 'text-[10px] px-2.5 py-1'} ${ctaBg}`}
          >
            {isFeatured ? (
              <><MessageCircle size={14} /> Pedir</>
            ) : (
              <MessageCircle size={12} />
            )}
          </a>
        )}
      </div>

      <h3 className={`font-bold text-gray-900 line-clamp-2 leading-tight ${isFeatured ? 'text-base' : 'text-sm'}`}>
        {post.title}
      </h3>
      {post.price != null && (
        <p className={`font-bold text-xs mt-0.5 ${priceCls}`}>
          R$ {Number(post.price).toLocaleString('pt-BR')}
        </p>
      )}
      {!post.price && isFeatured && (
        <p className="text-[10px] text-gray-400 mt-0.5">Consulte o preço</p>
      )}
    </div>
  );
}
