import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ICONS } from '../data/mock';
import { Sparkles, Clock, User, Phone, Loader2, X } from 'lucide-react';
import { Service } from '../types';
import Calendar from '../components/Calendar';
import ProfilePageSkeleton from '../components/ProfilePageSkeleton';

// Adiciona uma função para exibir notificações de confirmação de agendamento.
const showBookingConfirmationNotification = async (serviceName: string, professionalName: string, time: Date) => {
  if (!('Notification' in window)) {
    console.warn("Este navegador não suporta notificações de desktop.");
    return;
  }

  // Solicita permissão ao usuário. Se já concedida, retorna 'granted' imediatamente.
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    const title = `Agendamento Confirmado: ${serviceName}`;
    const options = {
      body: `Seu horário com ${professionalName} às ${time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} está confirmado!`,
      icon: '/favicon.svg', // Ícone da notificação
    };
    new Notification(title, options);
  }
};

const ProfilePage: React.FC = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const navigate = useNavigate();
  const { allProfessionals, services, addAppointment, appointments, loading } = useAppContext();

  const professional = allProfessionals.find(p => p.id === Number(professionalId));
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('+55');
  const [validationError, setValidationError] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const professionalAppointments = useMemo(() => {
    return appointments.filter(apt => apt.professionalId === Number(professionalId));
  }, [appointments, professionalId]);

  const timeSlots = useMemo(() => {
    if (!selectedDate || !professional || !selectedService) return [];

    const dayOfWeek = selectedDate.getDay();
    // FIX: Removed unnecessary type assertion as `professional.availability` is now correctly typed.
    const dayAvailability = professional.availability[dayOfWeek];
    if (!dayAvailability || dayAvailability.length === 0) return [];

    const slots: { time: Date, isAvailable: boolean }[] = [];
    const now = new Date();
    const interval = professional.bookingSlotInterval || 15;

    dayAvailability.forEach(timeBlock => {
      const startHour = Math.floor(timeBlock.start);
      const startMinute = (timeBlock.start % 1) * 60;
      const blockStartTime = new Date(selectedDate);
      blockStartTime.setHours(startHour, startMinute, 0, 0);

      const endHour = Math.floor(timeBlock.end);
      const endMinute = (timeBlock.end % 1) * 60;
      const blockEndTime = new Date(selectedDate);
      blockEndTime.setHours(endHour, endMinute, 0, 0);

      let currentTime = blockStartTime;

      while (currentTime < blockEndTime) {
        const slotTime = new Date(currentTime);
        
        if (slotTime > now) {
          const slotEndTime = new Date(slotTime.getTime() + selectedService.duration * 60000);
            
          if (slotEndTime <= blockEndTime) {
            const isOverlapping = professionalAppointments.some(apt => 
              (slotTime < apt.endTime && slotEndTime > apt.startTime)
            );
            slots.push({ time: slotTime, isAvailable: !isOverlapping });
          }
        }
        currentTime = new Date(currentTime.getTime() + interval * 60000);
      }
    });

    const uniqueSlots = Array.from(new Map(slots.map(s => [s.time.getTime(), s])).values());
    return uniqueSlots.sort((a, b) => a.time.getTime() - b.time.getTime());
  }, [selectedDate, professional, selectedService, professionalAppointments]);


  if (loading && !professional) {
      return <ProfilePageSkeleton />;
  }

  if (!professional) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">Profissional não encontrado.</h1>
        <Link to="/" className="mt-4 inline-block bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
          Voltar para a Página Inicial
        </Link>
      </div>
    );
  }
  
  const professionalServices = services.filter(s => professional.services.includes(s.id));

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedTime(null);
    setSelectedDate(null);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: Date) => {
    setSelectedTime(time);
    setValidationError('');
    setIsConfirmationModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsConfirmationModalOpen(false);
    setSelectedTime(null);
  };
  
  const handleConfirmBooking = async () => {
    if (!clientName.trim()) {
        setValidationError('Por favor, preencha seu nome.');
        return;
    }
    const cleanWhatsapp = clientWhatsapp.replace(/[\s()-]/g, '');
    if (!/^\+55\d{10,11}$/.test(cleanWhatsapp)) {
        setValidationError('WhatsApp inválido. Use o formato +55 (XX) XXXXX-XXXX.');
        return;
    }
    setValidationError('');

    if (selectedTime && selectedService && professional) {
      setIsBooking(true);
      try {
        const endTime = new Date(selectedTime.getTime() + selectedService.duration * 60000);
        
        const newAppointment = {
          professionalId: professional.id,
          serviceId: selectedService.id,
          clientName,
          clientWhatsapp,
          startTime: selectedTime,
          endTime,
        };
        await addAppointment(newAppointment);
        
        // Dispara a notificação push após o agendamento ser bem-sucedido
        await showBookingConfirmationNotification(selectedService.name, professional.name, selectedTime);

        const confirmationState = {
            time: selectedTime.toISOString(),
            endTime: endTime.toISOString(),
            service: selectedService,
            professionalName: professional.name,
            clientName,
            clientWhatsapp
        };
        navigate('/confirmation', { state: confirmationState });
      } catch (error) {
        alert("Ocorreu um erro ao confirmar o agendamento. Por favor, tente novamente.");
      } finally {
        setIsBooking(false);
      }
    }
  };


  return (
    <>
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 pb-8 border-b">
          <img 
            src={professional.photoUrl} 
            alt={professional.name} 
            className="rounded-full w-32 h-32 sm:w-40 sm:h-40 object-cover border-4 border-primary shadow-md flex-shrink-0" 
          />
          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-4xl font-bold text-dark">{professional.name}</h1>
            <p className="text-xl font-semibold text-secondary mt-1">{professional.specialty}</p>
            <p className="text-gray-600 mt-4">{professional.bio}</p>
          </div>
        </div>
        
        {/* Booking Flow Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
          {/* Left Column: Services & Calendar */}
          <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-3">1. Selecione um Serviço</h2>
                {professionalServices.length > 0 ? (
                  <div className="space-y-3">
                    {professionalServices.map(service => {
                      const IconComponent = ICONS[service.icon] || Sparkles;
                      const isSelected = selectedService?.id === service.id;
                      return (
                        <button 
                          key={service.id} 
                          onClick={() => handleServiceSelect(service)}
                          className={`w-full p-4 rounded-lg border-2 transition-all flex items-start text-left ${isSelected ? 'bg-primary text-white border-primary shadow-md' : 'bg-light hover:bg-gray-200 border-transparent'}`}
                          aria-pressed={isSelected}
                        >
                          <div className={`rounded-full p-3 mr-4 flex-shrink-0 ${isSelected ? 'bg-white text-primary' : 'bg-secondary text-white'}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between items-baseline">
                              <h3 className="text-lg font-semibold">{service.name}</h3>
                              <p className={`font-bold text-lg whitespace-nowrap ${isSelected ? 'text-white' : 'text-primary'}`}>R$ {service.price.toFixed(2)}</p>
                            </div>
                            <p className={`text-sm mt-1 ${isSelected ? 'text-indigo-200' : 'text-gray-600'}`}>{service.description}</p>
                            <p className={`text-sm flex items-center justify-start gap-1 mt-2 ${isSelected ? 'text-indigo-200' : 'text-gray-500'}`}><Clock className="w-4 h-4" /> {service.duration} min</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 bg-light p-4 rounded-md">Nenhum serviço disponível no momento.</p>
                )}
            </div>
             {selectedService && (
                <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-3">2. Escolha a Data</h2>
                    <Calendar 
                        selectedDate={selectedDate}
                        onDateSelect={handleDateSelect}
                        // FIX: Removed unnecessary type assertion as the prop type is now correctly inferred.
                        availability={professional.availability}
                    />
                </div>
             )}
          </div>

          {/* Right Column: Time */}
          <div>
            {!selectedService ? (
              <div className="flex items-center justify-center h-full bg-light rounded-lg p-8">
                <p className="text-gray-500 text-center text-lg">Selecione um serviço para ver os horários disponíveis.</p>
              </div>
            ) : !selectedDate ? (
                 <div className="flex items-center justify-center h-full bg-light rounded-lg p-8 animate-fade-in">
                    <p className="text-gray-500 text-center text-lg">Selecione uma data no calendário para ver os horários.</p>
                </div>
            ) : (
                 <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold mb-3">3. Escolha o Horário</h2>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto p-3 bg-light rounded-lg">
                      {timeSlots.length > 0 && timeSlots.some(s => s.isAvailable) ? (
                        timeSlots.map(slot => {
                          const isSelected = selectedTime?.getTime() === slot.time.getTime();
                          return (
                            <button
                              key={slot.time.getTime()}
                              onClick={() => slot.isAvailable && handleTimeSelect(slot.time)}
                              disabled={!slot.isAvailable}
                              className={`p-3 rounded-lg transition-colors text-sm font-medium ${
                                  !slot.isAvailable 
                                  ? 'bg-gray-300 text-gray-500 line-through cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-primary text-white ring-2 ring-offset-1 ring-primary'
                                  : 'bg-secondary text-white hover:bg-pink-600'
                              }`}
                            >
                              {slot.time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </button>
                          )
                        })
                      ) : (
                        <p className="col-span-full text-gray-500 text-center py-4">Nenhum horário disponível para este dia. Tente outra data.</p>
                      )}
                    </div>
                 </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmationModalOpen && selectedTime && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold text-dark">Confirmar Agendamento</h2>
                    <button onClick={handleCloseModal} className="p-2 rounded-full hover:bg-gray-200" aria-label="Fechar modal">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                    <p className="text-gray-700">
                        Você está agendando <strong>{selectedService.name}</strong> com <strong>{professional.name}</strong>.
                    </p>
                    <div className="bg-light p-4 rounded-md shadow-sm text-gray-800 border border-primary/10">
                        <p><strong>Data e Hora:</strong> {selectedTime.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })}</p>
                        <p><strong>Preço:</strong> R$ {selectedService.price.toFixed(2)}</p>
                    </div>
                    
                    <h3 className="text-xl font-semibold pt-2">Seus Dados</h3>
                    <div className="space-y-4">
                        <div className="relative">
                            <label htmlFor="clientName" className="sr-only">Seu Nome</label>
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input type="text" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} className="pl-10 block w-full px-3 py-2 bg-white text-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="Seu Nome Completo"/>
                        </div>
                        <div className="relative">
                            <label htmlFor="clientWhatsapp" className="sr-only">Seu WhatsApp</label>
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input type="tel" id="clientWhatsapp" value={clientWhatsapp} onChange={e => setClientWhatsapp(e.target.value)} className="pl-10 block w-full px-3 py-2 bg-white text-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="+55 (XX) XXXXX-XXXX" />
                        </div>
                    </div>
                    {validationError && <p className="text-red-500 text-sm mt-2 text-center">{validationError}</p>}
                </div>
                
                <div className="mt-6 flex justify-end gap-4 border-t pt-6">
                    <button onClick={handleCloseModal} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
                    <button onClick={handleConfirmBooking} disabled={isBooking || !clientName.trim()} className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-pink-600 flex items-center justify-center font-semibold disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors">
                        {isBooking ? <Loader2 className="animate-spin w-5 h-5" /> : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
