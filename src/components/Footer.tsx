import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-white border-t border-gray-200 w-full py-12 px-4 md:px-6 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
          <a href="#" className="text-xl font-extrabold text-[#1B4D3E] flex items-center gap-2">
            <span className="material-symbols-outlined fill-1 text-2xl">restaurant_menu</span>
            <span>Mud Cups</span>
          </a>
          <p className="text-[#6B6B6B] text-xs leading-relaxed max-w-xs">
            Delivering happiness, one meal at a time. The fastest, freshest food delivery network.
          </p>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-[#1C1C1C] mb-1">Company</h4>
          <a href="#" className="text-xs text-[#6B6B6B] hover:underline hover:text-[#1B4D3E] transition-colors">
            About Us
          </a>
          <a href="#" className="text-xs text-[#6B6B6B] hover:underline hover:text-[#1B4D3E] transition-colors">
            Partner with us
          </a>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-[#1C1C1C] mb-1">Legal</h4>
          <a href="#" className="text-xs text-[#6B6B6B] hover:underline hover:text-[#1B4D3E] transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-xs text-[#6B6B6B] hover:underline hover:text-[#1B4D3E] transition-colors">
            Privacy Policy
          </a>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-[#1C1C1C] mb-1">Support</h4>
          <a href="#" className="text-xs text-[#6B6B6B] hover:underline hover:text-[#1B4D3E] transition-colors">
            Help Center
          </a>
          <div className="mt-3 flex flex-col gap-2">
            <div className="h-10 w-32 bg-white border border-[#ECECEC] rounded flex items-center justify-center text-xs font-bold text-[#1C1C1C] hover:bg-gray-50 cursor-pointer transition-colors shadow-xs">
              App Store
            </div>
            <div className="h-10 w-32 bg-white border border-[#ECECEC] rounded flex items-center justify-center text-xs font-bold text-[#1C1C1C] hover:bg-gray-50 cursor-pointer transition-colors shadow-xs">
              Google Play
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Share */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-[#e4bebc]/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[#6B6B6B] text-xs">© 2024 Mud Cups. All rights reserved.</p>
        <div className="flex items-center gap-3">
          {copied && <span className="text-xs text-emerald-600 font-bold">Link Copied!</span>}
          <button
            onClick={handleShare}
            aria-label="Share App"
            className="w-8 h-8 rounded-full bg-white border border-[#ECECEC] flex items-center justify-center text-[#1C1C1C] hover:text-[#1B4D3E] hover:border-[#1B4D3E] transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-base">share</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
