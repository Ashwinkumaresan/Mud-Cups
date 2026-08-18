import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ActiveOrder, CartItem } from '../../types';
import { SwipeToConfirm } from '../../components/SwipeToConfirm';
import { createOrder } from '../../api';
import { CheckoutFlowModal } from '../../components/CheckoutFlowModal';

interface CartPageProps {
  user: any;
  cartItems: CartItem[];
  onUpdateCartQuantity: (index: number, delta: number) => void;
  onRemoveCartItem: (index: number) => void;
  onOrderSuccess: (order: ActiveOrder) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  user,
  cartItems,
  onUpdateCartQuantity,
  onRemoveCartItem,
  onOrderSuccess,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [orderName, setOrderName] = useState(location.state?.customerName || user?.name || '');
  const [tableNumber, setTableNumber] = useState(location.state?.tableNumber || '');

  // Listen for state changes if the modal navigates to /cart again
  React.useEffect(() => {
    if (location.state?.customerName) setOrderName(location.state.customerName);
    else if (user?.name) setOrderName(user.name);
    if (location.state?.tableNumber) setTableNumber(location.state.tableNumber);
  }, [location.state, user]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const grandTotal = subtotal;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    if (!orderName.trim()) return;

    try {
      const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const newOrder: ActiveOrder = {
        orderId: orderId,
        customerName: orderName.trim(),
        tableNumber: tableNumber.trim() || 'Takeaway',
        items: cartItems,
        totalAmount: subtotal,
        finalAmount: grandTotal,
        placedAt: new Date(),
      };

      await createOrder(newOrder);

      onOrderSuccess(newOrder);
      setIsOrderPlaced(true);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (isOrderPlaced) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 min-h-[60vh] animate-fadeIn">
        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center text-[#22c55e] shadow-sm mb-4">
          <span className="material-symbols-outlined text-6xl">check_circle</span>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800">Order Placed!</h2>
        <p className="text-gray-500 text-base max-w-sm">
          Your order has been successfully placed and is now being prepared.
        </p>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate('/orders')}
            className="bg-[#1B4D3E] text-white px-8 py-3 rounded font-bold hover:bg-[#123329] transition-all shadow-sm"
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 min-h-[60vh] animate-fadeIn">
        <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-[#1B4D3E] shadow-sm">
          <span className="material-symbols-outlined text-5xl">remove_shopping_cart</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Your cart is empty</h3>
        <p className="text-gray-500 text-sm max-w-sm">
          Looks like you haven't added anything to your cart yet. Let's explore some delicious food!
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-[#1B4D3E] text-white px-6 py-3 rounded font-bold hover:bg-[#123329] transition-all shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">restaurant_menu</span>
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="w-full pb-32 md:pb-12 animate-fadeIn space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-2xl font-extrabold text-[#271717]">Your Cart</h1>
        </div>
        <span className="bg-[#1B4D3E]/10 text-[#1B4D3E] px-3 py-1 rounded font-bold text-sm">
          {cartItems.length} Item{cartItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1B4D3E]">person</span>
                Your Details
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="orderName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Name <span className="text-[#1B4D3E]">*</span>
                </label>
                <input 
                  type="text" 
                  id="orderName"
                  value={orderName}
                  onChange={(e) => setOrderName(e.target.value)}
                  placeholder="Enter your name" 
                  className="w-full px-4 py-3 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 focus:border-[#1B4D3E] transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dining Preference
                </label>
                <div 
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full px-4 py-3 rounded border border-gray-200 bg-gray-50 flex items-center justify-between cursor-pointer hover:border-[#1B4D3E] hover:bg-red-50 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-[#1B4D3E] transition-colors">
                      {tableNumber === 'Takeaway' ? 'takeout_dining' : 'restaurant'}
                    </span>
                    <span className="font-bold text-gray-800">
                      {tableNumber === 'Takeaway' ? 'Takeaway' : tableNumber ? `Table ${tableNumber}` : 'Select Preference'}
                    </span>
                  </div>
                  <span className="text-[#1B4D3E] text-sm font-bold bg-[#1B4D3E]/10 px-3 py-1 rounded group-hover:bg-[#1B4D3E] group-hover:text-white transition-colors">
                    Change
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1B4D3E]">restaurant</span>
                Order Details
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {cartItems.map((cartItem, idx) => (
                <div key={idx} className="flex gap-4 p-3 rounded hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <img
                    src={cartItem.item.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                    alt={cartItem.item.name}
                    className="w-20 h-20 rounded object-cover shadow-xs"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[#271717] line-clamp-1">{cartItem.item.name}</h4>
                        <button
                          onClick={() => onRemoveCartItem(idx)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-extrabold text-[#1B4D3E]">₹{cartItem.totalPrice.toFixed(2)}</span>
                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded px-2 py-1 shadow-xs">
                        <button
                          onClick={() => onUpdateCartQuantity(idx, -1)}
                          className="text-gray-500 hover:text-[#1B4D3E] transition-colors w-6 h-6 flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold text-sm w-4 text-center">{cartItem.quantity}</span>
                        <button
                          onClick={() => onUpdateCartQuantity(idx, 1)}
                          className="text-gray-500 hover:text-[#1B4D3E] transition-colors w-6 h-6 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Bill Details */}
          <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1B4D3E]">receipt_long</span>
                Bill Details
              </h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Item Total</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-3 mt-3 flex justify-between items-center">
                <span className="font-extrabold text-gray-800 text-lg">To Pay</span>
                <span className="font-extrabold text-xl text-[#1B4D3E]">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {user ? (
            <SwipeToConfirm 
              onConfirm={handlePlaceOrder}
              amount={grandTotal}
              disabled={!orderName.trim()}
              disabledMessage="Please enter your name to proceed"
            />
          ) : (
            <button
              className="w-full bg-[#1B4D3E] text-white py-4 rounded font-bold text-lg hover:bg-[#123329] transition-colors shadow-sm"
              onClick={() => navigate('/login?redirect=/cart')}
            >
              Login to Checkout
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      <CheckoutFlowModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onTableChange={(table) => {
          setTableNumber(table);
          setIsCheckoutModalOpen(false);
        }}
      />
    </div>
  );
};
