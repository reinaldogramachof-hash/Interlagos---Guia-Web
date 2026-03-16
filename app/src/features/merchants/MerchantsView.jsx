import { Search, Store, MapPin, Phone } from 'lucide-react';
import { SkeletonCard } from '../../components/SkeletonCard';
import EmptyState from '../../components/EmptyState';
import PremiumCarousel from './PremiumCarousel';
import ProCarousel from './ProCarousel';

// Badge de status: Aberto entre 7h e 22h (lógica de frontend mockada)
function isOpen() {
  const h = new Date().getHours();
  return h >= 7 && h < 22;
}

function OpenBadge() {
  const open = isOpen();
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${open
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-600'
      }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-green-500' : 'bg-red-500'}`} />
      {open ? 'Aberto' : 'Fechado'}
    </span>
  );
}

// Converte nome do plano em label display
const PLAN_LABEL = {
  premium: { label: 'Premium', bg: 'bg-amber-50', text: 'text-amber-700' },
  professional: { label: 'Pro', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  basic: { label: 'Básico', bg: 'bg-gray-100', text: 'text-gray-600' },
  free: { label: 'Grátis', bg: 'bg-gray-50', text: 'text-gray-400' },
};

export default function MerchantsView({ merchants, loading, selectedCategory, searchTerm, onMerchantClick }) {
  const premiumMerchants = merchants.filter(m => m.plan === 'premium');
  const proMerchants = merchants.filter(m => m.plan === 'professional');
  const showCarousels = selectedCategory === 'Todos' && !searchTerm;

  const filteredMerchants = merchants
    .filter(m => {
      const matchesCategory = selectedCategory === 'Todos' || m.category === selectedCategory;
      const matchesSearch = m.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchTerm?.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const priority = { premium: 4, professional: 3, basic: 2, free: 1 };
      return (priority[b.plan] ?? 2) - (priority[a.plan] ?? 2);
    });

  return (
    <div className="pb-4">
      {/* ── Carrosséis de Destaque (preservados) ── */}
      {showCarousels && premiumMerchants.length > 0 && (
        <PremiumCarousel merchants={premiumMerchants} onMerchantClick={onMerchantClick} />
      )}
      {showCarousels && proMerchants.length > 0 && (
        <ProCarousel merchants={proMerchants} onMerchantClick={onMerchantClick} />
      )}

      {/* ── Título da seção ── */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
          {searchTerm
            ? `Resultados para "${searchTerm}"`
            : selectedCategory !== 'Todos'
              ? selectedCategory
              : 'Todos os estabelecimentos'}
        </h2>
        <span className="text-xs text-gray-400">
          {filteredMerchants.length} encontrado{filteredMerchants.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Lista estilo iFood ── */}
      {loading ? (
        <SkeletonCard count={5} />
      ) : filteredMerchants.length === 0 ? (
        <EmptyState
          icon={<Search className="text-gray-400" size={28} />}
          title="Nenhum resultado"
          description={`Não encontramos nada para "${searchTerm || selectedCategory}".`}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3 px-3">
          {filteredMerchants.map(merchant => {
            const plan = PLAN_LABEL[merchant.plan] ?? PLAN_LABEL.basic;
            return (
              <div
                key={merchant.id}
                onClick={() => onMerchantClick(merchant)}
                className="bg-white rounded-2xl p-3 flex gap-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all active:scale-[0.99]"
              >
                {/* Avatar redondo */}
                <div className="w-16 h-16 rounded-full border border-gray-200 overflow-hidden flex-shrink-0 bg-gray-50">
                  {merchant.image_url || merchant.image ? (
                    <img
                      src={merchant.image_url || merchant.image}
                      alt={merchant.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-300 bg-gray-100">
                      {merchant.name?.[0] ?? <Store size={22} />}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">
                      {merchant.name}
                    </h3>
                    <OpenBadge />
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
                    {merchant.description || 'Estabelecimento local no Parque Interlagos.'}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Categoria */}
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                      {merchant.category}
                    </span>
                    {/* Plano */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.bg} ${plan.text}`}>
                      {plan.label}
                    </span>
                    {/* Endereço resumido */}
                    {merchant.address && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5 truncate max-w-[120px]">
                        <MapPin size={9} />
                        {merchant.address.split('-')[0].trim()}
                      </span>
                    )}
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
