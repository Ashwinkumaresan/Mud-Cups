import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ActiveOrder, CartItem } from '../../types';
import { SwipeToConfirm } from '../../components/SwipeToConfirm';
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from '../../api';
import { CheckoutFlowModal } from '../../components/CheckoutFlowModal';

interface CartPageProps {
  user: any;
  cartItems: CartItem[];
  onUpdateCartQuantity: (index: number, delta: number) => void;
  onRemoveCartItem: (index: number) => void;
  onOrderSuccess: (order: ActiveOrder) => void;
  onOpenAuth: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  user,
  cartItems,
  onUpdateCartQuantity,
  onRemoveCartItem,
  onOrderSuccess,
  onOpenAuth,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const savedName = localStorage.getItem('userName');
  const getFullName = (u: any) => {
    if (u?.name) return u.name;
    if (u?.first_name && u?.last_name) return `${u.first_name} ${u.last_name}`;
    return u?.first_name || u?.username;
  };

  const [orderName, setOrderName] = useState(
    location.state?.customerName || getFullName(user) || savedName || ''
  );
  const [tableNumber, setTableNumber] = useState(location.state?.tableNumber || '');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('cash');

  // Listen for state changes if the modal navigates to /cart again
  React.useEffect(() => {
    if (location.state?.customerName) setOrderName(location.state.customerName);
    else if (getFullName(user)) setOrderName(getFullName(user));
    else if (savedName) setOrderName(savedName);
    
    if (location.state?.tableNumber) setTableNumber(location.state.tableNumber);
  }, [location.state, user, savedName]);

  const isDineIn = Boolean(tableNumber && tableNumber.toLowerCase() !== 'takeaway');
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const grandTotal = subtotal;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    
    if (!user) {
      alert("Please login to place an order.");
      onOpenAuth();
      return;
    }

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

      const backendOrder = await createOrder(newOrder);
      const actualOrderId = backendOrder.order_id || backendOrder.orderId;
      
      // Update newOrder with the actual ID returned from backend for the success screen
      const finalOrder = { ...newOrder, orderId: actualOrderId };

      if (paymentMethod === 'upi') {
        try {
          const rzpOrderData = await createRazorpayOrder(actualOrderId);
          
          const options = {
            key: rzpOrderData.key_id,
            amount: rzpOrderData.amount,
            currency: rzpOrderData.currency,
            name: "Mud Cups",
            description: `Order ${actualOrderId}`,
            order_id: rzpOrderData.razorpay_order_id,
            handler: async function (response: any) {
              try {
                await verifyRazorpayPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: actualOrderId
                });
                onOrderSuccess(finalOrder);
                setIsOrderPlaced(true);
              } catch (verifyError) {
                console.error("Payment verification failed", verifyError);
                alert("Payment verification failed. If money was deducted, it will be refunded.");
              }
            },
            prefill: {
              name: orderName.trim(),
            },
            theme: {
              color: "#1B4D3E"
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', function (response: any) {
            console.error("Payment failed", response.error);
            alert("Payment failed: " + response.error.description);
          });
          rzp.open();
        } catch (rzpError) {
          console.error("Failed to initialize Razorpay", rzpError);
          alert("Could not start payment gateway. Please try again.");
        }
      } else {
        onOrderSuccess(finalOrder);
        setIsOrderPlaced(true);
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleShareStory = async () => {
    try {
      if (!navigator.share) {
        alert("Sharing is not supported on this device/browser.");
        return;
      }
      
      const response = await fetch('/Insta-story.png');
      const blob = await response.blob();
      const file = new File([blob], 'MudCupsInstaStory.png', { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Mud Cups',
          text: 'Just ordered from Mud Cups!'
        });
      } else {
        // Fallback for browsers that support share but not files
        await navigator.share({
          title: 'Mud Cups',
          text: 'Just ordered from Mud Cups!',
          url: window.location.origin
        });
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (isOrderPlaced) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center space-y-3 min-h-[60vh] h-full max-h-[100dvh] overflow-y-auto animate-fadeIn">
        <div className="relative mt-2">
          <h1 
            className="text-4xl sm:text-5xl text-[#1B4D3E]" 
            style={{ fontFamily: '"Matemasie", cursive', lineHeight: '1.1' }}
          >
          Mud<br />Cups
        </h1>
      </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800">Order Placed!</h2>
        <p className="text-gray-500 text-sm max-w-sm mb-2">
          Your order has been successfully placed and is now being prepared.
        </p>

        {/* Story Section */}
        <div className="bg-white rounded shadow-sm border border-gray-100 p-3 max-w-sm w-full mx-auto space-y-3 flex flex-col items-center">
          <img 
            src="/Insta-story.png" 
            alt="Share on Story" 
            className="h-[30vh] sm:h-[35vh] w-auto max-w-full rounded-lg shadow-sm cursor-pointer object-contain hover:scale-105 transition-transform" 
            onClick={handleShareStory}
          />
          <button
            onClick={handleShareStory}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-opacity shadow-sm w-full"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            Share Us on Your story
          </button>
        </div>

        <div className="flex gap-4 mt-2">
          <button
            onClick={() => navigate('/orders')}
            className="bg-[#1B4D3E] text-white px-8 py-2.5 rounded font-bold hover:bg-[#123329] transition-all shadow-sm"
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
              className="bg-[#1B4D3E] text-white px-8 py-3 rounded-full font-bold hover:bg-[#123329] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">restaurant_menu</span>
              Browse Menu
            </button>
      </div>
    );
  }

  return (
    <div className="w-full md:pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-white pb-4 pt-2 mt-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="md:text-2xl text-xl font-extrabold text-[#271717]">Your Cart</h1>
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
              {cartItems.map((cartItem, idx) => {
                const itemObj = cartItem.item || cartItem;
                return (
                <div key={idx} className="flex gap-4 p-3 rounded hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                  <img
                    src={itemObj.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                    alt={itemObj.name || 'Item'}
                    className="w-20 h-20 rounded object-cover shadow-xs"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[#271717] line-clamp-1">{itemObj.name || 'Unknown Item'}</h4>
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
              )})}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Payment Method */}
          <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1B4D3E]">payments</span>
                Payment Method
              </h2>
            </div>
            <div className="p-5 space-y-3">
              <label 
                className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-all ${
                  paymentMethod === 'cash' ? 'border-[#1B4D3E] bg-[#1B4D3E]/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="w-4 h-4 text-[#1B4D3E] focus:ring-[#1B4D3E] cursor-pointer"
                />
                <div className="flex-1">
                  <div className="font-bold text-gray-800">
                    {isDineIn ? 'Pay Later' : 'Cash / Pay at Counter'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {isDineIn 
                      ? 'Continue ordering and pay for everything at once on the Orders page' 
                      : 'Pay directly when picking up your order'}
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400">store</span>
              </label>

              <label 
                className={`flex items-center gap-3 p-3 border rounded cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'border-[#1B4D3E] bg-[#1B4D3E]/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="w-4 h-4 text-[#1B4D3E] focus:ring-[#1B4D3E] cursor-pointer"
                />
                <div className="flex-1">
                  <div className="font-bold text-gray-800">UPI / Online Payment</div>
                  <div className="text-xs text-gray-500">Pay securely via Razorpay</div>
                </div>
                <span className="material-symbols-outlined text-gray-400">qr_code_scanner</span>
              </label>
            </div>
          </div>

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
              buttonText={paymentMethod === 'cash' ? (isDineIn ? 'Place Order' : 'Place Order (Pay at Counter)') : 'Proceed to Pay'}
              swipeText={paymentMethod === 'cash' ? 'Swipe to order' : 'Swipe to pay'}
            />
          ) : (
            <button
              className="w-full bg-[#1B4D3E] text-white py-4 rounded font-bold text-lg hover:bg-[#123329] transition-colors shadow-sm"
              onClick={() => onOpenAuth()}
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
