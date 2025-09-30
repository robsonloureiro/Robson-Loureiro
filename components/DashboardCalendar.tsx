import React, { useState } from 'react';
import { Appointment } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface DashboardCalendarProps {
  appointments: Appointment[];
}

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ appointments }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const { services } = useAppContext();

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDayOfWeek = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const appointmentsByDate = appointments.reduce((acc, apt) => {
    const dateStr = apt.startTime.toDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const selectedDateAppointments = selectedDate ? appointmentsByDate[selectedDate.toDateString()] || [] : [];

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1));
    setSelectedDate(null);
  };

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(<div key={`empty-start-${i}`} className="h-24 border bg-gray-50"></div>);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    const dateStr = dayDate.toDateString();
    const hasAppointments = !!appointmentsByDate[dateStr];
    const isSelected = selectedDate?.toDateString() === dateStr;
    const isToday = new Date().toDateString() === dateStr;

    days.push(
      <div
        key={i}
        onClick={() => setSelectedDate(dayDate)}
        className={`p-2 border h-24 flex flex-col cursor-pointer transition-colors ${
          isSelected ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-gray-100'
        }`}
      >
        <span className={`font-medium self-start ${isToday ? 'bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>{i}</span>
        {hasAppointments && <div className="mt-1 flex-grow overflow-y-auto text-xs space-y-1">
            {appointmentsByDate[dateStr].slice(0, 2).map(apt => (
                 <div key={apt.id} className="bg-primary/80 text-white rounded px-1 truncate" title={apt.clientName}>{apt.clientName}</div>
            ))}
            {appointmentsByDate[dateStr].length > 2 && <div className="text-gray-500 text-center">+ {appointmentsByDate[dateStr].length - 2}</div>}
        </div>}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200"><ChevronLeft /></button>
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200"><ChevronRight /></button>
      </div>
      <div className="grid grid-cols-7 text-sm text-center text-gray-500 mb-2 font-medium">
        <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
      </div>
      <div className="grid grid-cols-7 border-t border-l">{days}</div>

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Agendamentos para {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h3>
          {selectedDateAppointments.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {selectedDateAppointments.sort((a,b) => a.startTime.getTime() - b.startTime.getTime()).map(apt => {
                const service = services.find(s => s.id === apt.serviceId);
                return (
                  <div key={apt.id} className="bg-light p-3 rounded-md flex justify-between items-center">
                    <div>
                        <p className="font-semibold">{service?.name}</p>
                        <p className="text-sm text-gray-600">Cliente: {apt.clientName}</p>
                    </div>
                    <p className="font-mono text-sm bg-primary text-white px-2 py-1 rounded">
                        {apt.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-gray-500 bg-light p-4 rounded-md text-center">Nenhum agendamento para este dia.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardCalendar;