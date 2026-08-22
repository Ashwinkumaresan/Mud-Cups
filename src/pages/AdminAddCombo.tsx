import React, { useState, useEffect } from 'react';
import { createCombo, fetchFoodItems, fetchCombos, deleteCombo } from '../api';
import { FoodItem, Combo } from '../types';

export const AdminAddCombo: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [items, comboList] = await Promise.all([
        fetchFoodItems(),
        fetchCombos()
      ]);
      setFoodItems(items);
      setCombos(comboList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleOpenModal = () => {
    setFormData({
      name: '',
      price: '',
    });
    setSelectedItems([]);
    setItemSearchQuery('');
    setImageFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const calculatedOriginalPrice = selectedItems.reduce((total, itemId) => {
    const item = foodItems.find(f => f.id === itemId);
    return total + (item ? parseFloat(item.price) : 0);
  }, 0);

  const isComboVeg = selectedItems.length > 0 
    ? selectedItems.every(itemId => foodItems.find(f => f.id === itemId)?.isVeg)
    : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || selectedItems.length === 0) {
      alert('Please fill all required fields and select at least one item');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('combo_reduced_price', formData.price);
      if (calculatedOriginalPrice > 0) {
        data.append('original_total', calculatedOriginalPrice.toString());
      }
      data.append('veg', isComboVeg ? 'True' : 'False');
      
      selectedItems.forEach(id => {
        data.append('food_ids', id);
      });

      if (imageFile) {
        data.append('image', imageFile);
      }
      
      await createCombo(data);
      setIsModalOpen(false);
      loadData(); // reload to get new combo
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to create combo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (comboId: string) => {
    if (!window.confirm("Are you sure you want to delete this combo?")) return;
    try {
      await deleteCombo(comboId);
      setCombos(prev => prev.filter(c => c.id !== comboId));
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete combo');
    }
  };

  const filteredCombos = combos.filter(combo => {
    const matchesSearch = combo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          combo.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = vegFilter === 'all' ? true : (vegFilter === 'veg' ? combo.isVeg : !combo.isVeg);
    return matchesSearch && matchesVeg;
  });

  const filteredModalFoodItems = foodItems.filter(item => 
    item.name.toLowerCase().includes(itemSearchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto w-full pb-12 animate-fadeIn space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#271717] mb-1">Combos</h2>
          <p className="text-gray-500">Manage your combo deals and offers.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Veg Filter */}
          <div className="flex bg-gray-100 rounded p-1 w-full sm:w-auto shrink-0">
            <button 
              onClick={() => setVegFilter('all')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-sm font-semibold transition-colors ${vegFilter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              All
            </button>
            <button 
              onClick={() => setVegFilter('veg')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-1 ${vegFilter === 'veg' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-green-700'}`}
            >
              <span className="material-symbols-outlined text-[16px]">eco</span> Veg
            </button>
            <button 
              onClick={() => setVegFilter('non-veg')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-1 ${vegFilter === 'non-veg' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-500 hover:text-red-700'}`}
            >
              <span className="material-symbols-outlined text-[16px]">restaurant</span> Non-Veg
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Search combos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none transition-all"
            />
          </div>

          <button 
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 bg-[#1B4D3E] text-white px-5 py-2.5 rounded font-bold hover:bg-[#123329] transition-colors whitespace-nowrap w-full sm:w-auto"
          >
            <span className="material-symbols-outlined">add</span>
            Add Combo
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#1B4D3E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCombos.map(combo => (
            <div key={combo.id} className="bg-white rounded p-4 shadow-sm border border-gray-100 flex items-center gap-4 group">
              <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden shrink-0">
                {combo.image ? (
                  <img src={combo.image} alt={combo.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined">auto_awesome</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`material-symbols-outlined text-[14px] shrink-0 ${combo.isVeg ? 'text-[#1B4D3E]' : 'text-red-600'}`}>
                    {combo.isVeg ? 'eco' : 'restaurant'}
                  </span>
                  <h3 className="font-bold text-[#271717] truncate">{combo.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1B4D3E]">₹{combo.price}</span>
                  {combo.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">₹{combo.originalPrice}</span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => handleDelete(combo.id)}
                className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 shrink-0"
                title="Delete combo"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
          
          {filteredCombos.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No combos found matching your filters.
            </div>
          )}
        </div>
      )}

      {/* Add Combo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded w-full max-w-2xl shadow-2xl overflow-hidden animate-slideUp flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-xl font-extrabold text-[#271717]">Add New Combo</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              <form id="add-combo-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Combo Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded border border-gray-200 focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Breakfast Special"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Combo Reduced Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full px-4 py-3 rounded border border-gray-200 focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none transition-all"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Original Total (₹)</label>
                    <div className="w-full px-4 py-3 rounded border border-gray-200 bg-gray-50 text-gray-500 transition-all flex items-center">
                      {calculatedOriginalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700">Select Items for Combo *</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                      <input 
                        type="text"
                        placeholder="Search items..."
                        value={itemSearchQuery}
                        onChange={(e) => setItemSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none w-48"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded border border-gray-200">
                    {filteredModalFoodItems.map(item => (
                      <label key={item.id} className="flex items-center gap-3 p-3 bg-white rounded border border-gray-100 cursor-pointer hover:border-[#1B4D3E] transition-colors shadow-sm">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItem(item.id)}
                          className="w-5 h-5 text-[#1B4D3E] rounded focus:ring-[#1B4D3E]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">₹{item.price}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dietary Preference (Auto)</label>
                    <div className="flex gap-4">
                      <div className={`flex-1 flex items-center justify-center gap-2 border rounded py-2.5 transition-colors ${isComboVeg ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-400 bg-gray-50'}`}>
                        <span className="material-symbols-outlined text-[18px]">eco</span>
                        <span className="text-sm font-bold">Veg</span>
                      </div>
                      <div className={`flex-1 flex items-center justify-center gap-2 border rounded py-2.5 transition-colors ${!isComboVeg ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 text-gray-400 bg-gray-50'}`}>
                        <span className="material-symbols-outlined text-[18px]">restaurant</span>
                        <span className="text-sm font-bold">Non-Veg</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Combo Image</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-gray-400 text-2xl">image</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="cursor-pointer inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border border-gray-300 rounded text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                          <span className="material-symbols-outlined text-sm">upload</span>
                          Upload Image
                          <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} required />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 shrink-0 bg-gray-50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 rounded font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-combo-form"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded font-bold text-white bg-[#1B4D3E] hover:bg-[#123329] transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>Save Combo</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
