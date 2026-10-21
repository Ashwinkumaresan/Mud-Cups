import React, { useState, useEffect } from 'react';
import { FoodItem, CartItem } from '../types';
import { fetchComboDetail } from '../api';
import { withFallbackImage } from '../utils/image';

interface FoodDetailModalProps {
  item: FoodItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (customizedItem: CartItem) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [comboData, setComboData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && item && item.category === 'Combos') {
      fetchComboDetail(item.id)
        .then(setComboData)
        .catch(console.error);
    } else {
      setComboData(null);
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  let displayName = item.name;
  let subtitle = item.category;

  if ((item.category.toLowerCase() === 'combos' || item.category.toLowerCase() === 'combo') && item.name.includes('(')) {
    const match = item.name.match(/(.*?)\s*\((.*)\)/);
    if (match) {
      displayName = match[1].trim();
      subtitle = match[2].trim();
    }
  }

  const basePrice = item.price;
  const totalPrice = basePrice * quantity;

  const handleAddToCart = () => {
    onAddToCart({
      item,
      quantity,
      totalPrice,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end p-0 animate-fadeIn bg-black/60 backdrop-blur-sm">
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />

      <div className="bg-white w-full rounded-t-2xl shadow-2xl relative z-10 flex flex-col sm:flex-row max-h-[90vh] sm:h-[400px] animate-slideUp overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 sm:bg-gray-100 backdrop-blur sm:backdrop-blur-none rounded-full flex items-center justify-center text-gray-800 shadow-sm hover:bg-gray-100 transition-colors z-20"
        >
          <span className="material-symbols-outlined font-bold">close</span>
        </button>

        {/* Image Section (Top on mobile, Left on desktop) */}
        <div className="relative h-64 sm:h-full sm:w-1/2 bg-gray-100 shrink-0">
          <img src={withFallbackImage(item.image)} alt={item.name} className="w-full h-full object-cover" />

          <div className="absolute bottom-5 left-5 flex gap-2">
            <div className="bg-white/90 backdrop-blur rounded p shadow-sm flex items-center justify-center">
              {item.isVeg ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#10B981" strokeWidth="2" />
                  <circle cx="8" cy="8" r="4" fill="#10B981" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#EF4444" strokeWidth="2" />
                  <circle cx="8" cy="8" r="4" fill="#EF4444" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Right Section (Content + Footer) */}
        <div className="flex flex-col sm:w-1/2 bg-white flex-1 overflow-hidden">
          {/* Scrollable Content */}
          <div className="overflow-y-auto p-5 sm:p-6 sm:pt-16 space-y-1 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <h2 className="text-xl font-extrabold">{displayName}</h2>
            <div>
              <span className="font-extrabold text-xl text-[#1B4D3E]">
                ₹{item.price.toFixed(2)}
              </span>
              {item.originalPrice && (
                <div className="text-sm text-gray-400 line-through font-semibold mt-0.5">
                  ₹{item.originalPrice.toFixed(2)}
                </div>
              )}
            </div>
            <p className="text-sm text-[#6B6B6B] font-medium leading-relaxed">{subtitle}</p>

            {comboData && comboData.foods && comboData.foods.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="font-bold text-sm mb-4">Items included:</h3>
                <ul className="space-y-4">
                  {comboData.foods.map((food: any, idx: number) => (
                    <li key={idx} className="flex items-center gap-4">
                      <img 
                        src={withFallbackImage(food.image_url || food.image)} 
                        alt={food.name} 
                        className="w-14 h-14 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{food.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{food.category}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-white shrink-0 flex items-center gap-4">
            <div className="flex items-center justify-between bg-white border-[3px] border-[#FC9123] text-[#FC9123] rounded-lg px-2 shrink-0 h-11 sm:h-12 w-[110px] sm:w-[120px]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-full flex items-center justify-center font-bold text-2xl active:scale-90 transition-transform"
              >
                -
              </button>
              <span className="w-8 sm:w-10 text-center font-bold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-full flex items-center justify-center font-bold text-2xl active:scale-90 transition-transform"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 h-11 sm:h-12 bg-[#1B4D3E] text-sm text-white px-4 sm:px-6 rounded-lg font-bold shadow-sm hover:bg-[#123329] transition-colors flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2"
            >
              <span>Add to Cart</span>
              <span className="text-[10px] sm:text-base font-semibold sm:font-bold opacity-90 sm:opacity-100">₹{totalPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
