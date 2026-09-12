import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ActiveOrder } from '../../types';
import { SwipeToConfirm } from '../../components/SwipeToConfirm';
import { createRazorpayOrder, verifyRazorpayPayment } from '../../api';

interface OrdersPageProps {
  activeOrders: ActiveOrder[];
  isLoading?: boolean;
  refreshOrders?: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ activeOrders, isLoading, refreshOrders }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOrderId = searchParams.get('order');
  const selectedOrder = activeOrders.find(o => o.orderId === selectedOrderId) || null;
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('upi');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [filterType, setFilterType] = useState<'all' | 'dine-in' | 'takeaway'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    
    if (isFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  const handlePayment = async () => {
    if (!selectedOrder) return;

    if (paymentMethod === 'upi') {
      try {
        const rzpOrderData = await createRazorpayOrder(selectedOrder.orderId);
        
        const options = {
          key: rzpOrderData.key_id,
          amount: rzpOrderData.amount,
          currency: rzpOrderData.currency,
          name: "Mud Cups",
          description: `Order ${selectedOrder.orderId}`,
          order_id: rzpOrderData.razorpay_order_id,
          handler: async function (response: any) {
            try {
              await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: selectedOrder.orderId
              });
              if (refreshOrders) {
                refreshOrders();
              }
              setSelectedOrder({ ...selectedOrder, isPaid: true });
            } catch (verifyError) {
              console.error("Payment verification failed", verifyError);
              alert("Payment verification failed. Please contact support if amount was deducted.");
            }
          },
          prefill: {
            name: selectedOrder.customerName,
          },
          theme: {
            color: "#1B4D3E"
          }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.on('payment.failed', function (response: any){
          console.error("Payment failed", response.error);
          alert(`Payment failed: ${response.error.description}`);
        });
        rzp1.open();

      } catch (err) {
        console.error("Failed to initiate Razorpay order", err);
        alert("Could not initiate payment. Please try again.");
      }
    } else {
      alert("Order is already placed for cash payment. Please pay at the counter.");
    }
  };

  useEffect(() => {
    if (refreshOrders) {
      refreshOrders();
    }
  }, []);

  if (selectedOrder) {
    return (
      <div className="max-w-6xl mx-auto w-full pb-12 animate-fadeIn space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSearchParams({})}
            className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-2xl font-extrabold text-[#271717]">Order Details</h1>
        </div>

        <div className="lg:grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white rounded shadow-sm border border-gray-100 p-5 space-y-4 mb-6 lg:mb-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 text-lg mb-2 break-all leading-tight">
                Order {selectedOrder.orderId}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-semibold">
                  Table: {selectedOrder.tableNumber}
                </span>
                {selectedOrder.isPaid && (
                  <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold">
                    PAID
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500 block">
                {selectedOrder.placedAt.toLocaleDateString()} at {selectedOrder.placedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="hidden sm:block text-right text-gray-300">
               <span className="material-symbols-outlined text-4xl">receipt_long</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-3">
            <h4 className="font-bold text-gray-800 text-sm">Items ({selectedOrder.items.length})</h4>
            <div className="space-y-3">
              {selectedOrder.items.map((cartItem, i) => {
                const itemObj = cartItem.item || cartItem;
                return (
                <div key={i} className="flex gap-3 items-start">
                  <img
                    src={itemObj.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                    alt={itemObj.name || 'Item'}
                    className="w-12 h-12 rounded object-cover shadow-xs"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-semibold text-[#271717] text-sm line-clamp-1">{itemObj.name || 'Unknown Item'}</span>
                      <span className="font-bold text-[#1B4D3E] text-sm">₹{(cartItem.totalPrice || (itemObj.price * cartItem.quantity)).toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Qty: {cartItem.quantity}
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>
          </div>

          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1B4D3E]">receipt_long</span>
                  Payment Details
                </h2>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span>
                  <span className="font-medium">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-dashed border-gray-200 mt-3">
                  <span className="font-extrabold text-gray-800 text-lg">Total {selectedOrder.isPaid ? 'Paid' : 'To Pay'}</span>
                  <span className="font-extrabold text-xl text-[#1B4D3E]">₹{selectedOrder.finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {selectedOrder.isPaid ? (
              <div className="bg-green-50 rounded shadow-sm border border-green-100 overflow-hidden p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
                </div>
                <h3 className="font-bold text-xl text-green-800 mb-1">Paid Successfully</h3>
                <p className="text-sm text-green-600">Your order has been paid in full.</p>
              </div>
            ) : (
              <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1B4D3E]">payments</span>
                    Payment Method
                  </h2>
                </div>
                <div className="p-5 space-y-3">
                  <label 
                    className={`flex items-center gap-3 p-3 border rounded transition-all opacity-70 ${
                      paymentMethod === 'cash' ? 'border-gray-200 bg-gray-50' : 'border-gray-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      disabled
                      className="w-4 h-4 text-gray-400 focus:ring-0 cursor-not-allowed"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-gray-600 text-sm">Cash / Pay at Counter</div>
                      <div className="text-xs text-gray-500">Pay directly to close order. Status will update once confirmed by staff.</div>
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
                      <div className="font-bold text-gray-800 text-sm">UPI / Online Payment</div>
                      <div className="text-xs text-gray-500">Pay securely via Razorpay</div>
                    </div>
                    <span className="material-symbols-outlined text-gray-400">qr_code_scanner</span>
                  </label>
                </div>
              </div>
            )}

            {!selectedOrder.isPaid && (
              <SwipeToConfirm 
                onConfirm={handlePayment}
                amount={selectedOrder.finalAmount}
                disabled={false}
                buttonText={paymentMethod === 'cash' ? 'Pay at Counter' : 'Proceed to Pay'}
                swipeText={paymentMethod === 'cash' ? 'Swipe to confirm' : 'Swipe to pay'}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = activeOrders
    .filter(order => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        order.orderId.toLowerCase().includes(query) ||
        order.items.some(item => ((item as any).item?.name || '').toLowerCase().includes(query));
      
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'paid' && order.isPaid) || 
        (filterStatus === 'unpaid' && !order.isPaid);
        
      const isTakeaway = order.tableNumber.toLowerCase() === 'takeaway';
      const matchesType = 
        filterType === 'all' || 
        (filterType === 'takeaway' && isTakeaway) || 
        (filterType === 'dine-in' && !isTakeaway);
        
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.placedAt).getTime();
      const dateB = new Date(b.placedAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="max-w-3xl mx-auto w-full pb-12 animate-fadeIn space-y-6 relative">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-extrabold text-[#271717]">My Orders</h1>
      </div>

      {/* Search & Filter Bar */}
      {activeOrders.length > 0 && (
        <div 
          className="flex items-center gap-2 mb-6 relative sticky top-0 z-30 py-3 bg-white/95 backdrop-blur-sm -mx-2 px-2 sm:mx-0 sm:px-0" 
          ref={filterRef}
        >
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text" 
              placeholder="Search by Order ID or Item..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded outline-none focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center justify-center w-11 h-11 border rounded transition-all ${isFilterOpen ? 'bg-[#1B4D3E] border-[#1B4D3E] text-white' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            <span className="material-symbols-outlined">tune</span>
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="absolute top-[calc(100%+0.5rem)] right-0 w-[300px] bg-white rounded-lg shadow-xl border border-gray-100 p-5 z-20 animate-fadeIn">
              <div className="space-y-5">
                {/* Status */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'paid', 'unpaid'].map(status => (
                      <button 
                        key={status}
                        onClick={() => setFilterStatus(status as any)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all capitalize ${filterStatus === status ? 'bg-[#1B4D3E] text-white border-[#1B4D3E]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Type */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Order Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {['all', 'dine-in', 'takeaway'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setFilterType(type as any)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all capitalize ${filterType === type ? 'bg-[#1B4D3E] text-white border-[#1B4D3E]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Sort */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sort By</h4>
                  <div className="flex flex-wrap gap-2">
                    {['newest', 'oldest'].map(sort => (
                      <button 
                        key={sort}
                        onClick={() => setSortBy(sort as any)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all capitalize ${sortBy === sort ? 'bg-[#1B4D3E] text-white border-[#1B4D3E]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'}`}
                      >
                        {sort} First
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4D3E]"></div>
        </div>
      ) : activeOrders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 min-h-[50vh]">
          <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shadow-sm">
            <span className="material-symbols-outlined text-5xl">receipt_long</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">No orders yet</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            Looks like you haven't placed any orders. Ready to grab a bite?
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-[#1B4D3E] text-white px-6 py-3 rounded font-bold hover:bg-[#123329] transition-all shadow-sm"
          >
            Browse Menu
          </button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 min-h-[40vh]">
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shadow-sm">
            <span className="material-symbols-outlined text-4xl">search_off</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">No matching orders</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
              setFilterType('all');
              setSortBy('newest');
            }}
            className="mt-2 text-[#1B4D3E] font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, idx) => (
            <div 
              key={order.orderId} 
              onClick={() => setSearchParams({ order: order.orderId })}
              className="bg-white rounded shadow-sm border border-gray-100 p-4 space-y-3 cursor-pointer hover:border-[#1B4D3E]/30 hover:shadow-md transition-all active:scale-[0.99] group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#1B4D3E]">
                    <span className="material-symbols-outlined">receipt</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Order {order.orderId}</h3>
                    <span className="text-xs text-gray-500">
                      {order.placedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="font-bold text-[#1B4D3E]">₹{order.finalAmount.toFixed(2)}</span>
                  {order.isPaid && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold mt-1">
                      PAID
                    </span>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} • Table {order.tableNumber}
                </span>
                <span className="text-sm font-semibold text-[#1B4D3E] flex items-center">
                  <span className="group-hover:underline">View Details</span>
                  <span className="material-symbols-outlined text-sm ml-0.5">chevron_right</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

