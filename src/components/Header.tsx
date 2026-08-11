import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  user: UserProfile | null;
  sessionId: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onOpenAuth,
  user,
  sessionId,
}) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <div className="flex justify-between items-center w-full px-4 md:px-6 max-w-7xl mx-auto h-16">
        {/* Brand */}
        <Link
          to="/"
          className="text-xl font-bold text-[#b7122a] flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined fill-1 text-xl text-[#b7122a]">
            restaurant_menu
          </span>
          <span>Mud Cups</span>
        </Link>



        {/* Navigation removed */}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 ml-4 md:ml-8">
          {/*
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 text-[#271717] bg-white hover:bg-gray-50 border border-[#b7122a]/20 transition-all font-semibold text-xs md:text-sm cursor-pointer px-3 py-1.5 rounded-xl shadow-2xs hover:shadow-xs"
            title="Invite or Join Session"
          >
            <span className="material-symbols-outlined text-lg text-[#b7122a]">group_add</span>
            <span className="font-extrabold text-[#b7122a]">Invite / Join</span>
            <span className="hidden sm:inline-block bg-[#b7122a]/10 text-[#b7122a] font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
              {sessionId}
            </span>
          </button>
          */}

        </div>
      </div>
    </header>
  );
};
