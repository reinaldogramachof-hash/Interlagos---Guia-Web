import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/dateUtils';
import { ArrowLeft, Ticket, Tag, ChevronRight, Search, X } from 'lucide-react';
import { fetchActiveCoupons } from '../../services/communityService';

export default function CouponsView({ onMerchantClick, onBack }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchActiveCoupons()
      .then(setCoupons)
      .finally(() => setLoading(false));
  }, []);

  const filteredCoupons = coupons.filter(coupon => {
      const matchesSearch = coupon.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            coupon.merchants?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
  });

  return (
    <div className="pb-4">
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 bg-white sticky top-0 z-10 space-y-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-black text-gray-900">Cupons &amp; Ofertas</h2>
            <p className="text-xs text-gray-400">{filteredCoupons.length} oferta{filteredCoupons.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar cupons ou lojas..."
            className="w-full pl-9 pr-9 py-2.5 bg-white border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-4 pt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-gray-100 rounded-card animate-pulse" />
          ))}
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <Ticket size={40} className="text-gray-200 mb-3" />
          <p className="font-bold text-gray-500">Nenhum cupom encontrado</p>
          <p className="text-sm text-gray-400 mt-1">Tente buscar por outros termos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 px-4 pt-4">
          {filteredCoupons.map(coupon => {
            const merchant = coupon.merchants ?? {};
            return (
              <div
                key={coupon.id}
                onClick={() => merchant.id && onMerchantClick({ ...merchant })}
                className="bg-white rounded-card border border-emerald-100 shadow-card hover:shadow-card transition-all cursor-pointer overflow-hidden"
              >
                <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500" />
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                      {merchant.image_url ? (
                        <img src={merchant.image_url} alt={merchant.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Tag size={12} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-gray-600 truncate flex-1">{merchant.name}</p>
                  </div>

                  {coupon.discount && (
                    <div className="inline-block bg-emerald-500 text-white px-2 py-0.5 rounded-lg font-black text-sm mb-1.5">
                      {coupon.discount}
                    </div>
                  )}

                  <p className="text-xs font-semibold text-gray-800 line-clamp-2 mb-2">{coupon.title}</p>

                  <div className="border-t border-dashed border-gray-100 pt-2 flex items-center justify-between">
                    <span className="text-[9px] text-gray-400">Até {formatDate(coupon.end_date)}</span>
                    <ChevronRight size={12} className="text-emerald-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
