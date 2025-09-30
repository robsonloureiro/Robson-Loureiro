import React, { useState, useEffect } from 'react';
import { Professional, TimeSlot } from '../types';
import { X, PlusCircle, Trash2 } from 'lucide-react';

type Availability = Professional['availability'];

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  availability: Availability;
  onSave: (newAvailability: Availability) => void;
}

const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const timeValue = hour + (i % 2 === 0 ? 0 : 0.5);
    return {
        label: `${String(hour).padStart(2, '0')}:${minute}`,
        value: timeValue
    };
});

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({ isOpen, onClose, availability, onSave }) => {
  const [currentAvailability, setCurrentAvailability] = useState<Availability>({});

  useEffect(() => {
    // When the modal opens, create a deep copy of the availability prop
    // to avoid mutating the original state from the context.
    if (isOpen) {
        setCurrentAvailability(JSON.parse(JSON.stringify(availability || {})));
    }
  }, [availability, isOpen]);

  if (!isOpen) return null;

  const handleCheckboxChange = (dayIndex: number) => {
    setCurrentAvailability(prev => {
        // FIX: Removed unnecessary type cast. The `Availability` type is an object, so it can be spread directly.
        const newAvailability = { ...prev };
        if (newAvailability[dayIndex]) {
            delete newAvailability[dayIndex];
        } else {
            // Set default hours when enabling a day
            newAvailability[dayIndex] = [{ start: 9, end: 18 }];
        }
        return newAvailability;
    });
  };

  const addTimeSlot = (dayIndex: number) => {
    setCurrentAvailability(prev => {
        // FIX: Removed unnecessary type cast.
        const newAvailability = { ...prev };
        const daySlots = newAvailability[dayIndex] || [];
        const lastSlot = daySlots[daySlots.length - 1];
        const newStart = lastSlot ? lastSlot.end : 9; // Start after last slot ends, or default to 9
        const newEnd = newStart + 1;

        if (newEnd > 24) return prev; // Prevent creating slots past midnight

        newAvailability[dayIndex] = [...daySlots, { start: newStart, end: newEnd }];
        return newAvailability;
    });
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setCurrentAvailability(prev => {
        // FIX: Removed unnecessary type cast.
        const newAvailability = { ...prev };
        const daySlots = newAvailability[dayIndex];
        if (!daySlots) return prev; // No slots to remove

        const updatedSlots = daySlots.filter((_, i) => i !== slotIndex);

        if (updatedSlots.length === 0) {
            delete newAvailability[dayIndex];
        } else {
            newAvailability[dayIndex] = updatedSlots;
        }
        return newAvailability;
    });
  };

  const handleTimeChange = (dayIndex: number, slotIndex: number, type: 'start' | 'end', value: string) => {
    setCurrentAvailability(prev => {
        // FIX: Removed unnecessary type cast.
        const newAvailability = { ...prev };
        const daySlots = newAvailability[dayIndex];
        if (!daySlots) return prev;

        const timeValue = parseFloat(value);
        const newSlots: TimeSlot[] = [...daySlots]; // copy array
        const newSlot = { ...newSlots[slotIndex], [type]: timeValue }; // copy object being changed
        
        // Basic validation: ensure end time is after start time
        if (type === 'start' && timeValue >= newSlot.end) {
            newSlot.end = timeValue + 0.5 > 24 ? 24 : timeValue + 0.5;
        }
        if (type === 'end' && timeValue <= newSlot.start) {
            newSlot.start = timeValue - 0.5 < 0 ? 0 : timeValue - 0.5;
        }
        
        newSlots[slotIndex] = newSlot;
        newAvailability[dayIndex] = newSlots;
        return newAvailability;
    });
  };
  
  const handleSave = () => {
      onSave(currentAvailability);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-dark">Editar Horários de Trabalho</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Fechar modal">
                <X className="w-6 h-6" />
            </button>
        </div>

        <div className="flex-grow overflow-y-auto pr-2">
            <div className="space-y-4">
            {weekDays.map((day, index) => {
                // FIX: Removed 'as any' cast. With the corrected 'Availability' type, TypeScript can correctly infer the type.
                const dayAvailability = currentAvailability[index];
                const isChecked = !!dayAvailability;
                return (
                <div key={index} className="p-4 rounded-lg bg-light">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id={`day-${index}`}
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(index)}
                                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={`day-${index}`} className="font-semibold text-gray-800 text-lg">{day}</label>
                        </div>
                        <button onClick={() => addTimeSlot(index)} disabled={!isChecked} className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed">
                            <PlusCircle className="w-4 h-4"/> Adicionar intervalo
                        </button>
                    </div>

                    {isChecked && (
                        <div className="space-y-3 mt-3 pl-8">
                            {dayAvailability.map((slot, slotIndex) => (
                                <div key={slotIndex} className="flex items-center gap-4 p-2 bg-white rounded-md">
                                    <div className="flex-grow grid grid-cols-2 gap-3 items-center">
                                        <select
                                            value={slot.start}
                                            onChange={(e) => handleTimeChange(index, slotIndex, 'start', e.target.value)}
                                            className="w-full px-3 py-2 bg-white text-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        >
                                            {timeSlots.map(ts => <option key={`start-${ts.value}`} value={ts.value}>{ts.label}</option>)}
                                        </select>
                                        <select
                                            value={slot.end}
                                            onChange={(e) => handleTimeChange(index, slotIndex, 'end', e.target.value)}
                                            className="w-full px-3 py-2 bg-white text-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                        >
                                            {timeSlots.map(ts => <option key={`end-${ts.value}`} value={ts.value}>{ts.label}</option>)}
                                        </select>
                                    </div>
                                    <button onClick={() => removeTimeSlot(index, slotIndex)} className="text-gray-500 hover:text-secondary p-1 rounded-full">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                );
            })}
            </div>
        </div>

        <div className="mt-8 flex justify-end gap-4 border-t pt-6">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold">Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityModal;
