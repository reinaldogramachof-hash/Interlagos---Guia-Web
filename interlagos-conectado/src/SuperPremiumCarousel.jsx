import React, { useRef, useEffect, useState } from 'react';
import { Star, Store, MessageCircle, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

export default function SuperPremiumCarousel({ merchants, categories }) {
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    // Duplicate merchants to create infinite loop effect
    const infiniteMerchants = [...merchants, ...merchants, ...merchants];

    // Auto-scroll logic (Slower than Premium)
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || isPaused) return;

        const scrollInterval = setInterval(() => {
            // Slower scroll for "Majestic" feel
            if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 3 * 2) {
                scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3;
            } else {
                scrollContainer.scrollLeft += 0.5; // Very slow scroll
            }
        }, 20);

        return () => clearInterval(scrollInterval);
    }, [isPaused, merchants]);

    // Initial centering
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 3;
        }
    }, [merchants]);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    if (!merchants || merchants.length === 0) return null;

    return (
        <section className="mb-12 relative group/carousel">
            <div className="flex items-center gap-2 mb-6 px-1 justify-center">
                <Trophy className="text-amber-500 fill-amber-500" size={28} />
                <h2 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500 text-3xl tracking-tight">
                    Super Destaques
                </h2>
                <Trophy className="text-amber-500 fill-amber-500" size={28} />
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-4 rounded-full shadow-xl text-amber-600 hover:bg-amber-50 hover:scale-110 transition-all backdrop-blur-sm -ml-2 border-2 border-amber-100"
                aria-label="Scroll left"
            >
                <ChevronLeft size={28} />
            </button>

            <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 p-4 rounded-full shadow-xl text-amber-600 hover:bg-amber-50 hover:scale-110 transition-all backdrop-blur-sm -mr-2 border-2 border-amber-100"
                aria-label="Scroll right"
            >
                <ChevronRight size={28} />
            </button>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 scrollbar-hide scroll-smooth"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                style={{ scrollBehavior: 'auto' }}
            >
                {infiniteMerchants.map((merchant, index) => (
                    <div
                        key={`${merchant.id}-${index}`}
                        className="min-w-[320px] md:min-w-[380px] bg-white rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/50 relative flex flex-col hover:-translate-y-2 transition-transform duration-500 flex-shrink-0 group/card"
                    >
                        {/* Super Badge */}
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 animate-shimmer"></div>

                        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-black px-4 py-1.5 rounded-full z-10 flex items-center gap-1 shadow-lg tracking-wider uppercase">
                            <Star size={12} className="fill-white" /> Super Premium
                        </div>

                        <div className="p-8 flex flex-col h-full bg-gradient-to-b from-amber-50/30 to-white">
                            <div className="flex items-start gap-5 mb-5">
                                <div className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl bg-white text-amber-600 ring-4 ring-amber-100 shadow-xl group-hover/card:scale-110 transition-transform duration-500">
                                    {categories.find(c => c.id === merchant.category)?.icon || <Store />}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 text-2xl leading-tight line-clamp-2 mb-2">
                                        {merchant.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="inline-block text-[10px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 uppercase tracking-wide border border-amber-200">
                                            {merchant.category}
                                        </span>
                                        {merchant.rating && (
                                            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                                                <Star size={14} className="fill-amber-500" />
                                                <span>{merchant.rating}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <p className="text-base text-gray-600 mb-6 leading-relaxed line-clamp-3 flex-1 font-medium">
                                {merchant.description}
                            </p>

                            <div className="mt-auto pt-6 border-t border-amber-100 flex gap-3">
                                {merchant.whatsapp ? (
                                    <a
                                        href={`https://wa.me/55${merchant.whatsapp.replace(/\D/g, '')}?text=Olá, vi seu SUPER destaque no Guia Interlagos!`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-base font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-green-500/30 active:scale-95"
                                    >
                                        <MessageCircle size={20} />
                                        WhatsApp
                                    </a>
                                ) : (
                                    <button disabled className="flex-1 bg-gray-100 text-gray-400 text-base font-bold py-3.5 rounded-2xl cursor-not-allowed">
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
