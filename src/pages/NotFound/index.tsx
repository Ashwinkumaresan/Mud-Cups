import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white px-4 text-center">
      <div className="mb-8 relative">
        <span className="material-symbols-outlined text-[#1B4D3E] opacity-10" style={{ fontSize: '180px' }}>
          restaurant_menu
        </span>
        <span className="material-symbols-outlined text-[#1B4D3E] absolute inset-0 m-auto flex items-center justify-center text-6xl">
          search_off
        </span>
      </div>
      
      <h1 className="text-4xl font-black text-[#1B4D3E] mb-3">
        404 - Page Not Found
      </h1>
      
      <p className="text-gray-500 mb-8 max-w-md text-lg">
        Oops! It looks like we can't find the page you're looking for. 
        It might have been removed, renamed, or didn't exist in the first place.
      </p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 border-2 border-[#1B4D3E] text-[#1B4D3E] font-bold rounded hover:bg-[#1B4D3E] hover:text-white transition-colors cursor-pointer"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-[#1B4D3E] text-white font-bold rounded shadow-sm hover:bg-[#123329] active:scale-95 transition-all cursor-pointer"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};
