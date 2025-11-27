import React, { useRef, useEffect, useState } from 'react';
import { Star, Store, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PremiumCarousel({ merchants, categories }) {
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // Duplicate merchants to create infinite loop effect
    const infiniteMerchants = [...merchants, ...merchants, ...merchants];

    // Auto-scroll logic
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || isPaused) return;

        const scrollInterval = setInterval(() => {
            // Move 1px at a time for smooth continuous effect, or larger chunks for "slide" effect
            // User requested "slow automatic scroll", so let's do small increments frequently
            if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 3 * 2) {
                // If we reached the end of the second set, jump back to the first set (middle)
                scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3;
            } else {
                scrollContainer.scrollLeft += 1; // Ultra smooth slow scroll
            }
        }, 20); // 50fps

        return () => clearInterval(scrollInterval);
    }, [isPaused, merchants]);

    // Initial centering
    useEffect(() => {
        if (scrollRef.current) {
            // Start in the middle set
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 3;
        }
    }, [merchants]);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
            // Pause briefly after manual interaction
            setIsPaused(true);
            setTimeout(() => setIsPaused(false), 3000);
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
            // Pause briefly after manual interaction
            setIsPaused(true);
            setTimeout(() => setIsPaused(false), 3000);
        }
    };

    if (!merchants || merchants.length === 0) return null;

    return (
        <section className="mb-10 relative group/carousel">
            <div className="flex items-center gap-2 mb-4 px-1">
                <Star className="text-yellow-500 fill-yellow-500" size={20} />
                <h2 className="font-bold text-gray-800 text-xl">Destaques da Região</h2>
            </div>

            {/* Navigation Buttons - Centered and Simple */}
            <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-3 rounded-full shadow-lg text-indigo-600 hover:bg-white hover:scale-110 transition-all backdrop-blur-sm -ml-2 border border-gray-100"
                aria-label="Scroll left"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-3 rounded-full shadow-lg text-indigo-600 hover:bg-white hover:scale-110 transition-all backdrop-blur-sm -mr-2 border border-gray-100"
                aria-label="Scroll right"
            >
                <ChevronRight size={24} />
            </button>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide scroll-smooth"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                style={{ scrollBehavior: 'auto' }} // Disable native smooth scroll for the auto-scroller to work without fighting
            >
                {infiniteMerchants.map((merchant, index) => (
                    <div
                        key={`${merchant.id}-${index}`}
                        className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-lg border border-yellow-400/30 relative flex flex-col hover:-translate-y-1 transition-transform duration-300 flex-shrink-0"
                    >
                        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10 flex items-center gap-1 shadow-sm">
                            <Star size={10} className="fill-yellow-900" /> PREMIUM
                        </div>

                        <div className="p-5 flex flex-col h-full">
                            <div className="flex items-start gap-4 mb-3">
                                <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 ring-2 ring-indigo-50 shadow-inner">
                                    {categories.find(c => c.id === merchant.category)?.icon || <Store />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">
                                        {merchant.name}
                                    </h3>
                                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 uppercase tracking-wide">
                                        {merchant.category}
                                    </span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-1">
                                {merchant.description}
                            </p>

                            <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                                {merchant.whatsapp ? (
                                    <a
                                        href={`https://wa.me/55${merchant.whatsapp.replace(/\D/g, '')}?text=Olá, vi seu destaque no Guia Interlagos!`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95"
                                    >
                                        <MessageCircle size={16} />
                                        WhatsApp
                                    </a>
                                ) : (
                                    <button disabled className="flex-1 bg-gray-100 text-gray-400 text-sm font-bold py-2.5 rounded-xl cursor-not-allowed">
                                        Sem Zap
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
