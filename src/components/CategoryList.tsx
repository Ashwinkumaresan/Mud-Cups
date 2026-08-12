import React from 'react';
import { Category } from '../types';

interface CategoryListProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="w-full">
      <div className="flex gap-4 md:gap-5 pt-2 overflow-x-auto pb-2 carousel-container snap-x items-center">
        {/* All Categories Pill */}
        <button
          onClick={() => onSelectCategory(null)}
          className="flex flex-col items-center gap-2 min-w-[76px] snap-start group cursor-pointer"
        >
          <div
            className={`w-[55px] h-[55px] rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
              selectedCategory === null
                ? 'bg-[#b7122a] text-white ring-4 ring-[#b7122a]/20 scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">grid_view</span>
          </div>
          <span
            className={`text-xs font-semibold text-center transition-colors ${
              selectedCategory === null ? 'text-[#b7122a] font-bold' : 'text-[#1C1C1C]'
            }`}
          >
            All Items
          </span>
        </button>

        {/* Category Avatars */}
        {categories.map((cat) => {
          const isSelected = selectedCategory?.toLowerCase() === cat.name.toLowerCase();
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.name)}
              className="flex flex-col items-center gap-2 min-w-[76px] snap-start group cursor-pointer"
            >
              <div
                className={`w-[72px] h-[72px] rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-200 relative bg-gray-50 ${
                  isSelected
                    ? 'ring-4 ring-[#b7122a] scale-105'
                    : 'ring-2 ring-transparent group-hover:ring-[#b7122a]/30'
                }`}
              >
                <img
                  src={cat.image || 'https://via.placeholder.com/100x100?text=Category'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span
                className={`text-xs font-semibold text-center transition-colors ${
                  isSelected ? 'text-[#b7122a] font-bold' : 'text-[#1C1C1C] group-hover:text-[#b7122a]'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
