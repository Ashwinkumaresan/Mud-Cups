import React, { useState } from 'react';
import { FilterState, FoodItem, HeroDeal } from '../../types';
import { HeroCarousel } from '../../components/HeroCarousel';
import { CategoryList } from '../../components/CategoryList';
import { FoodCard } from '../../components/FoodCard';
import { HERO_DEALS } from '../../data/mockData';
import { Category } from '../../types';

interface HomeProps {
  categories: Category[];
  handleOrderDeal: (deal: HeroDeal) => void;
  filters: FilterState;
  handleUpdateFilters: (updated: Partial<FilterState>) => void;
  activeFilterCount: number;
  handleResetFilters: () => void;
  filteredFoodItems: FoodItem[];
  favorites: string[];
  handleToggleFavorite: (id: string) => void;
  getCartQuantity: (item: FoodItem) => number;
  handleAddToCartSimple: (item: FoodItem) => void;
  handleUpdateQuantitySimple: (item: FoodItem, delta: number) => void;
  setDetailItem: (item: FoodItem) => void;
}

export const Home: React.FC<HomeProps> = ({
  categories,
  handleOrderDeal,
  filters,
  handleUpdateFilters,
  activeFilterCount,
  handleResetFilters,
  filteredFoodItems,
  favorites,
  handleToggleFavorite,
  getCartQuantity,
  handleAddToCartSimple,
  handleUpdateQuantitySimple,
  setDetailItem,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const popularSearches = [
    'Truffle Mushroom Pizza',
    'Butter Chicken',
    'Burgers',
    'Sushi',
    'Veg Dishes',
    'Drinks',
  ];

  const handleSelectSuggestion = (suggestion: string) => {
    handleUpdateFilters({ searchQuery: suggestion });
    setIsSearchFocused(false);
  };

  return (
    <div className="space-y-2 animate-fadeIn">
      {/* Hero Carousel */}
      <HeroCarousel deals={HERO_DEALS} onOrderDeal={handleOrderDeal} />

      {/* Categories Carousel */}
      <CategoryList
        categories={categories}
        selectedCategory={filters.selectedCategory}
        onSelectCategory={(cat) => handleUpdateFilters({ selectedCategory: cat })}
      />

      {/* Search & Filters */}
      <div className="flex flex-row items-center gap-3  mx-auto w-full sticky top-16 bg-white/10 backdrop-blur-sm py-2 z-10">
        {/* Search Bar */}
        <div className="flex flex-1 w-full relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] pointer-events-none text-xl">
            search
          </span>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => handleUpdateFilters({ searchQuery: e.target.value })}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search for food, cuisines or restaurants..."
            className="w-full bg-white shadow-sm text-[#1C1C1C] placeholder-[#6B6B6B] border border-gray-200 rounded-xl pl-12 pr-10 py-3 focus:outline-none focus:border-[#b7122a] focus:ring-2 focus:ring-[#b7122a]/20 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleUpdateFilters({ searchQuery: '' })}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs rounded-full p-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          )}

          {/* Autocomplete Suggestions Overlay */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 py-3 px-2 z-50">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pb-2">
                Popular Searches
              </div>
              <div className="flex flex-col gap-1">
                {popularSearches
                  .filter((s) => s.toLowerCase().includes(filters.searchQuery.toLowerCase()))
                  .map((suggestion) => (
                    <button
                      key={suggestion}
                      onMouseDown={() => handleSelectSuggestion(suggestion)}
                      className="flex items-center gap-2 text-left px-3 py-2 text-sm text-[#1C1C1C] hover:bg-gray-50 hover:text-[#b7122a] rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-gray-400 text-base">
                        trending_up
                      </span>
                      <span>{suggestion}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Veg Only Checkbox Label */}
        <label className={`flex items-center justify-center gap-1.5 cursor-pointer border px-4 py-3 rounded-xl shadow-sm transition-all text-sm font-semibold shrink-0 w-auto ${
          filters.vegOnly
            ? 'bg-[#48A860]/10 border-[#48A860] text-[#48A860]'
            : 'bg-white border-gray-200 text-[#1C1C1C] hover:bg-gray-50'
        }`}>
          <input
            type="checkbox"
            checked={filters.vegOnly}
            onChange={(e) => handleUpdateFilters({ vegOnly: e.target.checked })}
            className="hidden"
          />
          <span className="material-symbols-outlined text-[#48A860] text-[18px]">
            {filters.vegOnly ? 'check_box' : 'eco'}
          </span>
          <span>Veg</span>
        </label>
      </div>

      {/* Food Grid Section */}
      <section className="space-y-4">
        {filteredFoodItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 space-y-3">
            <span className="material-symbols-outlined text-4xl text-gray-400">
              no_food
            </span>
            <h3 className="text-lg font-bold text-gray-800">No dishes found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try clearing or adjusting your search filters to view available options.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-[#b7122a] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFoodItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
                cartQuantity={getCartQuantity(item)}
                onAddToCart={handleAddToCartSimple}
                onUpdateQuantity={handleUpdateQuantitySimple}
                onOpenDetail={(i) => setDetailItem(i)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
