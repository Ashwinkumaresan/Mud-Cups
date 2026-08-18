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

  if ((item.category.toLowerCase() === 'combos' || item.category.toLowerCase() === 'combo') && item.name.includes('(')) {
    const match = item.name.match(/(.*?)\s*\((.*)\)/);
    if (match) {
      displayName = match[1].trim();
      subtitle = match[2].trim();
    }
  }

  return (
    <article className="bg-white shadow-sm rounded overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border border-gray-100 relative flex flex-col h-full">
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
      <div className="pt-1 pl-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h3
            onClick={() => onOpenDetail(item)}
            className="font-bold text-base text-[#1C1C1C] line-clamp-1 group-hover:text-[#1B4D3E] transition-colors cursor-pointer"
          >
            {displayName}
          </h3>

        </div>

        <p className="text-xs text-[#6B6B6B] line-clamp-1 mb-1 font-medium">
          {subtitle}
        </p>



        {/* Footer Price & Add Button */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 p-3">
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
            <div className="flex items-center gap-2 bg-white border border-[#1B4D3E] rounded px-2 py-1">
              <button
                onClick={() => onUpdateQuantity(item, -1)}
                className="text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white rounded w-5 h-5 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="text-xs font-bold text-[#1B4D3E] min-w-[14px] text-center">
                {cartQuantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item, 1)}
                className="text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white rounded w-5 h-5 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(item)}
              className="border-2 border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white px-4 py-1.5 rounded text-xs font-extrabold transition-all duration-200 cursor-pointer active:scale-95"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
