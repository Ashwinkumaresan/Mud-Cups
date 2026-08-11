import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CheckoutFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTableChange?: (table: string) => void;
}

type OrderType = 'dine_in' | 'take_away' | null;

export const CheckoutFlowModal: React.FC<CheckoutFlowModalProps> = ({ isOpen, onClose, onTableChange }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [orderType, setOrderType] = useState<OrderType>(null);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');

  if (!isOpen) return null;

  const handleOrderTypeSelect = (type: OrderType) => {
    setOrderType(type);
    if (type === 'take_away') {
      if (onTableChange) {
        onTableChange('Takeaway');
        onClose();
      } else {
        setTableNumber('Takeaway');
        setStep(3); // Skip table selection
      }
    } else {
      setStep(2); // Go to table selection
    }
  };

  const handleTableSelect = (table: number) => {
    if (onTableChange) {
      onTableChange(table.toString());
      onClose();
    } else {
      setTableNumber(table.toString());
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    // Navigate to cart with state
    navigate('/cart', {
      state: {
        customerName: customerName.trim(),
        tableNumber: tableNumber,
      }
    });
    
    // Reset and close
    setStep(1);
    setOrderType(null);
    setTableNumber('');
    setCustomerName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-slideUp relative overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
        >
          <span className="material-symbols-outlined text-sm font-bold">close</span>
        </button>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-6 px-2 pt-2">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-[#b7122a]' : 'bg-gray-100'}`}></div>
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-[#b7122a]' : 'bg-gray-100'}`}></div>
          {!onTableChange && (
            <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-[#b7122a]' : 'bg-gray-100'}`}></div>
          )}
        </div>

        {/* Step 1: Order Type */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <h3 className="text-2xl font-extrabold text-[#271717] mb-2 text-center">Where will you be eating?</h3>
            <p className="text-gray-500 text-center mb-8">Select your dining preference</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleOrderTypeSelect('dine_in')}
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-2xl hover:border-[#b7122a] hover:bg-red-50 transition-all group"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                  <span className="material-symbols-outlined text-4xl text-[#b7122a]">restaurant</span>
                </div>
                <span className="font-bold text-lg text-gray-800">Dine In</span>
              </button>
              
              <button 
                onClick={() => handleOrderTypeSelect('take_away')}
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-100 rounded-2xl hover:border-[#b7122a] hover:bg-red-50 transition-all group"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                  <span className="material-symbols-outlined text-4xl text-[#b7122a]">takeout_dining</span>
                </div>
                <span className="font-bold text-lg text-gray-800">Take Away</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Table Selection */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <button 
              onClick={() => setStep(1)} 
              className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors mb-2"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back
            </button>
            <h3 className="text-2xl font-extrabold text-[#271717] mb-2 text-center">Select your Table</h3>
            <p className="text-gray-500 text-center mb-8">Where are you seated?</p>
            
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => handleTableSelect(num)}
                  className="aspect-square flex items-center justify-center border-2 border-gray-100 rounded-2xl hover:border-[#b7122a] hover:bg-[#b7122a] hover:text-white font-bold text-xl text-gray-700 transition-all"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Customer Name */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <button 
              onClick={() => {
                if (orderType === 'take_away') setStep(1);
                else setStep(2);
              }} 
              className="flex items-center gap-1 text-sm font-bold text-gray-400 hover:text-gray-800 transition-colors mb-2"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span> Back
            </button>
            <h3 className="text-2xl font-extrabold text-[#271717] mb-2 text-center">What's your name?</h3>
            <p className="text-gray-500 text-center mb-8">So we know who to serve</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name" 
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:outline-none focus:border-[#b7122a] focus:ring-4 focus:ring-[#b7122a]/10 transition-all text-lg font-medium text-center"
                  autoFocus
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={!customerName.trim()}
                className="w-full bg-[#b7122a] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#92001c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(183,18,42,0.39)]"
              >
                Go to Cart
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
