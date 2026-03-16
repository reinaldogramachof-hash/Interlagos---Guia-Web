import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

export default function PremiumCarousel({ merchants, onMerchantClick }) {
  const carouselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicar para loop infinito
  const infinite = [
    ...merchants, ...merchants, ...merchants,
    ...merchants, ...merchants, ...merchants,
  ].slice(0, 30);

  useEffect(() => {
    let animId;
    const scroll = () => {
      if (!isPaused && carouselRef.current) {
        const el = carouselRef.current;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        } else {
          el.scrollLeft += 0.5;
        }
      }
      animId = requestAnimationFrame(scroll);
    };
    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    if (el.scrollLeft >= el.scrollWidth / 2 - 10) {
      el.scrollLeft -= el.scrollWidth / 2;
    }
  };

  if (merchants.length === 0) return null;

  return (
    <section className="mb-6 bg-slate-900 rounded-2xl mx-3 p-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-amber-500 rounded-full" />
          Destaques Premium
        </h2>
        <div className="flex gap-2">
          <button
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onClick={() => carouselRef.current?.scrollBy({ left: -carouselRef.current.clientWidth, behavior: 'smooth' })}
            className="p-2 rounded-full bg-slate-800 border border-white/10 hover:bg-slate-700 hover:border-amber-500/50 transition-all text-slate-400 hover:text-amber-400"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onClick={() => carouselRef.current?.scrollBy({ left: carouselRef.current.clientWidth, behavior: 'smooth' })}
            className="p-2 rounded-full bg-slate-800 border border-white/10 hover:bg-slate-700 hover:border-amber-500/50 transition-all text-slate-400 hover:text-amber-400"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative group" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
          style={{ scrollBehavior: 'auto' }}
        >
          {infinite.map((merchant, index) => (
            <div
              key={`${merchant.id}-${index}`}
              onClick={() => onMerchantClick(merchant)}
              className="premium-card min-w-[85%] md:min-w-[48%] lg:min-w-[31%] xl:min-w-[24%] bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 rounded-3xl p-6 cursor-pointer hover:shadow-2xl hover:shadow-amber-500/20 transition-all relative overflow-hidden group/card"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-xs uppercase font-black px-4 py-1.5 rounded-bl-2xl shadow-lg z-10 flex items-center gap-1">
                Premium <Trophy size={12} className="fill-white" />
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2 h-48 md:h-full bg-slate-700 rounded-2xl overflow-hidden shadow-inner">
                  <img
                    src={merchant.image_url || merchant.image || '/capa.jpg'}
                    alt={merchant.name}
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold mb-3 w-fit">{merchant.category}</span>
                  <h3 className="font-bold text-2xl text-white mb-2">{merchant.name}</h3>
                  <p className="text-slate-400 text-sm line-clamp-3 mb-4">{merchant.description}</p>
                  <div className="mt-auto flex items-center gap-2 text-amber-400 text-xs font-bold">
                    VEJA MAIS DETALHES <div className="p-1 bg-amber-500/20 rounded-full"><ChevronRight size={12} /></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
