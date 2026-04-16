import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/dateUtils';
import { Ticket, ChevronRight, Tag } from 'lucide-react';
import { fetchActiveCoupons } from '../../services/communityService';

export default function CouponsCarousel({ onMerchantClick, onViewAll }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveCoupons()
      .then(setCoupons)
      .finally(() => setLoading(false));
  }, []);

  if (loading || coupons.length === 0) return null;

  return (
    <section className="mb-4 mx-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <Ticket size={16} className="text-emerald-500" />
          Cupons &amp; Ofertas
        </h2>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 hover:text-emerald-700 transition-colors"
        >
          Ver todos <ChevronRight size={13} />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {coupons.map(coupon => {
          const merchant = coupon.merchants ?? {};
          return (
              <div
                key={coupon.id}
                onClick={() => merchant.id && onMerchantClick({ ...merchant })}
                className="flex-shrink-0 w-[180px] bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col relative group"
              >
                {/* Efeito de recorte lateral de Ticket */}
                <div className="absolute left-[-6px] top-[100px] w-3 h-3 bg-gray-50 rounded-full border-r border-emerald-100 z-10" />
                <div className="absolute right-[-6px] top-[100px] w-3 h-3 bg-gray-50 rounded-full border-l border-emerald-100 z-10" />

                {/* Área da Marca e Desconto */}
                <div className="p-3 pb-4 flex flex-col items-center text-center bg-white border-b-2 border-dashed border-emerald-100 relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shadow-sm mb-2 group-hover:scale-105 transition-transform">
                    {merchant.image_url ? (
                      <img src={merchant.image_url} alt={merchant.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <Tag size={16} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <p className="font-bold text-gray-900 text-[11px] leading-tight line-clamp-1 w-full px-1">{merchant.name}</p>
                  
                  {coupon.discount && (
                    <div className="absolute -bottom-3 bg-emerald-600 text-white px-3 py-1 rounded-full font-black text-[15px] shadow-sm transform -rotate-3 border-2 border-white">
                      {coupon.discount}
                    </div>
                  )}
                </div>

                {/* Detalhes do Benefício */}
                <div className="p-3 pt-5 text-center flex flex-col flex-1 justify-between">
                  <p className="text-[11px] font-semibold text-emerald-950 mb-2 leading-tight line-clamp-2">
                    {coupon.title}
                  </p>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide bg-emerald-100/50 px-2 py-0.5 rounded-md inline-block max-w-fit mx-auto">
                    Válido até: {formatDate(coupon.end_date).split(' ')[0]}
                  </span>
                </div>
              </div>
          );
        })}
      </div>
    </section>
  );
}
