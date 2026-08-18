import React from 'react';
import { FoodItem } from '../../types';
import { FoodCard } from '../../components/Home/FoodCard';

interface OffersPageProps {
  foodItems: FoodItem[];
  favorites: string[];
  handleToggleFavorite: (id: string) => void;
  getCartQuantity: (item: FoodItem) => number;
  handleAddToCartSimple: (item: FoodItem) => void;
  handleUpdateQuantitySimple: (item: FoodItem, delta: number) => void;
  setDetailItem: (item: FoodItem) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({
  foodItems,
  favorites,
  handleToggleFavorite,
  getCartQuantity,
  handleAddToCartSimple,
  handleUpdateQuantitySimple,
  setDetailItem,
}) => {
  const offers = foodItems.filter((item) => item.category === 'Offers');

  return (
    <div className="bg-white min-h-[70vh] rounded shadow-sm border border-gray-100 p-4 md:p-6 mb-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <span className="material-symbols-outlined text-3xl text-[#1B4D3E]">local_offer</span>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Latest Offers</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Grab these deals before they are gone!</p>
        </div>
      </div>
      
      {offers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No offers available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {offers.map((offer) => (
            <FoodCard
              key={offer.id}
              item={offer}
              isFavorite={favorites.includes(offer.id)}
              onToggleFavorite={handleToggleFavorite}
              cartQuantity={getCartQuantity(offer)}
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
