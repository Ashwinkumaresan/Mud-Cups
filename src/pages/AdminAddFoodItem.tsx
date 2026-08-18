import React, { useState, useEffect } from 'react';
import { createFoodItem, fetchCategories, fetchFoodItems, deleteFoodItem } from '../api';
import { Category, FoodItem } from '../types';

export const AdminAddFoodItem: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    originalPrice: '',
    isVeg: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cats, items] = await Promise.all([
        fetchCategories(),
        fetchFoodItems()
      ]);
      setCategories(cats);
      setFoodItems(items);
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
      categoryId: '',
      price: '',
      originalPrice: '',
      isVeg: true,
    });
    setImageFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.categoryId || !formData.price) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('categoryId', formData.categoryId);
      data.append('price', formData.price);
      if (formData.originalPrice) {
        data.append('originalPrice', formData.originalPrice);
      }
      data.append('isVeg', formData.isVeg.toString());
      if (imageFile) {
        data.append('image', imageFile);
      }
      
      await createFoodItem(data);
      setIsModalOpen(false);
      loadData(); // reload food items and categories
    } catch (err) {
      console.error(err);
      alert('Failed to add food item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!window.confirm(`Are you sure you want to delete food item "${itemId}"?`)) return;
    try {
      await deleteFoodItem(itemId);
      setFoodItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete food item');
    }
  };

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = vegFilter === 'all' ? true : (vegFilter === 'veg' ? item.isVeg : !item.isVeg);
    return matchesSearch && matchesVeg;
  });

  return (
    <div className="max-w-6xl mx-auto w-full pb-12 animate-fadeIn space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#271717] mb-1">Food Items</h2>
          <p className="text-gray-500">Manage your individual menu items.</p>
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
              placeholder="Search items..." 
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
            Add Item
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#1B4D3E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded p-4 shadow-sm border border-gray-100 flex items-center gap-4 group">
              <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined">fastfood</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`material-symbols-outlined text-[14px] shrink-0 ${item.isVeg ? 'text-[#1B4D3E]' : 'text-red-600'}`}>
                    {item.isVeg ? 'eco' : 'restaurant'}
                  </span>
                  <h3 className="font-bold text-[#271717] truncate">{item.name}</h3>
                </div>
                <p className="text-xs text-gray-500 truncate mb-1">{item.category}</p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1B4D3E]">₹{item.price}</span>
                  {item.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                  )}
                </div>
              </div>
              <button 
                onClick={() => handleDelete(item.id)}
                className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 shrink-0"
                title="Delete item"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No food items found matching your filters.
            </div>
          )}
        </div>
      )}

      {/* Add Food Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded w-full max-w-2xl shadow-2xl overflow-hidden animate-slideUp flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-xl font-extrabold text-[#271717]">Add New Food Item</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex-1">
              <form id="add-food-item-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Item Name *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded border border-gray-200 focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none transition-all"
                      placeholder="e.g., Filter Coffee"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                    <select
                      required
                      className="w-full px-4 py-3 rounded border border-gray-200 focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none transition-all bg-white appearance-none"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₹) *</label>
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Dietary Preference *</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer border rounded py-2.5 transition-colors ${formData.isVeg ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        <input
                          type="radio"
                          name="isVeg"
                          className="sr-only"
                          checked={formData.isVeg === true}
                          onChange={() => setFormData({ ...formData, isVeg: true })}
                        />
                        <span className="material-symbols-outlined text-[18px]">eco</span>
                        <span className="text-sm font-bold">Veg</span>
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer border rounded py-2.5 transition-colors ${!formData.isVeg ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        <input
                          type="radio"
                          name="isVeg"
                          className="sr-only"
                          checked={formData.isVeg === false}
                          onChange={() => setFormData({ ...formData, isVeg: false })}
                        />
                        <span className="material-symbols-outlined text-[18px]">restaurant</span>
                        <span className="text-sm font-bold">Non-Veg</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Item Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-gray-400 text-2xl">image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-white border border-gray-300 rounded text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined text-sm">upload</span>
                        Upload Image
                        <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} required />
                      </label>
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
                form="add-food-item-form"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded font-bold text-white bg-[#1B4D3E] hover:bg-[#123329] transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>Save Food Item</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
