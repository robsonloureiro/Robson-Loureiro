
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, CalendarPlus } from 'lucide-react';
import { Service } from '../types';

const ConfirmationPage: React.FC = () => {
  const location = useLocation();
  const { time, service, professionalName, clientName, clientWhatsapp, endTime } = location.state || {};

  if (!time || !service) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">Erro!</h1>
        <p className="mt-2 text-gray-600">Não foi possível encontrar os detalhes do agendamento.</p>
        <Link to="/" className="mt-4 inline-block bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
          Voltar para a Página Inicial
        </Link>
      </div>
    );
  }

  // Function to format dates for Google Calendar URL (YYYYMMDDTHHMMSSZ)
  const formatGoogleCalendarDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '');
  };
  
  const generateGoogleCalendarLink = () => {
    const startTimeFormatted = formatGoogleCalendarDate(new Date(time));
    const endTimeFormatted = formatGoogleCalendarDate(new Date(endTime));
    
    const eventDetails = {
      text: `Agendamento: ${service.name} com ${professionalName}`,
      dates: `${startTimeFormatted}/${endTimeFormatted}`,
      details: `Serviço: ${service.name}\nProfissional: ${professionalName}\nCliente: ${clientName}\n\nEste é um compromisso agendado através da plataforma Beauty Pro.`,
      location: 'Local do Salão/Barbearia' // Placeholder
    };

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.text)}&dates=${encodeURIComponent(eventDetails.dates)}&details=${encodeURIComponent(eventDetails.details)}&location=${encodeURIComponent(eventDetails.location)}`;
  };


  return (
    <div className="max-w-2xl mx-auto text-center p-10 bg-white rounded-xl shadow-2xl">
      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-4xl font-extrabold text-primary mb-4">Agendamento Confirmado!</h1>
      <p className="text-lg text-gray-700 mb-2">
        Olá, <strong>{clientName || 'Cliente'}</strong>! Seu horário está marcado.
      </p>
      <p className="text-gray-600 mb-8">
        Enviaremos uma confirmação e lembretes pelo WhatsApp. Mal podemos esperar para te ver!
      </p>
      <div className="bg-light p-6 rounded-lg text-left space-y-3 border border-primary/20">
        <h2 className="text-xl font-semibold border-b pb-2 mb-3">Resumo do Agendamento</h2>
        <p><strong>Profissional:</strong> {professionalName}</p>
        <p><strong>Serviço:</strong> {service.name}</p>
        <p><strong>Cliente:</strong> {clientName}</p>
        <p><strong>WhatsApp:</strong> {clientWhatsapp}</p>
        <p><strong>Data e Hora:</strong> {new Date(time).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
        <p><strong>Duração:</strong> {service.duration} minutos</p>
        <p><strong>Preço:</strong> R$ {service.price.toFixed(2)}</p>
        <a 
          href={generateGoogleCalendarLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-4 bg-white text-gray-700 border border-gray-300 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <CalendarPlus className="w-5 h-5" />
          <span>Adicionar ao Google Agenda</span>
        </a>
      </div>
      <Link to="/" className="mt-8 inline-block bg-secondary text-white font-bold py-3 px-8 rounded-full hover:bg-pink-600 transition-colors">
        Ver Mais Serviços
      </Link>
    </div>
  );
};

export default ConfirmationPage;