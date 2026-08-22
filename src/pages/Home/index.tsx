import React, { useState, useRef } from 'react';
import { FilterState, FoodItem, HeroDeal, Category, Banner } from '../../types';
import { HeroCarousel } from '../../components/Home/HeroCarousel';
import { CategoryList } from '../../components/Home/CategoryList';
import { FoodCard } from '../../components/Home/FoodCard';
import { SearchFilterBar } from '../../components/Home/SearchFilterBar';
import { OfferGameToggle } from '../../components/Home/OfferGameToggle';
import { HorizontalScrollList } from '../../components/Home/HorizontalScrollList';
import { SectionHeader } from '../../components/Home/SectionHeader';
import { HERO_DEALS, FOOD_ITEMS } from '../../data/mockData';
import { fetchBanners, fetchCombos, fetchOffers } from '../../api';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [offers, setOffers] = useState<FoodItem[]>([]);

  React.useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchBanners();
        setBanners(data);
      } catch (err) {
        console.error('Failed to load banners:', err);
      }
    };
    
    const loadCombos = async () => {
      try {
        const data = await fetchCombos();
        setCombos(data);
      } catch (err) {
        console.error('Failed to load combos:', err);
      }
    };

    const loadOffers = async () => {
      try {
        const data = await fetchOffers();
        setOffers(data);
      } catch (err) {
        console.error('Failed to load offers:', err);
      }
    };

    loadBanners();
    loadCombos();
    loadOffers();
  }, []);

  return (
    <div className="flex flex-col bg-white min-h-screen pb-24">

      <div>
        {/* Hero Carousel */}
        <HeroCarousel banners={banners.filter(b => b.show)} />
      </div>

      {/* Offer/Game Toggle Layout */}
      <OfferGameToggle />

      {/* Combos Section */}
      <div className="pt-2">
        <SectionHeader title="Combos You Need to Try" />
        <HorizontalScrollList>
          {combos.map((combo) => (
            <div key={combo.id} className="w-[calc(100vw-32px)] sm:w-[300px] shrink-0">
              <FoodCard
                item={combo}
                isFavorite={favorites.includes(combo.id)}
                onToggleFavorite={handleToggleFavorite}
                cartQuantity={getCartQuantity(combo)}
                onAddToCart={handleAddToCartSimple}
                onUpdateQuantity={handleUpdateQuantitySimple}
                onOpenDetail={(i) => setDetailItem(i)}
              />
            </div>
          ))}
        </HorizontalScrollList>
      </div>

      {/* Offers Section */}
      <div className="pt-2">
        <SectionHeader title="Discover Your Best Offers" />
        <HorizontalScrollList>
          {offers.map((offer) => (
            <div key={offer.id} className="w-[calc(100vw-32px)] sm:w-[300px] shrink-0">
              <FoodCard
                item={offer}
                isFavorite={favorites.includes(offer.id)}
                onToggleFavorite={handleToggleFavorite}
                cartQuantity={getCartQuantity(offer)}
                onAddToCart={handleAddToCartSimple}
                onUpdateQuantity={handleUpdateQuantitySimple}
                onOpenDetail={(i) => setDetailItem(i)}
              />
            </div>
          ))}
        </HorizontalScrollList>
      </div>

      {/* Explore Menu Section */}
      <div className="pt-2 bg-white" ref={menuRef}>
        <SectionHeader title="Explore Our Variety" />
      </div>
      <div className="px-4 sticky top-[36px] bg-white z-30 pb-2">
        <CategoryList
          categories={categories}
          selectedCategory={filters.selectedCategory}
          onSelectCategory={(cat) => {
            handleUpdateFilters({ selectedCategory: cat });
            setTimeout(() => {
              if (menuRef.current) {
                const yOffset = -100; 
                const y = menuRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
                window.scrollTo({ top: y, behavior: 'auto' });
              }
            }, 100);
          }}
        />
      </div>

      {/* Search & Filters */}
      <div className="pt-2">
        <SearchFilterBar filters={filters} handleUpdateFilters={handleUpdateFilters} />
      </div>

      {/* Food Grid Section */}
      <section className="pt-2 px-4">
        {filteredFoodItems.length === 0 ? (
          <div className="bg-[#F5F1E8] rounded-[16px] p-12 text-center border border-[#1B4D3E]/10 space-y-3">
            <span className="material-symbols-outlined text-4xl text-gray-400">
              no_food
            </span>
            <h3 className="text-lg font-bold text-[#1B4D3E]">No dishes found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try clearing or adjusting your search filters to view available options.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-[#1B4D3E] text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer shadow-sm"
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
