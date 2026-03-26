import { useState, useEffect } from 'react';
import { Ticket, ChevronRight, Tag } from 'lucide-react';
import { fetchActiveCoupons } from '../../services/communityService';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

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
              className="flex-shrink-0 w-64 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
            >
              <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />
              <div className="p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                    {merchant.image_url ? (
                      <img src={merchant.image_url} alt={merchant.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag size={16} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-xs truncate">{merchant.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{merchant.category}</p>
                  </div>
                  {coupon.discount && (
                    <div className="flex-shrink-0 bg-emerald-500 text-white px-2.5 py-1 rounded-xl font-black text-sm leading-none">
                      {coupon.discount}
                    </div>
                  )}
                </div>

                <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-3">
                  {coupon.title}
                </p>

                <div className="border-t border-dashed border-gray-200 pt-2.5 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">
                    Válido até {formatDate(coupon.end_date)}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    Ver oferta <ChevronRight size={11} />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
