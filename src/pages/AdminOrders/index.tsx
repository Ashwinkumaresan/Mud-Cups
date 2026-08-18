import React, { useEffect, useState } from 'react';
import { ActiveOrder } from '../../types';
import { fetchActiveOrders, markOrderPaid } from '../../api';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<ActiveOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const loadOrders = async () => {
    try {
      const data = await fetchActiveOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // Poll every 10 seconds for new orders
    const dataInterval = setInterval(loadOrders, 10000);
    
    // Update elapsed time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => {
      clearInterval(dataInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const handleMarkPaid = async (orderId: string) => {
    if (!window.confirm(`Are you sure you want to complete order #${orderId}?`)) return;
    try {
      await markOrderPaid(orderId);
      // Remove the order from local state immediately
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    } catch (err) {
      console.error(err);
      alert('Failed to complete order');
    }
  };

  // Helper to format elapsed time
  const getElapsedTimeString = (placedAt: Date) => {
    const diffMins = Math.floor((currentTime.getTime() - placedAt.getTime()) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m ago`;
  };

  return (
    <div className="max-w-6xl mx-auto w-full pb-12 animate-fadeIn space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#271717] mb-1">Active Orders</h2>
          <p className="text-gray-500 font-medium">Manage and fulfill live customer orders.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded border border-gray-200 shadow-sm flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1B4D3E] opacity-40"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1B4D3E]"></span>
          </div>
          <span className="font-bold text-[#271717]">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Pending
          </span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#1B4D3E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 bg-white rounded shadow-sm border border-gray-100 min-h-[40vh]">
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h3 className="text-xl font-bold text-[#271717]">All caught up!</h3>
          <p className="text-gray-500 font-medium text-sm">
            There are no active orders waiting.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => {
            const diffMins = Math.floor((currentTime.getTime() - order.placedAt.getTime()) / 60000);
            const isLate = diffMins > 15;

            return (
              <div 
                key={order.orderId} 
                className="bg-white rounded shadow-sm border border-gray-100 p-6 flex flex-col relative transition-all hover:shadow-md"
              >
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-extrabold text-[#271717] text-xl">Order #{order.orderId.slice(-4)}</h3>
                    <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">{order.orderId}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm font-bold ${isLate ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'}`}>
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {getElapsedTimeString(order.placedAt)}
                  </div>
                </div>

                {/* Customer Details */}
                <div className="flex items-center justify-between py-3 border-y border-gray-50 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400 text-sm">person</span>
                    <span className="font-bold text-[#271717] text-sm">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400 text-sm">table_restaurant</span>
                    <span className="font-bold text-[#271717] text-sm">Table {order.tableNumber}</span>
                  </div>
                </div>

                {/* Items List */}
                <div className="flex-1 mb-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Items</h4>
                  <div className="space-y-3">
                    {order.items.map((cartItem, i) => (
                      <div key={i} className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <span className="font-bold text-[#1B4D3E] text-sm">{cartItem.quantity}x</span>
                          <span className="font-bold text-[#271717] text-sm leading-tight">{cartItem.item.name}</span>
                        </div>
                        <span className="font-bold text-gray-500 text-sm">₹{cartItem.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Section */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total</p>
                    <p className="text-lg font-black text-[#1B4D3E]">₹{order.finalAmount.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleMarkPaid(order.orderId)}
                    className="bg-[#1B4D3E] hover:bg-[#123329] text-white px-6 py-2.5 rounded font-bold transition-all shadow-sm flex items-center gap-2 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">done_all</span>
                    Complete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
