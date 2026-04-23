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
              className="flex-shrink-0 w-[220px] h-[72px] flex items-center gap-3 px-3 bg-white rounded-2xl border border-emerald-100 shadow-sm cursor-pointer active:scale-[0.98] transition-all overflow-hidden"
            >
              {/* LOGO */}
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-emerald-400 flex-shrink-0 bg-gray-50">
                {merchant.image_url ? (
                  <img src={merchant.image_url} alt={merchant.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag size={14} className="text-gray-300" />
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                <p className="font-bold text-gray-900 text-[11px] truncate leading-none">
                  {merchant.name}
                </p>
                <p className="text-[10px] text-gray-500 truncate leading-none">
                  {coupon.title}
                </p>
                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide leading-none mt-0.5">
                  Até {formatDate(coupon.end_date).split(' ')[0]}
                </p>
              </div>

              {/* DESCONTO */}
              {coupon.discount && (
                <div className="flex-shrink-0 bg-emerald-600 text-white px-2 py-1 rounded-xl font-black text-sm text-center leading-tight min-w-[44px]">
                  {coupon.discount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
