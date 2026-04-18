import { Crown, PackageOpen } from 'lucide-react';
import StoreProductCard from '../StoreProductCard';
import { POST_FILTERS } from './storeThemes';

export default function StoreCatalog({
  posts,
  activeFilter,
  onFilterChange,
  merchant,
  planConfig,
  theme,
  storeColor,
  onMerchantClick,
}) {
  const hasPosts = posts.length > 0;
  const counts = posts.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="px-3 pt-2">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Crown size={14} className="text-amber-500" />
        <h2 className="font-bold text-sm text-gray-700">Produtos e Serviços</h2>
        {hasPosts && (
          <span className="text-[10px] text-gray-400 ml-auto">
            {posts.length} {posts.length === 1 ? 'item' : 'itens'}
          </span>
        )}
      </div>

      {hasPosts && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-3 -mx-1 px-1">
          {POST_FILTERS.map((f) => {
            const total = f.id === 'all' ? posts.length : counts[f.id] || 0;
            if (f.id !== 'all' && total === 0) return null;
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onFilterChange(f.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                  isActive ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-200'
                }`}
                style={isActive ? { background: storeColor } : undefined}
              >
                {f.label} <span className="opacity-70">·{total}</span>
              </button>
            );
          })}
        </div>
      )}

      {!hasPosts ? (
        <div className="text-center py-12 text-gray-400">
          <PackageOpen size={40} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm font-bold text-gray-500">Nenhum item publicado ainda</p>
          <p className="text-xs">Volte em breve para ver as novidades desta loja.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {posts.map((post, index) => (
            <StoreProductCard
              key={post.id}
              post={post}
              merchant={merchant}
              planConfig={planConfig}
              theme={theme}
              storeColor={storeColor}
              isFeatured={index === 0 && activeFilter === 'all'}
              onMerchantClick={onMerchantClick}
            />
          ))}
        </div>
      )}
    </section>
  );
}
