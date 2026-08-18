import React from 'react';
import { Category } from '../../types';

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
          className="flex flex-col items-center gap-1.5 min-w-[60px] snap-start group cursor-pointer"
        >
          <div
            className={`w-[48px] h-[48px] rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
              selectedCategory === null
                ? 'bg-[#1B4D3E] text-white ring-2 ring-[#1B4D3E]/20 scale-105'
                : 'bg-[#F5F1E8] text-gray-700 hover:bg-[#F5F1E8]/80 border border-gray-200'
            }`}
          >
            <span className="material-symbols-outlined text-xl">grid_view</span>
          </div>
          <span
            className={`text-[10px] font-semibold text-center transition-colors ${
              selectedCategory === null ? 'text-[#1B4D3E] font-bold' : 'text-[#1C1C1C]'
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
              className="flex flex-col items-center gap-1.5 min-w-[64px] snap-start group cursor-pointer"
            >
              <div
                className={`w-[56px] h-[56px] rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-200 relative bg-[#F5F1E8] ${
                  isSelected
                    ? 'ring-4 ring-[#1B4D3E] scale-105'
                    : 'ring-2 ring-transparent group-hover:ring-[#1B4D3E]/30'
                }`}
              >
                <img
                  src={cat.image || 'https://via.placeholder.com/100x100?text=Category'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span
                className={`text-[10px] leading-tight font-semibold text-center transition-colors ${
                  isSelected ? 'text-[#1B4D3E] font-bold' : 'text-[#1C1C1C] group-hover:text-[#1B4D3E]'
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
