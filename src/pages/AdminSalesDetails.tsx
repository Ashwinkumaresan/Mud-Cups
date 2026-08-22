import React, { useState, useEffect } from 'react';
import { CustomCalendar } from '../components/Admin/CustomCalendar';

type DateFilterType = 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom';

const MOCK_SALES_ALL = Array.from({ length: 45 }).map((_, i) => {
  const isCombo = i % 3 === 0;
  const isOffer = i % 5 === 0;
  let tag: string | null = null;
  if (isCombo) tag = 'Combo';
  else if (isOffer) tag = 'Offer';

  const price = 100 + (i * 15) % 150;
  const qtySold = 10 + (i * 7) % 50;
  
  return {
    id: i.toString(),
    name: `Item #${i + 1} ${isCombo ? 'Feast' : 'Special'}`,
    tag,
    price,
    qtySold,
    total: price * qtySold
  };
});

export const AdminSalesDetails: React.FC = () => {
  const [dateFilter, setDateFilter] = useState<DateFilterType>('today');
  const [customRange, setCustomRange] = useState<{start: Date | null, end: Date | null}>({ start: null, end: null });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sync custom date click to custom filter
  useEffect(() => {
    if (customRange.start || customRange.end) {
      setDateFilter('custom');
    }
  }, [customRange]);

  let multiplier = 1;
  if (dateFilter === 'yesterday') multiplier = 0.8;
  if (dateFilter === 'this_week') multiplier = 5.2;
  if (dateFilter === 'this_month') multiplier = 22.4;
  if (dateFilter === 'custom') multiplier = 3.5;

  const currentSales = MOCK_SALES_ALL.map(sale => ({
    ...sale,
    qtySold: Math.round(sale.qtySold * multiplier),
    total: Math.round(sale.total * multiplier),
  })).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(MOCK_SALES_ALL.length / itemsPerPage);

  return (
    <div className="animate-fadeIn flex flex-col h-full flex-1 space-y-4">
      <div className="shrink-0">
        <h2 className="text-2xl font-extrabold text-[#271717] mb-1">Sales Details</h2>
        <p className="text-gray-500">Detailed view of all item sales and history.</p>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-4 flex-1 min-h-0">
        {/* Left Column: Table with Pagination */}
        <div className="col-span-12 lg:col-span-9 h-full">
          <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <h3 className="text-lg font-bold text-[#271717]">All Item Sales</h3>
            </div>
            
            <div className="overflow-y-auto flex-1 min-h-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                    <th className="px-6 py-2 font-semibold">Item Name</th>
                    <th className="px-6 py-2 font-semibold">Price (1 pc)</th>
                    <th className="px-6 py-2 font-semibold text-center">Qty Sold</th>
                    <th className="px-6 py-2 font-semibold text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-2.5">
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
                      <td className="px-6 py-2.5 text-gray-600 font-medium">₹{sale.price}</td>
                      <td className="px-6 py-2.5 font-bold text-gray-800 text-center">{sale.qtySold}</td>
                      <td className="px-6 py-2.5 font-black text-[#1B4D3E] text-right">₹{sale.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
              <p className="text-sm text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-800">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, MOCK_SALES_ALL.length)}</span> of <span className="font-bold text-gray-800">{MOCK_SALES_ALL.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold transition-colors ${
                        currentPage === idx + 1 ? 'bg-[#1B4D3E] text-white' : 'text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Full Calendar UI */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded shadow-sm border border-gray-100 overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-[#271717]">Select Date Range</h3>
            </div>
            <div className="p-4 flex flex-col items-center">
              
              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 mb-4 justify-center w-full">
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
                      if (filter.id !== 'custom') {
                        setCustomRange({ start: null, end: null });
                      }
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
              </div>

              <CustomCalendar 
                startDate={customRange.start} 
                endDate={customRange.end} 
                onChange={setCustomRange} 
              />
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Selected Range</p>
                {(customRange.start || customRange.end) ? (
                  <p className="text-sm font-bold text-[#271717]">
                    {customRange.start ? customRange.start.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '...'} 
                    <span className="mx-2 text-gray-400">to</span> 
                    {customRange.end ? customRange.end.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '...'}
                  </p>
                ) : (
                  <p className="text-sm font-medium text-gray-500 italic">No date range selected</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
