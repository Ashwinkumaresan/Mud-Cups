import React, { useEffect, useState } from 'react';
import { fetchMetrics } from '../api';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchMetrics();
        setMetrics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-8 h-8 border-4 border-[#1B4D3E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Active Orders', value: metrics?.activeOrders || 0, icon: 'receipt_long', color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Menu Items', value: metrics?.menuItems || 0, icon: 'restaurant_menu', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Categories', value: metrics?.categories || 0, icon: 'category', color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Combos', value: metrics?.combos || 0, icon: 'fastfood', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#271717] mb-1">Dashboard</h2>
        <p className="text-gray-500">Welcome to the Mud Cups admin panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-semibold mb-1">{stat.title}</p>
              <h3 className="text-3xl font-extrabold text-[#271717]">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
