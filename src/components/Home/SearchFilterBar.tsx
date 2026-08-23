import React, { useState } from 'react';
import { FilterState } from '../../types';

interface SearchFilterBarProps {
  filters: FilterState;
  handleUpdateFilters: (updated: Partial<FilterState>) => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filters,
  handleUpdateFilters,
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
    <div className="flex flex-row items-center gap-3 px-4 w-full py-2 mb-2">
      {/* Search Bar */}
      <div className="flex flex-1 w-full relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#1B4D3E] pointer-events-none text-[20px]">
          search
        </span>
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => handleUpdateFilters({ searchQuery: e.target.value })}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          placeholder="Search for dishes..."
          className="w-full h-10 bg-[#f3f3f3] text-[#1C1C1C] placeholder-gray-500 rounded pl-12 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]/30 transition-all shadow-inner"
        />
        {filters.searchQuery && (
          <button
            onClick={() => handleUpdateFilters({ searchQuery: '' })}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs rounded-full p-1 cursor-pointer bg-white shadow-sm"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        )}

        {/* Autocomplete Suggestions Overlay */}
        {isSearchFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[16px] shadow-lg border border-gray-100 py-3 px-2 z-50">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 pb-2">
              Popular Searches
            </div>
            <div className="flex flex-col gap-1">
              {popularSearches
                .filter((s) => s.toLowerCase().includes(filters.searchQuery.toLowerCase()))
                .map((suggestion) => (
                  <button
                    key={suggestion}
                    onMouseDown={() => handleSelectSuggestion(suggestion)}
                    className="flex items-center gap-2 text-left px-3 py-2.5 text-sm text-[#1C1C1C] hover:bg-[#F5F1E8] hover:text-[#1B4D3E] rounded transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-gray-400 text-base">
                      trending_up
                    </span>
                    <span className="font-medium">{suggestion}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Veg Only Checkbox Label */}
      <label
        className={`flex items-center justify-center h-10 gap-2 cursor-pointer border px-3 rounded shadow-sm transition-all text-sm font-semibold shrink-0 w-auto bg-white ${
          filters.vegOnly ? 'border-green-500' : 'border-gray-200 hover:bg-gray-50'
        }`}
      >
        <input
          type="checkbox"
          checked={filters.vegOnly}
          onChange={(e) => handleUpdateFilters({ vegOnly: e.target.checked })}
          className="hidden"
        />
        {/* Card Veg Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {filters.vegOnly ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#10B981" strokeWidth="2" />
              <circle cx="8" cy="8" r="4" fill="#10B981" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke="#9CA3AF" strokeWidth="2" />
              <circle cx="8" cy="8" r="4" fill="#9CA3AF" />
            </svg>
          )}
        </div>
        <span className={filters.vegOnly ? 'text-green-700' : 'text-gray-700'}>
          Veg
        </span>
      </label>
    </div>
  );
};
