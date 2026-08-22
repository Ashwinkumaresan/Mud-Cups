import React, { useState, useEffect } from 'react';
import { Banner } from '../../types';

interface HeroCarouselProps {
  banners: Banner[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

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
      className="relative w-full h-[320px] md:h-[400px] rounded-[16px] overflow-hidden bg-white shadow-sm mx-auto group transition-all mt-2 mb-2"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEndHandler}
    >
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-100"
        style={{ backgroundImage: `url('${currentBanner.image_url || currentBanner.image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 pb-8 flex flex-col justify-end max-w-[80%] z-10 text-white">
        {currentBanner.tag && (
          <span className="inline-block bg-white text-[#1B4D3E] text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-sm mb-2 w-max tracking-wide">
            {currentBanner.tag}
          </span>
        )}
        <h2 className="text-xl md:text-3xl font-extrabold mb-1 leading-tight text-white drop-shadow-sm">
          {currentBanner.title}
        </h2>
      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex ? 'w-4 bg-[#1B4D3E]' : 'w-1.5 bg-gray-300/80 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
