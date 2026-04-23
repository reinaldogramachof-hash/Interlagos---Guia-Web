import { Store } from 'lucide-react';

export default function StoreStoriesBar({ merchants, onStoreClick }) {
  return (
    <section className="mb-2">
      <div className="px-4 py-2">
        <h2 className="text-xs font-bold text-gray-500">• Todas as Lojas</h2>
      </div>
      <div className="flex overflow-x-auto gap-4 px-4 py-3 scrollbar-hide">
        {merchants.map(m => (
          <div 
            key={m.id} 
            onClick={() => onStoreClick(m)}
            className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
          >
            <div className={`w-14 h-14 rounded-full border-2 object-cover flex-shrink-0 relative ${
              m.plan === 'premium' 
                ? 'border-amber-400 ring-2 ring-amber-300 ring-offset-2 ring-offset-white' 
                : 'border-indigo-400'
            }`}>
              {m.image_url ? (
                <img src={m.image_url} alt={m.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: m.store_color || '#6366f1' }}
                >
                  <Store size={24} />
                </div>
              )}
            </div>
            <span className="text-[10px] font-semibold text-gray-600 w-14 text-center truncate">
              {m.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
