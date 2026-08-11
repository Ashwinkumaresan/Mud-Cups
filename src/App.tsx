import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  ActiveOrder,
  CartItem,
  FilterState,
  FoodItem,
  HeroDeal,
  UserProfile,
  UserAddress,
  Category,
} from './types';
import { fetchCategories, fetchFoodItems, fetchActiveOrders } from './api';
import { HERO_DEALS, MOCK_USER } from './data/mockData';
import { Header } from './components/Header';
import { FoodDetailModal } from './components/FoodDetailModal';
import { AuthModal } from './components/AuthModal';
import { CheckoutFlowModal } from './components/CheckoutFlowModal';
import { Footer } from './components/Footer';
import { generateFrontendFingerprint } from './utils/fingerprint';

import { Home } from './pages/Home';
import { CartPage } from './pages/Cart';
import { OrdersPage } from './pages/Orders';
import { AdminOrdersPage } from './pages/AdminOrders';
import { AdminLayout } from './pages/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminAddCategory } from './pages/AdminAddCategory';
import { AdminAddFoodItem } from './pages/AdminAddFoodItem';
import { AdminAddCombo } from './pages/AdminAddCombo';
export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(MOCK_USER);
  const [favorites, setFavorites] = useState<string[]>(['item-1', 'item-2']);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cartItems');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cart items from local storage", e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Generate and store fingerprint first
        await generateFrontendFingerprint();

        const [cats, items] = await Promise.all([fetchCategories(), fetchFoodItems()]);
        setCategories(cats);
        setFoodItems(items);
      } catch (err) {
        console.error(err);
        showToast('Failed to load data from backend');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    // Poll orders every 10s so user's screen syncs with admin's actions
    const pollOrders = async () => {
      try {
        const orders = await fetchActiveOrders();
        setActiveOrders(orders);
      } catch (err) {
        console.error("Failed to sync orders");
      }
    };
    
    pollOrders(); // Initial load
    const interval = setInterval(pollOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const [selectedAddress, setSelectedAddress] = useState<UserAddress>(
    MOCK_USER.addresses[0]
  );

  // Session ID state
  const generateSessionId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'SESS-';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    result += '-';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const [sessionId, setSessionId] = useState<string>(() => {
    // Check URL parameters first for shared session links
    const urlParams = new URLSearchParams(window.location.search);
    const urlSession = urlParams.get('session');
    if (urlSession && urlSession.trim()) {
      const cleanSession = urlSession.trim();
      localStorage.setItem('mudcups_session_id', cleanSession);
      return cleanSession;
    }

    const saved = localStorage.getItem('mudcups_session_id');
    if (saved) return saved;
    const newId = generateSessionId();
    localStorage.setItem('mudcups_session_id', newId);
    return newId;
  });

  const handleNewSession = () => {
    const newId = generateSessionId();
    localStorage.setItem('mudcups_session_id', newId);
    setSessionId(newId);
    showToast(`Started new session ${newId}`);
  };

  const handleJoinSession = (newSessionId: string) => {
    localStorage.setItem('mudcups_session_id', newSessionId);
    setSessionId(newSessionId);
    // Update URL query string
    const newUrl = `${window.location.pathname}?session=${newSessionId}`;
    window.history.replaceState({}, '', newUrl);
    showToast(`Successfully joined session ${newSessionId}!`);
  };

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCategory: null,
    vegOnly: false,
    sortBy: 'relevance',
    priceRange: [0, 1000],
  });

  // Modals visibility
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<FoodItem | null>(null);
  const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // Active Orders
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);

  // Helper functions
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleUpdateFilters = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedCategory: null,
      vegOnly: false,
      sortBy: 'relevance',
      priceRange: [0, 1000],
    });
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.vegOnly) count++;
    return count;
  }, [filters]);

  // Cart operations
  const getCartQuantity = (item: FoodItem) => {
    const cartEntry = cartItems.find((c) => c.item.id === item.id);
    return cartEntry ? cartEntry.quantity : 0;
  };

  const handleAddToCartSimple = (item: FoodItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((c) => c.item.id === item.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        const existingItem = updated[existingIdx];
        const newQty = existingItem.quantity + 1;
        const unitPrice = existingItem.totalPrice / existingItem.quantity;
        updated[existingIdx] = {
          ...existingItem,
          quantity: newQty,
          totalPrice: unitPrice * newQty,
        };
        return updated;
      }
      return [...prev, { item, quantity: 1, totalPrice: item.price }];
    });
  };

  const handleAddToCart = (cartItem: CartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((c) => c.item.id === cartItem.item.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        const existingItem = updated[existingIdx];
        const newQty = existingItem.quantity + cartItem.quantity;
        const unitPrice = cartItem.totalPrice / cartItem.quantity;
        updated[existingIdx] = {
          ...existingItem,
          quantity: newQty,
          totalPrice: unitPrice * newQty,
        };
        return updated;
      }
      return [...prev, cartItem];
    });
  };

  const handleUpdateQuantitySimple = (item: FoodItem, delta: number) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((c) => c.item.id === item.id);
      if (existingIdx === -1) return prev;
      const updated = [...prev];
      const existingItem = updated[existingIdx];
      const newQty = existingItem.quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, idx) => idx !== existingIdx);
      }
      const unitPrice = existingItem.totalPrice / existingItem.quantity;
      updated[existingIdx] = {
        ...existingItem,
        quantity: newQty,
        totalPrice: unitPrice * newQty,
      };
      return updated;
    });
  };


  const handleUpdateCartQuantityByIdx = (index: number, delta: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      const existingItem = updated[index];
      const newQty = existingItem.quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      const unitPrice = existingItem.totalPrice / existingItem.quantity;
      updated[index] = {
        ...existingItem,
        quantity: newQty,
        totalPrice: unitPrice * newQty,
      };
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setIsClearCartModalOpen(false);
  };

  const handleOrderDeal = (deal: HeroDeal) => {
    const matchedItem = foodItems.find((f) => f.id === deal.linkedItemId) || foodItems[0];
    if (!matchedItem) return;
    setCartItems((prev) => [
      ...prev,
      {
        item: { ...matchedItem, name: deal.title, price: deal.price },
        quantity: 1,
        totalPrice: deal.price,
      },
    ]);
  };

  // Filtered Food Items calculation
  const filteredFoodItems = useMemo(() => {
    return foodItems.filter((item) => {
      // Search query
      if (
        filters.searchQuery &&
        !item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !item.category.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category
      if (
        filters.selectedCategory &&
        item.category.toLowerCase() !== filters.selectedCategory.toLowerCase()
      ) {
        return false;
      }

      // Quick toggles
      if (filters.vegOnly && !item.isVeg) return false;




      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'priceLow') return a.price - b.price;
      if (filters.sortBy === 'priceHigh') return b.price - a.price;
      return 0;
    });
  }, [filters, foodItems]);

  const totalCartCount = cartItems.reduce((acc, c) => acc + c.quantity, 0);
  const totalCartPrice = cartItems.reduce((acc, c) => acc + c.totalPrice, 0);

  const location = useLocation();

  const showHeaderFooter = location.pathname !== '/cart' && location.pathname !== '/orders' && !location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen text-[#271717] flex flex-col font-sans relative pb-24">
      {/* Top Navbar */}
      {showHeaderFooter && (
        <Header
          cartCount={totalCartCount}
          onOpenCart={() => {}} // deprecated
          onOpenAuth={() => setIsAuthModalOpen(true)}
          user={user}
          sessionId={sessionId}
        />
      )}

      {/* Main Container */}
      {!location.pathname.startsWith('/admin') ? (
        <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8 flex-grow w-full">
          <Routes>
            <Route path="/" element={
            isLoading ? (
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b7122a]"></div>
              </div>
            ) : (
            <Home
              categories={categories}
              handleOrderDeal={handleOrderDeal}
              filters={filters}
              handleUpdateFilters={handleUpdateFilters}
              activeFilterCount={activeFilterCount}
              handleResetFilters={handleResetFilters}
              filteredFoodItems={filteredFoodItems}
              favorites={favorites}
              handleToggleFavorite={handleToggleFavorite}
              getCartQuantity={getCartQuantity}
              handleAddToCartSimple={handleAddToCartSimple}
              handleUpdateQuantitySimple={handleUpdateQuantitySimple}
              setDetailItem={setDetailItem}
            />
            )
          } />
          <Route path="/cart" element={
            <CartPage
              cartItems={cartItems}
              onUpdateCartQuantity={handleUpdateCartQuantityByIdx}
              onRemoveCartItem={handleRemoveCartItem}
              onOrderSuccess={(newOrder) => {
                setCartItems([]);
                setActiveOrders((prev) => [newOrder, ...prev]);
              }}
            />
          } />
            <Route path="/orders" element={
              <OrdersPage
                activeOrders={activeOrders}
              />
            } />
          </Routes>
        </main>
      ) : (
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="add-category" element={<AdminAddCategory />} />
            <Route path="add-food-item" element={<AdminAddFoodItem />} />
            <Route path="add-combo" element={<AdminAddCombo />} />
          </Route>
        </Routes>
      )}

      {/* Footer */}
      {showHeaderFooter && <Footer />}

      {/* Floating Cart Button (Bottom) */}
      {totalCartCount > 0 && showHeaderFooter && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-md border-t border-gray-200 z-40 animate-slideUp">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsClearCartModalOpen(true)}
                className="p-1 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Clear cart"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
              <span className="font-semibold text-gray-800">{totalCartCount} item{totalCartCount > 1 ? 's' : ''} added</span>
            </div>
            
            <button 
              onClick={() => setIsCheckoutModalOpen(true)}
              className="bg-[#b7122a] text-white px-5 py-2 rounded-xl font-bold hover:bg-[#92001c] active:scale-95 transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              Checkout <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals & Overlays */}
      <FoodDetailModal
        item={detailItem}
        isOpen={detailItem !== null}
        onClose={() => setDetailItem(null)}
        onAddToCart={handleAddToCart}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        sessionId={sessionId}
        onNewSession={handleNewSession}
        onJoinSession={handleJoinSession}
        user={user}
        activeOrders={activeOrders}
      />

      <CheckoutFlowModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
      />

      {isClearCartModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-slideUp flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-red-50 text-[#b7122a] rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">delete</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Cart?</h3>
            <p className="text-gray-600 text-sm mb-6">Are you sure you want to remove all items from your cart?</p>
            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setIsClearCartModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-800 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleClearCart}
                className="flex-1 bg-[#b7122a] text-white font-semibold py-3 rounded-xl hover:bg-[#92001c] transition-colors shadow-sm cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1C1C] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-fadeIn border border-white/10">
          <span className="material-symbols-outlined text-[#b7122a]">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
