import React from 'react';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onSeeAll }) => {
  return (
    <div className="flex items-center justify-between px-4 mb-3">
      <h2 className="text-[#1B4D3E] font-black text-xl tracking-tight">
        {title}
      </h2>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="text-[#1B4D3E] text-sm font-bold flex items-center gap-1 active:opacity-70 transition-opacity"
        >
          See All
          <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
        </button>
      )}
    </div>
  );
};
