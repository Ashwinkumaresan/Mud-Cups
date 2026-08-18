import React, { useState, useRef, useEffect } from 'react';

interface SwipeToConfirmProps {
  onConfirm: () => void;
  amount: number;
  disabled?: boolean;
  disabledMessage?: string;
  onDisabledClick?: () => void;
}

export const SwipeToConfirm: React.FC<SwipeToConfirmProps> = ({ onConfirm, amount, disabled = false, disabledMessage, onDisabledClick }) => {
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  useEffect(() => {
    const updateMaxScroll = () => {
      if (containerRef.current && thumbRef.current) {
        const padding = 8;
        setMaxScroll(containerRef.current.offsetWidth - thumbRef.current.offsetWidth - padding);
      }
    };
    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);
    return () => window.removeEventListener('resize', updateMaxScroll);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) {
      if (onDisabledClick) onDisabledClick();
      return;
    }
    if (swipeProgress >= 1) return;
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX - deltaX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || maxScroll <= 0) return;
    
    const currentX = e.touches[0].clientX;
    let newDeltaX = currentX - startXRef.current;
    
    if (newDeltaX < 0) newDeltaX = 0;
    if (newDeltaX > maxScroll) newDeltaX = maxScroll;

    setDeltaX(newDeltaX);
    setSwipeProgress(newDeltaX / maxScroll);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (swipeProgress > 0.8) {
      setDeltaX(maxScroll);
      setSwipeProgress(1);
      setTimeout(() => {
        onConfirm();
      }, 400);
    } else {
      setDeltaX(0);
      setSwipeProgress(0);
    }
  };

  const r = Math.round(183 + (34 - 183) * swipeProgress);
  const g = Math.round(18 + (197 - 18) * swipeProgress);
  const b = Math.round(42 + (94 - 42) * swipeProgress);
  const bgColor = `rgb(${r}, ${g}, ${b})`;

  const thumbIconColor = swipeProgress >= 1 ? '#22c55e' : '#1B4D3E';

  return (
    <div className="w-full flex flex-col gap-2 relative">
      {/* Desktop Version */}
      <button 
        onClick={() => {
          if (disabled) {
            if (onDisabledClick) onDisabledClick();
          } else {
            onConfirm();
          }
        }}
        className={`hidden lg:flex w-full relative overflow-hidden bg-[#1B4D3E] hover:bg-[#123329] active:scale-95 cursor-pointer text-white py-4 rounded font-bold transition-all shadow-sm items-center justify-between px-6`}
      >
        <span className="flex items-center gap-2">
          Place Order
          <span className="material-symbols-outlined">check_circle</span>
        </span>
        <span>₹{amount.toFixed(2)}</span>
        
        {/* Desktop Disabled Overlay */}
        {disabled && disabledMessage && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10 text-gray-500 font-semibold cursor-not-allowed">
            {disabledMessage}
          </div>
        )}
      </button>

      <div className={`md:hidden fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2 animate-slideUp`}>
        <div 
          className="relative w-full h-16 rounded overflow-hidden shadow-2xl flex items-center justify-center select-none"
          style={{ 
            backgroundColor: bgColor,
            touchAction: 'none',
            transition: isDragging ? 'none' : 'background-color 0.3s ease-out' 
          }}
          ref={containerRef}
        >
          {/* Mobile Disabled Overlay */}
          {disabled && disabledMessage && (
            <div className="absolute inset-0 bg-red-400 border-1 border-red-500 flex items-center justify-center z-50 text-white font-semibold cursor-not-allowed">
              {disabledMessage}
            </div>
          )}
          <div 
            className="absolute inset-y-0 left-0 flex items-center p-1 z-20"
            style={{ 
              transform: `translateX(${deltaX}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
            ref={thumbRef}
          >
            <div 
              className={`w-14 h-14 bg-white rounded flex items-center justify-center shadow-sm ${disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}`}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ color: thumbIconColor, transition: 'color 0.3s' }}
            >
              <span className="material-symbols-outlined font-bold text-2xl">
                {swipeProgress >= 1 ? 'check' : 'double_arrow'}
              </span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-between pl-16 pr-6 pointer-events-none z-10 transition-opacity">
            <span className="text-white font-bold text-sm" style={{ opacity: swipeProgress >= 1 ? 0 : 1 - swipeProgress }}>
              Swipe to confirm
            </span>
            <span className="text-white font-bold text-sm absolute left-16" style={{ opacity: swipeProgress >= 1 ? 1 : 0, transition: 'opacity 0.3s' }}>
              Confirmed!
            </span>
            <span className="text-white font-bold text-lg">
               ₹{amount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
