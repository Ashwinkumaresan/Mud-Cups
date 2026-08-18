import React, { useState, useEffect } from 'react';
import { createCategory, fetchCategories, deleteCategory, fetchCategoryFoodItems } from '../api';
import { Category, FoodItem } from '../types';

export const AdminAddCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Expansion state
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [categoryItems, setCategoryItems] = useState<FoodItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleOpenModal = () => {
    setFormData({ name: '' });
    setImageFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !imageFile) {
      alert('Please provide a name and select an image');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('image', imageFile);
      
      await createCategory(data);
      setIsModalOpen(false);
      loadCategories(); // reload categories
    } catch (err) {
      console.error(err);
      alert('Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${categoryId}"?`)) return;
    try {
      await deleteCategory(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete category');
    }
  };

  const handleToggleExpand = async (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      setCategoryItems([]);
      return;
    }
    
    setExpandedCategory(categoryId);
    setLoadingItems(true);
    try {
      const items = await fetchCategoryFoodItems(categoryId);
      setCategoryItems(items);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch food items for this category');
    } finally {
      setLoadingItems(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto w-full pb-12 animate-fadeIn space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#271717] mb-1">Categories</h2>
          <p className="text-gray-500">Manage your menu categories.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Search categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none transition-all"
            />
          </div>
          <button 
            onClick={handleOpenModal}
            className="flex items-center gap-2 bg-[#1B4D3E] text-white px-5 py-2.5 rounded font-bold hover:bg-[#123329] transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined">add</span>
            Add Category
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#1B4D3E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredCategories.map(category => (
            <div key={category.id} className={`bg-white rounded shadow-sm border ${expandedCategory === category.id ? 'border-[#1B4D3E]' : 'border-gray-100'} overflow-hidden transition-colors`}>
              <div 
                className="p-4 flex items-center gap-4 group cursor-pointer hover:bg-gray-50"
                onClick={() => handleToggleExpand(category.id)}
              >
                <div className="w-16 h-16 rounded bg-gray-100 overflow-hidden shrink-0">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="material-symbols-outlined">image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#271717] truncate text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{category.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {category.itemCount || 0} items
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(category.id);
                    }}
                    className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 shrink-0"
                    title="Delete category"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                  <span className={`material-symbols-outlined text-gray-400 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </div>
              </div>

              {expandedCategory === category.id && (
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                  {loadingItems ? (
                    <div className="flex justify-center p-6">
                      <div className="w-6 h-6 border-2 border-[#1B4D3E] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : categoryItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {categoryItems.map(item => (
                        <div key={item.id} className="bg-white p-3 rounded border border-gray-200 flex items-center gap-3">
                          <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="material-symbols-outlined text-gray-400 w-full h-full flex items-center justify-center text-sm">restaurant</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-sm">{item.name}</p>
                            <p className="text-xs font-bold text-[#1B4D3E]">₹{item.price}</p>
                          </div>
                          <div className="shrink-0">
                            <span className={`material-symbols-outlined text-sm ${item.isVeg ? 'text-[#1B4D3E]' : 'text-red-600'}`}>
                              {item.isVeg ? 'eco' : 'restaurant'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      No food items found in this category.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {filteredCategories.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No categories found.
            </div>
          )}
        </div>
      )}

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded w-full max-w-md shadow-2xl overflow-hidden animate-slideUp">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-extrabold text-[#271717]">Add New Category</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Name *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded border border-gray-200 focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent outline-none transition-all"
                  placeholder="e.g., Hot Beverages"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Image *</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-gray-400">image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <span className="material-symbols-outlined text-sm">upload</span>
                      Upload Image
                      <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} required />
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded font-semibold text-white bg-[#1B4D3E] hover:bg-[#123329] transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>Save Category</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
