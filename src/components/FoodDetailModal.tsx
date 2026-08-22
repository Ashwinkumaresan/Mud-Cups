import React, { useState, useEffect } from 'react';
import { FoodItem, CartItem } from '../types';
import { fetchComboDetail } from '../api';

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
    <div className="fixed inset-0 z-50 flex justify-center items-end sm:items-center p-0 sm:p-4 animate-fadeIn bg-black/60 backdrop-blur-sm">
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />

      <div className="bg-white w-full sm:max-w-lg rounded-t sm:rounded shadow-2xl relative z-10 flex flex-col max-h-[90vh] animate-slideUp overflow-hidden">

        {/* Image Section */}
        <div className="relative h-64 md:h-80 w-full bg-gray-100 shrink-0">
          <img src={item.image || 'https://via.placeholder.com/400x300?text=No+Image'} alt={item.name} className="w-full h-full object-cover" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-sm hover:bg-white transition-colors"
          >
            <span className="material-symbols-outlined font-bold">close</span>
          </button>

          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur ${item.isVeg ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
              {item.isVeg ? 'VEG' : 'NON-VEG'}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-xl font-extrabold">{displayName}</h2>
            <div className="text-right shrink-0">
              <span className="font-extrabold text-xl text-[#1B4D3E]">
                ₹{item.price.toFixed(2)}
              </span>
              {item.originalPrice && (
                <div className="text-sm text-gray-400 line-through font-semibold mt-0.5">
                  ₹{item.originalPrice.toFixed(2)}
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-[#6B6B6B] font-medium">{subtitle}</p>

          {comboData && comboData.foods && comboData.foods.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="font-bold text-sm mb-3">Items included:</h3>
              <ul className="space-y-3">
                {comboData.foods.map((food: any, idx: number) => (
                  <li key={idx} className="flex items-center gap-3">
                    <img 
                      src={food.image_url || 'https://via.placeholder.com/100'} 
                      alt={food.name} 
                      className="w-12 h-12 object-cover rounded shadow-sm"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{food.name}</p>
                      <p className="text-xs text-gray-500">{food.category}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-white shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] shrink-0 flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded p-1 shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded flex items-center justify-center text-gray-700 font-bold hover:bg-white hover:shadow-sm transition-all"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <span className="w-10 text-center font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded flex items-center justify-center text-gray-700 font-bold hover:bg-white hover:shadow-sm transition-all"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#1B4D3E] text-white py-3.5 px-6 rounded font-bold shadow-sm hover:bg-[#123329] transition-colors flex justify-between items-center"
          >
            <span>Add to Cart</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
