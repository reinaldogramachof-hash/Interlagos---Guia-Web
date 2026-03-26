import { useRef, useState, useEffect } from 'react';

export function useAutoScrollCarousel(speed = 0.5) {
  const carouselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let animId;
    const scroll = () => {
      if (!isPaused && carouselRef.current) {
        const el = carouselRef.current;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        } else {
          el.scrollLeft += speed;
        }
      }
      animId = requestAnimationFrame(scroll);
    };
    animId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, speed]);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    if (el.scrollLeft >= el.scrollWidth / 2 - 10) {
      el.scrollLeft -= el.scrollWidth / 2;
    }
  };

  // Touch/swipe support
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let startX = 0;
    const onTouchStart = (e) => { startX = e.touches[0].clientX; setIsPaused(true); };
    const onTouchEnd = (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 10) el.scrollBy({ left: diff * 2, behavior: 'smooth' });
      setTimeout(() => setIsPaused(false), 1000);
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return { carouselRef, isPaused, setIsPaused, handleScroll };
}
