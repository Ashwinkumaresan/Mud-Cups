import React, { ReactNode, useEffect, useRef } from 'react';

interface HorizontalScrollListProps {
  children: ReactNode;
  className?: string;
  autoScroll?: boolean;
}

export const HorizontalScrollList: React.FC<HorizontalScrollListProps> = ({ children, className = '', autoScroll = false }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoScroll || !scrollRef.current) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 1) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: clientWidth * 0.8, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [autoScroll]);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory hide-scrollbar scroll-smooth"
      >
        {React.Children.map(children, (child, index) => (
          <div key={index} className="snap-start shrink-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
