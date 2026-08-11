import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveOrder } from '../../types';

interface OrdersPageProps {
  activeOrders: ActiveOrder[];
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ activeOrders }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto w-full pb-12 animate-fadeIn space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-2xl font-extrabold text-[#271717]">My Orders</h1>
      </div>

      {activeOrders.length === 0 ? (
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
            className="mt-4 bg-[#b7122a] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#92001c] transition-all shadow-sm"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeOrders.map((order, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800">Order {order.orderId}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-semibold">
                      Table: {order.tableNumber}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {order.placedAt.toLocaleDateString()} at {order.placedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-[#b7122a] text-lg">₹{order.finalAmount.toFixed(2)}</div>
                  <span className="text-xs text-gray-500">{order.items.length} items</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-3">
                <h4 className="font-bold text-gray-800 text-sm">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map((cartItem, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <img
                        src={cartItem.item.image || 'https://via.placeholder.com/100x100?text=No+Image'}
                        alt={cartItem.item.name}
                        className="w-12 h-12 rounded-lg object-cover shadow-xs"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-semibold text-[#271717] text-sm line-clamp-1">{cartItem.item.name}</span>
                          <span className="font-bold text-[#b7122a] text-sm">₹{cartItem.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Qty: {cartItem.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 bg-gray-50 -mx-5 px-5 pb-2">
                <h4 className="font-bold text-gray-800 text-sm mb-2">Payment Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-dashed border-gray-200 mt-1">
                    <span>Total Paid</span>
                    <span className="text-[#b7122a]">₹{order.finalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
