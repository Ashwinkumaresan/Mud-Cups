import React from 'react';
import { FoodItem } from '../../types';
import { FoodCard } from '../../components/Home/FoodCard';

interface CombosPageProps {
  foodItems: FoodItem[];
  favorites: string[];
  handleToggleFavorite: (id: string) => void;
  getCartQuantity: (item: FoodItem) => number;
  handleAddToCartSimple: (item: FoodItem) => void;
  handleUpdateQuantitySimple: (item: FoodItem, delta: number) => void;
  setDetailItem: (item: FoodItem) => void;
}

export const CombosPage: React.FC<CombosPageProps> = ({
  foodItems,
  favorites,
  handleToggleFavorite,
  getCartQuantity,
  handleAddToCartSimple,
  handleUpdateQuantitySimple,
  setDetailItem,
}) => {
  const combos = foodItems.filter((item) => item.category === 'Combos');

  return (
    <div className="bg-white min-h-[70vh] rounded shadow-sm border border-gray-100 p-4 md:p-6 mb-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <span className="material-symbols-outlined text-3xl text-[#1B4D3E]">restaurant_menu</span>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Best Combos</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Perfect meals curated just for you</p>
        </div>
      </div>
      
      {combos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No combos available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {combos.map((combo) => (
            <FoodCard
              key={combo.id}
              item={combo}
              isFavorite={favorites.includes(combo.id)}
              onToggleFavorite={handleToggleFavorite}
              cartQuantity={getCartQuantity(combo)}
              onAddToCart={handleAddToCartSimple}
              onUpdateQuantity={handleUpdateQuantitySimple}
              onOpenDetail={(i) => setDetailItem(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
