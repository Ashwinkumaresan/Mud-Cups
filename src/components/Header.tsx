import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  user: any;
  hasActiveOrders?: boolean;
}

import { deleteCookie } from '../utils/cookies';

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenAuth,
  user,
  hasActiveOrders,
}) => {
  const handleLogout = () => {
    deleteCookie('mudcups_token');
    window.location.reload();
  };
  return (
    <>
      <header className="bg-[#1B4D3E] w-full relative z-50 pt-2">
      <div className="flex justify-between items-center w-full px-4 md:px-6 max-w-7xl mx-auto h-16">
        {/* Brand */}
        <Link
          to="/"
          className="text-xl font-bold text-white flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined fill-1 text-xl text-white">
            restaurant_menu
          </span>
          <span>Mud Cups</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 ml-4 md:ml-8">
          {hasActiveOrders && (
            <Link
              to="/orders"
              className="flex items-center justify-center text-white hover:bg-white/10 transition-all cursor-pointer p-2 rounded"
              title="My Orders"
            >
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[#1B4D3E] bg-white hover:bg-gray-100 transition-all font-semibold text-xs md:text-sm cursor-pointer px-4 py-1.5 rounded shadow-sm"
              title="Logout"
            >
              <span className="material-symbols-outlined text-lg text-[#1B4D3E]">logout</span>
              <span className="font-extrabold">{user.name}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 text-[#1B4D3E] bg-white hover:bg-gray-100 transition-all font-semibold text-xs md:text-sm cursor-pointer px-5 py-1.5 rounded shadow-sm"
              title="Login"
            >
              <span className="font-extrabold">Login</span>
            </button>
          )}
        </div>
      </div>
      </header>
      
      {/* Secondary Nav Row - Sticky */}
      <div className="sticky top-0 z-40 bg-[#1B4D3E] w-full shadow-md">
        <div className="w-full px-4 md:px-6 max-w-7xl mx-auto flex items-center justify-start gap-6 overflow-x-auto no-scrollbar py-2">
          <Link to="/offers" className="text-white/90 hover:text-white font-medium text-sm whitespace-nowrap">Offers</Link>
          <Link to="/combos" className="text-white/90 hover:text-white font-medium text-sm whitespace-nowrap">Combo</Link>
          <a href="#games" className="text-white/90 hover:text-white font-medium text-sm whitespace-nowrap">Games</a>
          <a href="#membership" className="text-white/90 hover:text-white font-medium text-sm whitespace-nowrap">Membership</a>
        </div>
      </div>
    </>
  );
};
