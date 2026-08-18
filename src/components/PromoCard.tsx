import React from 'react';

interface PromoCardProps {
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  tag?: string;
  isVeg?: boolean;
}

export const PromoCard: React.FC<PromoCardProps> = ({
  image,
  title,
  price,
  originalPrice,
  tag,
  isVeg,
}) => {
  return (
    <div className="w-[180px] bg-white rounded overflow-hidden shadow-sm border border-gray-100 flex flex-col cursor-pointer active:scale-95 transition-transform">
      <div className="relative h-[120px] w-full">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {tag && (
          <div className="absolute top-2 left-2 bg-[#1B4D3E] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
            {tag}
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-1 mb-1">
          <h4 className="font-bold text-[#1C1C1C] text-sm line-clamp-2 leading-tight">
            {title}
          </h4>
          {isVeg !== undefined && (
            <span className={`material-symbols-outlined text-[14px] shrink-0 ${isVeg ? 'text-[#1B4D3E]' : 'text-red-600'}`}>
              {isVeg ? 'eco' : 'local_fire_department'}
            </span>
          )}
        </div>
        <div className="mt-auto flex items-center gap-1.5">
          <span className="font-extrabold text-[#1B4D3E] text-sm">
            ₹{price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
