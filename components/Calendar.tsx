import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  availability: { [dayOfWeek: number]: any };
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, availability }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDayOfWeek = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
  };

  const days = [];
  // Add empty cells for days before the start of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(<div key={`empty-start-${i}`} className="border bg-gray-50"></div>);
  }

  // Add cells for each day of the month
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    const dayOfWeek = dayDate.getDay();
    const isAvailable = availability[dayOfWeek] && availability[dayOfWeek].length > 0;
    const isPast = dayDate < today;
    const isDisabled = isPast || !isAvailable;

    const isSelected = selectedDate?.toDateString() === dayDate.toDateString();
    const isToday = today.toDateString() === dayDate.toDateString();

    days.push(
      <button
        key={i}
        onClick={() => onDateSelect(dayDate)}
        disabled={isDisabled}
        className={`p-2 border h-14 flex items-center justify-center text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          isDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : isSelected ? 'bg-primary text-white font-bold'
          : 'hover:bg-primary/10'
        }`}
      >
        <span className={`w-8 h-8 flex items-center justify-center rounded-full ${isToday && !isSelected ? 'border-2 border-secondary' : ''}`}>{i}</span>
      </button>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200" aria-label="Mês anterior">
          <ChevronLeft />
        </button>
        <h2 className="text-lg font-semibold text-dark">
          {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200" aria-label="Próximo mês">
          <ChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 text-sm text-center text-gray-500 mb-2 font-medium">
        <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
      </div>
      <div className="grid grid-cols-7">{days}</div>
    </div>
  );
};

export default Calendar;
