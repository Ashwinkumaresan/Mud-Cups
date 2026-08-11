import React from 'react';
import { FoodItem } from '../types';

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

  if ((item.category.toLowerCase() === 'combos' || item.category.toLowerCase() === 'combo') && item.name.includes('(')) {
    const match = item.name.match(/(.*?)\s*\((.*)\)/);
    if (match) {
      displayName = match[1].trim();
      subtitle = match[2].trim();
    }
  }

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 group border border-gray-100 relative flex flex-col h-full">
      {/* Image & Badges Container */}
      <div
        onClick={() => onOpenDetail(item)}
        className="relative h-48 w-full overflow-hidden bg-gray-100 cursor-pointer"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${item.image || 'https://via.placeholder.com/400x300?text=No+Image'}')` }}
        />



        {/* Veg / Non-Veg Indicator Badge */}
        <span
          className={`absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold border ${item.isVeg
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-rose-50 text-rose-700 border-rose-300'
            }`}
        >
          {item.isVeg ? 'VEG' : 'NON-VEG'}
        </span>


      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3
            onClick={() => onOpenDetail(item)}
            className="font-bold text-base text-[#1C1C1C] line-clamp-1 group-hover:text-[#b7122a] transition-colors cursor-pointer"
          >
            {displayName}
          </h3>

        </div>

        <p className="text-xs text-[#6B6B6B] line-clamp-1 mb-2 font-medium">
          {subtitle}
        </p>



        {/* Footer Price & Add Button */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold text-[#1C1C1C]">
                ₹{item.price.toFixed(2)}
              </span>
              {item.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{item.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {cartQuantity > 0 ? (
            <div className="flex items-center gap-2 bg-white border border-[#b7122a] rounded-lg px-2 py-1">
              <button
                onClick={() => onUpdateQuantity(item, -1)}
                className="text-[#b7122a] hover:bg-[#b7122a] hover:text-white rounded w-5 h-5 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="text-xs font-bold text-[#b7122a] min-w-[14px] text-center">
                {cartQuantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item, 1)}
                className="text-[#b7122a] hover:bg-[#b7122a] hover:text-white rounded w-5 h-5 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(item)}
              className="border-2 border-[#b7122a] text-[#b7122a] hover:bg-[#b7122a] hover:text-white px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 cursor-pointer active:scale-95"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
