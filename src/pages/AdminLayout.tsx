import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard', end: true },
    { name: 'Active Orders', path: '/admin/orders', icon: 'receipt_long' },
    { name: 'Add Category', path: '/admin/add-category', icon: 'category' },
    { name: 'Add Food Item', path: '/admin/add-food-item', icon: 'restaurant_menu' },
    { name: 'Add Combo', path: '/admin/add-combo', icon: 'fastfood' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex sticky top-0 h-screen shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-[#1B4D3E] rounded-xl flex items-center justify-center text-white">
            <span className="material-symbols-outlined">local_cafe</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#271717] tracking-tight">Mud Cups <span className="text-[#1B4D3E] block text-xs tracking-widest uppercase">Admin</span></h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1B4D3E] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-xl font-semibold w-full transition-all"
          >
            <span className="material-symbols-outlined">storefront</span>
            Back to Store
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-extrabold text-[#271717]">Admin Panel</h1>
          <button onClick={() => navigate('/')} className="text-gray-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Mobile Nav (horizontal scrolling) */}
        <nav className="md:hidden flex overflow-x-auto bg-white border-b border-gray-200 p-2 gap-2 hide-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1B4D3E] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`
              }
            >
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
