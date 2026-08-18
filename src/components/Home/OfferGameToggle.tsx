import React, { useState } from 'react';
import { HorizontalScrollList } from './HorizontalScrollList';

interface OfferGameToggleProps {
  // We can pass real offers data here later
}

export const OfferGameToggle: React.FC<OfferGameToggleProps> = () => {
  const [activeTab, setActiveTab] = useState<'offer' | 'game'>('offer');

  const offers = [
    { id: 1, title: '20% off', desc: 'on orders above ₹300', code: 'TASTY20' },
    { id: 2, title: 'Free Delivery', desc: 'on your first 3 orders', code: 'NEWBIE' },
    { id: 3, title: 'Flat ₹150 off', desc: 'on orders above ₹600', code: 'BIGMEAL' },
  ];

  const games = [
    { id: 1, title: 'Business', members: '5 Members', desc: 'Get the board game!', icon: 'business_center' },
    { id: 2, title: 'Chess', members: '2 Members', desc: 'Classic strategy game!', icon: 'extension' },
    { id: 3, title: 'Ludo', members: '4 Members', desc: 'Fun for the family!', icon: 'casino' },
  ];

  return (
    <div className="py-2 w-full mt-2">
      {/* Toggle Pill */}
      <div className="flex bg-white rounded-full p-0.5 border border-gray-200 w-max mx-auto mb-2">
        <button
          onClick={() => setActiveTab('offer')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'offer'
              ? 'bg-[#1B4D3E] text-white shadow-sm'
              : 'bg-transparent text-[#1B4D3E]'
          }`}
        >
          Offer
        </button>
        <button
          onClick={() => setActiveTab('game')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'game'
              ? 'bg-[#1B4D3E] text-white shadow-sm'
              : 'bg-transparent text-[#1B4D3E]'
          }`}
        >
          Game
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'offer' ? (
        <HorizontalScrollList autoScroll={true}>
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="w-[calc(100vw-32px)] md:w-[300px] shrink-0 bg-white rounded-[10px] p-3 border border-[#1B4D3E]/20 shadow-sm flex flex-row items-center gap-3 relative overflow-hidden text-left"
            >
              <div className="absolute -right-3 -top-3 w-10 h-10 bg-[#1B4D3E]/5 rounded-full" />
              <div className="absolute -left-3 -bottom-3 w-8 h-8 bg-[#1B4D3E]/5 rounded-full" />
              
              <div className="flex-shrink-0 w-12 h-12 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-[#1B4D3E] text-xl">
                  local_offer
                </span>
              </div>
              
              <div className="flex-grow relative z-10">
                <h3 className="text-[#1B4D3E] font-black text-sm mb-0.5">{offer.title}</h3>
                <p className="text-gray-500 text-[10px] font-medium">{offer.desc}</p>
              </div>
              
              <div className="flex-shrink-0 relative z-10">
                <div className="border border-dashed border-[#1B4D3E] bg-[#1B4D3E]/5 px-2 py-1 rounded text-[#1B4D3E] font-bold text-[10px]">
                  {offer.code}
                </div>
              </div>
            </div>
          ))}
        </HorizontalScrollList>
      ) : (
        <HorizontalScrollList autoScroll={false}>
          {games.map((game) => (
            <div
              key={game.id}
              className="w-[calc(100vw-32px)] md:w-[300px] shrink-0 bg-white rounded-[10px] p-3 border border-[#1B4D3E]/20 shadow-sm flex flex-row items-center gap-3 relative overflow-hidden text-left"
            >
              <div className="absolute -right-3 -top-3 w-10 h-10 bg-[#1B4D3E]/5 rounded-full" />
              <div className="absolute -left-3 -bottom-3 w-8 h-8 bg-[#1B4D3E]/5 rounded-full" />
              
              <div className="flex-shrink-0 w-12 h-12 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center relative z-10">
                <span className="material-symbols-outlined text-[#1B4D3E] text-xl">
                  {game.icon}
                </span>
              </div>
              
              <div className="flex-grow relative z-10">
                <h3 className="text-[#1B4D3E] font-black text-sm mb-0.5">{game.title}</h3>
                <p className="text-gray-500 text-[10px] font-medium">{game.desc}</p>
              </div>
              
              <div className="flex-shrink-0 relative z-10">
                <div className="border border-dashed border-[#1B4D3E] bg-[#1B4D3E]/5 px-2 py-1 rounded text-[#1B4D3E] font-bold text-[10px]">
                  {game.members}
                </div>
              </div>
            </div>
          ))}
        </HorizontalScrollList>
      )}
    </div>
  );
};
