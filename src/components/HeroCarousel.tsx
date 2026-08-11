import React, { useState, useEffect } from 'react';
import { HeroDeal } from '../types';

interface HeroCarouselProps {
  deals: HeroDeal[];
  onOrderDeal: (deal: HeroDeal) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ deals, onOrderDeal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % deals.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [deals.length]);

  const currentDeal = deals[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % deals.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + deals.length) % deals.length);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <section 
      className="relative w-full h-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-sm bg-gray-100 group transition-all"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
    >
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
        style={{ backgroundImage: `url('${currentDeal.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent/30" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-y-0 left-0 p-6 md:p-12 flex flex-col justify-center max-w-xl z-10">
        <span className="inline-block bg-[#feb300] text-[#6a4800] text-xs uppercase font-extrabold px-3 py-1 rounded-full mb-3 w-max tracking-wider shadow-xs">
          {currentDeal.dealTag}
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-[#271717] mb-3 leading-tight drop-shadow-xs">
          {currentDeal.title}
        </h2>
        <p className="text-sm md:text-base text-[#6B6B6B] mb-5 line-clamp-2">
          {currentDeal.description}
        </p>

        <div className="flex items-center gap-3">
          <span className="text-2xl md:text-3xl font-extrabold text-[#b7122a]">
            ₹{currentDeal.price.toFixed(2)}
          </span>
          <span className="text-sm md:text-base text-[#6B6B6B] line-through font-medium">
            ₹{currentDeal.originalPrice.toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => onOrderDeal(currentDeal)}
          className="mt-5 bg-[#b7122a] text-white font-semibold text-sm md:text-base px-6 py-3 rounded-xl hover:bg-[#92001c] transition-all duration-200 shadow-md w-max hover:-translate-y-0.5 cursor-pointer active:scale-95 flex items-center gap-2"
        >
          <span>Order Now</span>
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </div>

      {/* Slide Navigation Controls */}
      <button
        onClick={handlePrev}
        aria-label="Previous deal"
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-800 hover:bg-white hover:text-[#b7122a] opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md z-20 cursor-pointer"
      >
        <span className="material-symbols-outlined text-xl">chevron_left</span>
      </button>

      <button
        onClick={handleNext}
        aria-label="Next deal"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-800 hover:bg-white hover:text-[#b7122a] opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md z-20 cursor-pointer"
      >
        <span className="material-symbols-outlined text-xl">chevron_right</span>
      </button>

      {/* Carousel Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {deals.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex ? 'w-6 bg-[#b7122a]' : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
