import React from 'react';

export const CustomCalendar = ({ startDate, endDate, onChange }: { startDate: Date | null, endDate: Date | null, onChange: (range: {start: Date | null, end: Date | null}) => void }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  
  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0,0,0,0);
    
    if (!startDate || (startDate && endDate)) {
      onChange({ start: clickedDate, end: null });
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        onChange({ start: clickedDate, end: null });
      } else {
        onChange({ start: startDate, end: clickedDate });
      }
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const renderDays = () => {
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const allCells = [...blanks, ...days];
    
    return allCells.map((day, i) => {
      if (!day) return <div key={`blank-${i}`} className="w-8 h-8"></div>;
      
      const thisDate = new Date(year, month, day);
      thisDate.setHours(0,0,0,0);
      
      let isSelected = false;
      let isBetween = false;
      
      if (startDate && thisDate.getTime() === startDate.getTime()) isSelected = true;
      if (endDate && thisDate.getTime() === endDate.getTime()) isSelected = true;
      
      if (startDate && endDate && thisDate > startDate && thisDate < endDate) {
        isBetween = true;
      }
      
      return (
        <button 
          key={day}
          onClick={() => handleDayClick(day)}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold transition-colors
            ${isSelected ? 'bg-[#1B4D3E] text-white shadow-sm' : ''}
            ${isBetween ? 'bg-[#1B4D3E]/10 text-[#1B4D3E]' : ''}
            ${!isSelected && !isBetween ? 'hover:bg-gray-100 text-gray-700' : ''}
          `}
        >
          {day}
        </button>
      );
    });
  };

  return (
    <div className="bg-white p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>
        <span className="font-bold text-sm text-gray-800">{monthNames[month]} {year}</span>
        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-600 transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-[10px] font-bold text-gray-400 uppercase">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 justify-items-center">
        {renderDays()}
      </div>
    </div>
  );
};
