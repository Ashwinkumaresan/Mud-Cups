import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomCalendar } from '../components/Admin/CustomCalendar';

type DateFilterType = 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom';

const MOCK_METRICS = {
  activeOrders: 14,
  paymentTillNow: 125600,
  itemSalesCount: 1420,
  comboSalesCount: 380,
  totalOrders: 4250,
  totalCustomers: 1832,
};

const MOCK_SALES = [
  { id: '1', name: 'Classic Mud Cup', tag: null, price: 150, qtySold: 420, total: 63000 },
  { id: '2', name: 'Couples Combo', tag: 'Combo', price: 450, qtySold: 85, total: 38250 },
  { id: '3', name: 'Spicy Paneer Wrap', tag: 'Offer', price: 120, qtySold: 210, total: 25200 },
  { id: '4', name: 'Cold Coffee', tag: null, price: 90, qtySold: 560, total: 50400 },
  { id: '5', name: 'Family Feast', tag: 'Combo', price: 999, qtySold: 42, total: 41958 },
  { id: '6', name: 'Fries & Dip', tag: null, price: 110, qtySold: 310, total: 34100 },
];

export const AdminDashboard: React.FC = () => {
  const [dateFilter, setDateFilter] = useState<DateFilterType>('today');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [customRange, setCustomRange] = useState<{start: Date | null, end: Date | null}>({ start: null, end: null });

  let multiplier = 1;
  if (dateFilter === 'yesterday') multiplier = 0.8;
  if (dateFilter === 'this_week') multiplier = 5.2;
  if (dateFilter === 'this_month') multiplier = 22.4;
  if (dateFilter === 'custom') multiplier = 3.5;

  const currentMetrics = {
    activeOrders: Math.round(MOCK_METRICS.activeOrders * multiplier),
    paymentTillNow: Math.round(MOCK_METRICS.paymentTillNow * multiplier),
    itemSalesCount: Math.round(MOCK_METRICS.itemSalesCount * multiplier),
    comboSalesCount: Math.round(MOCK_METRICS.comboSalesCount * multiplier),
    totalOrders: Math.round(MOCK_METRICS.totalOrders * multiplier),
    totalCustomers: Math.round(MOCK_METRICS.totalCustomers * multiplier),
  };

  const currentSales = MOCK_SALES.map(sale => ({
    ...sale,
    qtySold: Math.round(sale.qtySold * multiplier),
    total: Math.round(sale.total * multiplier),
  }));

  const statCards = [
    { title: 'Active Orders', value: currentMetrics.activeOrders, icon: 'receipt_long', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Payment Till Now', value: `₹${currentMetrics.paymentTillNow.toLocaleString()}`, icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Items Sales Count', value: currentMetrics.itemSalesCount, icon: 'restaurant_menu', color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Combo Sales Count', value: currentMetrics.comboSalesCount, icon: 'fastfood', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#271717] mb-1">Dashboard</h2>
        <p className="text-gray-500">Welcome to the Mud Cups admin panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold mb-1">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-[#271717]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 mt-8">
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#271717]">Recent Item Sales</h3>
              <Link to="/admin/sales" className="text-sm font-bold text-[#1B4D3E] hover:underline flex items-center gap-1">
                See All <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                    <th className="px-6 py-3 font-semibold">Item Name</th>
                    <th className="px-6 py-3 font-semibold">Price (1 pc)</th>
                    <th className="px-6 py-3 font-semibold text-center">Qty Sold</th>
                    <th className="px-6 py-3 font-semibold text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{sale.name}</span>
                          {sale.tag && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              sale.tag === 'Combo' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {sale.tag}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">₹{sale.price}</td>
                      <td className="px-6 py-4 font-bold text-gray-800 text-center">{sale.qtySold}</td>
                      <td className="px-6 py-4 font-black text-[#1B4D3E] text-right">₹{sale.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded flex items-center justify-center bg-blue-50 text-blue-600 shrink-0">
              <span className="material-symbols-outlined text-3xl">shopping_cart</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Total Orders</p>
              <h3 className="text-2xl font-extrabold text-[#271717]">{currentMetrics.totalOrders.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded flex items-center justify-center bg-indigo-50 text-indigo-600 shrink-0">
              <span className="material-symbols-outlined text-3xl">group</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold mb-1">Total Customers</p>
              <h3 className="text-2xl font-extrabold text-[#271717]">{currentMetrics.totalCustomers.toLocaleString()}</h3>
            </div>
          </div>

          {/* Date Filter Card */}
          <div className="bg-white p-6 rounded shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-gray-800 font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1B4D3E]">calendar_month</span>
              Filter by Date
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'today', label: 'Today' },
                { id: 'yesterday', label: 'Yesterday' },
                { id: 'this_week', label: 'This Week' },
                { id: 'this_month', label: 'This Month' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setDateFilter(filter.id as DateFilterType);
                    setIsCalendarOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    dateFilter === filter.id 
                      ? 'bg-[#1B4D3E] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
              
              <div className="relative">
                <button
                  onClick={() => {
                    setDateFilter('custom');
                    setIsCalendarOpen(!isCalendarOpen);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    dateFilter === 'custom' 
                      ? 'bg-[#1B4D3E] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Custom Range
                  {(customRange.start || customRange.end) && (
                    <span className="ml-2 font-normal opacity-80">
                      ({customRange.start ? customRange.start.toLocaleDateString(undefined, {month:'short', day:'numeric'}) : '...'} - {customRange.end ? customRange.end.toLocaleDateString(undefined, {month:'short', day:'numeric'}) : '...'})
                    </span>
                  )}
                </button>

                {dateFilter === 'custom' && isCalendarOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden animate-fadeIn" 
                      onClick={() => setIsCalendarOpen(false)} 
                    />
                    
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:absolute lg:top-auto lg:left-auto lg:bottom-full lg:right-0 lg:-translate-x-0 lg:-translate-y-0 lg:mb-2 z-50 w-[90vw] max-w-[320px] lg:w-72 animate-fadeIn shadow-2xl lg:shadow-xl rounded-lg lg:rounded">
                      <div className="bg-white rounded-lg lg:rounded overflow-hidden border border-gray-200">
                        <CustomCalendar 
                          startDate={customRange.start} 
                          endDate={customRange.end} 
                          onChange={setCustomRange} 
                        />
                        <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-end">
                          <button 
                            onClick={() => setIsCalendarOpen(false)}
                            className="bg-[#1B4D3E] text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-[#123329]"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
