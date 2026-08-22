import React, { useState, useEffect } from 'react';
import { fetchFoodItems, fetchOffers, updateFoodItem } from '../api';
import { FoodItem } from '../types';

export const AdminAddOffer: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [offers, setOffers] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  
  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const items = await fetchFoodItems();
        setFoodItems(items);

        const activeOffers = await fetchOffers();
        setOffers(activeOffers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || !offerPrice) return;

    try {
      await updateFoodItem(selectedItemId, { discount_price: Number(offerPrice) });
      const activeOffers = await fetchOffers();
      setOffers(activeOffers);
      setSelectedItemId('');
      setOfferPrice('');
      setIsModalOpen(false);
    } catch(err) {
      console.error(err);
      alert('Failed to add offer');
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this offer?")) return;
    try {
      await updateFoodItem(id, { discount_price: 0.00 });
      const activeOffers = await fetchOffers();
      setOffers(activeOffers);
    } catch(err) {
      console.error(err);
      alert('Failed to remove offer');
    }
  };

  const filteredOffers = offers.filter(offer => 
    offer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFoodItems = foodItems.filter(item => 
    item.name.toLowerCase().includes(itemSearchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1B4D3E] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full pb-12 animate-fadeIn space-y-8">
      {/* Header section matching AdminAddFoodItem */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#271717] mb-1">Offers</h2>
          <p className="text-gray-500">Manage your active product offers.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Search offers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none transition-all"
            />
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#1B4D3E] text-white px-5 py-2.5 rounded font-bold hover:bg-[#123329] transition-colors whitespace-nowrap w-full sm:w-auto"
          >
            <span className="material-symbols-outlined">add</span>
            Add Offer
          </button>
        </div>
      </div>

      {/* Grid of Offers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map(offer => (
          <div key={offer.id} className="bg-white rounded p-4 shadow-sm border border-gray-100 flex items-center gap-4 group">
            <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden shrink-0">
              {offer.image ? (
                <img src={offer.image} alt={offer.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined">local_offer</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className={`material-symbols-outlined text-[14px] shrink-0 ${offer.isVeg ? 'text-[#1B4D3E]' : 'text-red-600'}`}>
                  {offer.isVeg ? 'eco' : 'restaurant'}
                </span>
                <h3 className="font-bold text-[#271717] truncate">{offer.name}</h3>
              </div>
              <p className="text-xs text-gray-500 truncate mb-1">{offer.category}</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1B4D3E]">₹{offer.price}</span>
                <span className="text-xs text-gray-400 line-through">₹{offer.originalPrice}</span>
              </div>
            </div>
            <button 
              onClick={() => handleDeleteOffer(offer.id)}
              className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 shrink-0"
              title="Delete offer"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
        
        {filteredOffers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded shadow-sm border border-gray-100">
            {searchQuery ? 'No offers found matching your search.' : 'No active offers. Click "Add Offer" to create one!'}
          </div>
        )}
      </div>

      {/* Add Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded w-full max-w-lg shadow-2xl overflow-hidden animate-slideUp flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-xl font-extrabold text-[#271717]">Add New Offer</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleAddOffer} className="space-y-6">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Product *</label>
                  
                  {/* Custom Dropdown Trigger */}
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-3 rounded border border-gray-200 bg-white flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none transition-all"
                  >
                    <span className={selectedItemId ? "text-gray-900 font-medium" : "text-gray-500"}>
                      {selectedItemId 
                        ? (foodItems.find(i => i.id === selectedItemId)?.name || '-- Choose a Product --') 
                        : '-- Choose a Product --'}
                    </span>
                    <span className="material-symbols-outlined text-gray-500">expand_more</span>
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                      <div className="p-2 border-b border-gray-100 bg-gray-50">
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                          <input
                            type="text"
                            autoFocus
                            placeholder="Search products..."
                            value={itemSearchQuery}
                            onChange={(e) => setItemSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <ul className="max-h-56 overflow-y-auto py-1">
                        {filteredFoodItems.length > 0 ? (
                          filteredFoodItems.map(item => (
                            <li 
                              key={item.id}
                              onClick={() => {
                                setSelectedItemId(item.id);
                                setIsDropdownOpen(false);
                                setItemSearchQuery('');
                              }}
                              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex justify-between items-center ${selectedItemId === item.id ? 'bg-[#1B4D3E]/10 text-[#1B4D3E]' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              <span className={selectedItemId === item.id ? 'font-bold' : ''}>{item.name}</span>
                              <span className={selectedItemId === item.id ? 'font-bold' : 'text-gray-500'}>₹{item.price}</span>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-4 text-sm text-gray-500 text-center">No products found.</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Offer Price (₹) *</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter discounted price"
                    className="w-full px-4 py-3 rounded border border-gray-200 focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 border border-gray-200 text-gray-700 font-bold rounded hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#1B4D3E] text-white font-bold rounded hover:bg-[#143d31] transition-colors shadow-sm"
                  >
                    Add Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
