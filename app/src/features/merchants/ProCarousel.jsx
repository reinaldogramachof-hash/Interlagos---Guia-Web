import { useAutoScrollCarousel } from '../../hooks/useAutoScrollCarousel';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function ProCarousel({ merchants, onMerchantClick }) {
  const { carouselRef, isPaused, setIsPaused, handleScroll } = useAutoScrollCarousel(0.5);

  const infinite = [
    ...merchants, ...merchants, ...merchants, ...merchants,
    ...merchants, ...merchants,
  ].slice(0, 30);

  if (merchants.length === 0) return null;

  return (
    <section className="mb-6 bg-slate-900 rounded-2xl mx-3 p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-500 rounded-full" />
          Destaques Pro
        </h2>
        <div className="flex gap-2">
          <button
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onClick={() => carouselRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
            className="p-3 rounded-full bg-slate-800/50 border border-white/5 hover:bg-slate-700 hover:border-indigo-500/50 transition-all text-slate-400 hover:text-indigo-400"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onClick={() => carouselRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
            className="p-3 rounded-full bg-slate-800/50 border border-white/5 hover:bg-slate-700 hover:border-indigo-500/50 transition-all text-slate-400 hover:text-indigo-400"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        className="relative group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 1500)}
      >
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollBehavior: 'auto' }}
        >
          {infinite.map((merchant, index) => (
            <div
              key={`${merchant.id}-${index}`}
              onClick={() => onMerchantClick(merchant)}
              className="min-w-[280px] md:min-w-[320px] lg:min-w-[350px] shrink-0 bg-slate-800/50 border border-indigo-500/20 rounded-2xl p-4 cursor-pointer hover:bg-slate-800/80 hover:border-indigo-500/60 transition-all duration-700 ease-out group/pro"
            >
              <div className="h-40 bg-slate-700 rounded-xl mb-4 overflow-hidden relative">
                <img
                  src={merchant.image_url || merchant.image || '/capa.jpg'}
                  alt={merchant.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-full group-hover/pro:translate-y-0 transition-transform duration-500 ease-out flex justify-center">
                  <span className="text-white text-xs font-bold flex items-center gap-1">Ver Perfil <ChevronRight size={14} /></span>
                </div>
              </div>
              <h3 className="font-bold text-lg text-white mb-1 truncate">{merchant.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold rounded flex items-center gap-1">
                  Pro <Star size={10} className="fill-indigo-400" />
                </span>
                <span className="text-xs text-slate-500 truncate">{merchant.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
