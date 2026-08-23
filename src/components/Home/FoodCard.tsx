import React from 'react';
import { FoodItem } from '../../types';

interface FoodCardProps {
  item: FoodItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  cartQuantity: number;
  onAddToCart: (item: FoodItem) => void;
  onUpdateQuantity: (item: FoodItem, delta: number) => void;
  onOpenDetail: (item: FoodItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  isFavorite,
  onToggleFavorite,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetail,
}) => {
  let displayName = item.name;
  let subtitle = item.category;

  const isCombo = item.category.toLowerCase() === 'combos' || item.category.toLowerCase() === 'combo';

  if (isCombo && item.name.includes('(')) {
    const match = item.name.match(/(.*?)\s*\((.*)\)/);
    if (match) {
      displayName = match[1].trim();
      subtitle = match[2].trim();
    }
  }

  return (
    <article className="group relative flex flex-col h-full cursor-pointer">
      {/* Image Container */}
      <div
        onClick={() => onOpenDetail(item)}
        className="relative h-40 sm:h-48 w-full"
      >
        <div className="absolute inset-0 rounded overflow-hidden bg-gray-100 shadow-sm">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('${item.image || 'https://via.placeholder.com/400x300?text=No+Image'}')` }}
          />
        </div>
        
        {/* Floating Add/Qty Button */}
        <div className="absolute -bottom-3 right-2 z-10">
          {cartQuantity > 0 ? (
            <div className="flex items-center bg-white border-[3px] border-[#FC9123] rounded-full px-2 py-1 shadow-sm h-10">
              <button
                onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item, -1); }}
                className="text-[#FC9123] hover:bg-yellow-50 rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold transition-colors"
              >
                -
              </button>
              <span className="text-sm font-bold text-[#FC9123] min-w-[20px] text-center">
                {cartQuantity}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item, 1); }}
                className="text-[#FC9123] hover:bg-yellow-50 rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                if (isCombo) {
                  onOpenDetail(item);
                } else {
                  onAddToCart(item);
                }
              }}
              className="bg-white border-[3px] border-[#FC9123] text-[#FC9123] w-10 h-10 rounded-full flex items-center justify-center shadow-sm hover:bg-yellow-50 transition-all active:scale-95"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="pt-4 px-1 flex flex-col flex-grow bg-transparent">
        <div className="flex items-start gap-2 mb-1">
          {/* Veg/Non-veg icon */}
          <div className="mt-1 flex-shrink-0">
            {item.isVeg ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#10B981" strokeWidth="2" />
                <circle cx="8" cy="8" r="4" fill="#10B981" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#EF4444" strokeWidth="2" />
                <circle cx="8" cy="8" r="4" fill="#EF4444" />
              </svg>
            )}
          </div>
          
          <h3
            onClick={() => onOpenDetail(item)}
            className="font-bold text-sm sm:text-base text-[#1C1C1C] line-clamp-2 leading-snug"
          >
            {displayName}
          </h3>
        </div>

        <div className="mt-auto pt-1 flex items-center gap-2">
          <span className="text-base sm:text-lg font-extrabold text-[#333333]">
            ₹{item.price % 1 === 0 ? item.price : item.price.toFixed(2)}
          </span>
          {item.originalPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ₹{item.originalPrice % 1 === 0 ? item.originalPrice : item.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
