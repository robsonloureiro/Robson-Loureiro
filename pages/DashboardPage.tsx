

import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Service } from '../types';
import { CalendarDays, DollarSign, Users, Scissors, Plus, Calendar as CalendarIcon, UserPlus, TrendingUp, Clock, Copy, Eye, Check } from 'lucide-react';
import DashboardSkeleton from '../components/DashboardSkeleton';
import DashboardCalendar from '../components/DashboardCalendar';

// --- Sub-components do Dashboard ---

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; gradient: string }> = ({ title, value, icon: Icon, gradient }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center">
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg text-white flex items-center justify-center ${gradient}`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

const QuickActionButton: React.FC<{ title: string; icon: React.ElementType; color: string; onClick?: () => void }> = ({ title, icon: Icon, color, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${color}`}>
            <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-semibold text-gray-700">{title}</span>
    </button>
);

const DashboardPanel: React.FC<{ title: string; icon?: React.ElementType; children: React.ReactNode; action?: React.ReactNode }> = ({ title, icon: Icon, children, action }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5 text-primary" />}
                {title}
            </h3>
            {action}
        </div>
        <div className="flex-grow">
            {children}
        </div>
    </div>
);

const InicioPage: React.FC = () => {
  const { appointments, profile, services, loading } = useAppContext();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);

  const stats = useMemo(() => {
    if (!profile) return { appointmentsToday: 0, billing: { today: 0, month: 0 }, clients: 0, activeServices: 0 };

    const today = new Date();
    
    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    
    const appointmentsToday = appointments.filter(apt => isSameDay(apt.startTime, today));
    const appointmentsThisMonth = appointments.filter(apt => apt.startTime.getMonth() === today.getMonth() && apt.startTime.getFullYear() === today.getFullYear());
    
    const getServicePrice = (serviceId: number) => services.find(s => s.id === serviceId)?.price || 0;

    const billingToday = appointmentsToday.reduce((sum, apt) => sum + getServicePrice(apt.serviceId), 0);
    const billingMonth = appointmentsThisMonth.reduce((sum, apt) => sum + getServicePrice(apt.serviceId), 0);
    
    const totalClients = new Set(appointments.map(a => a.clientWhatsapp)).size;
    const activeServices = services.filter(s => profile.services.includes(s.id)).length;

    return {
        appointmentsToday: appointmentsToday.length,
        billing: {
            today: billingToday,
            month: billingMonth
        },
        clients: totalClients,
        activeServices: activeServices,
    }
  }, [profile, appointments, services]);

  if (loading) {
      return <DashboardSkeleton />;
  }
  
  if (!profile) {
      return (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center max-w-2xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo(a) ao Beauty Pro!</h1>
            <p className="text-gray-600 mt-2 mb-6">Seu painel está quase pronto. O primeiro passo é criar seu perfil público para que seus clientes possam te encontrar.</p>
            <Link 
              to="/dashboard/profile" 
              className="inline-block bg-secondary text-white font-bold py-3 px-8 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Criar Meu Perfil Agora
            </Link>
          </div>
      );
  }

  const publicLink = `${window.location.origin}/#/profile/${profile.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };


  return (
    <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Início</h1>
            <p className="text-gray-500 mt-1">Bem-vindo(a) de volta, {profile.name.split(' ')[0]}! Aqui está um resumo do seu negócio.</p>
        </div>

        {/* Public Link Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-bold text-gray-800">Seu Link Público</h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">Compartilhe este link com seus clientes para que eles possam agendar um horário diretamente com você.</p>
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <input 
                    type="text" 
                    readOnly 
                    value={publicLink} 
                    className="flex-grow w-full bg-light border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 font-mono text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button 
                        onClick={handleCopy} 
                        className="p-2.5 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
                        title={isCopied ? "Copiado!" : "Copiar"}
                    >
                        {isCopied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <a 
                        href={publicLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-full bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye className="w-5 h-5" />
                        <span>Visualizar</span>
                    </a>
                </div>
            </div>
        </div>


        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
            
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <StatCard title="Agendamentos Hoje" value={stats.appointmentsToday} icon={CalendarDays} gradient="bg-gradient-to-br from-indigo-400 to-indigo-500" />
                    <StatCard title="Faturamento Hoje" value={`R$ ${stats.billing.today.toFixed(2)}`} icon={DollarSign} gradient="bg-gradient-to-br from-green-400 to-green-500" />
                    <StatCard title="Total de Clientes" value={stats.clients} icon={Users} gradient="bg-gradient-to-br from-purple-400 to-purple-500" />
                    <StatCard title="Serviços Ativos" value={stats.activeServices} icon={Scissors} gradient="bg-gradient-to-br from-pink-400 to-pink-500" />
                </div>
                
                <DashboardCalendar appointments={appointments} />

            </div>

            {/* Right Sidebar */}
            <div className="xl:col-span-1 space-y-6">
                <DashboardPanel title="Ações Rápidas">
                     <div className="grid grid-cols-2 gap-3">
                        <QuickActionButton title="Novo Agendamento" icon={Plus} color="bg-blue-500" onClick={() => alert('Função ainda não implementada.')} />
                        <QuickActionButton title="Ver Calendário" icon={CalendarIcon} color="bg-purple-500" onClick={() => alert('Função ainda não implementada.')} />
                        <QuickActionButton title="Cadastrar Cliente" icon={UserPlus} color="bg-pink-500" onClick={() => alert('Função ainda não implementada.')} />
                        <Link to="/dashboard/availability" className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-green-500">
                                <Scissors className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">Gerenciar Horários</span>
                        </Link>
                    </div>
                </DashboardPanel>
                 <DashboardPanel title="Faturamento do Mês" icon={TrendingUp}>
                    <p className="text-3xl font-bold text-green-600">R$ {stats.billing.month.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">Total acumulado neste mês.</p>
                </DashboardPanel>
            </div>
        </div>
    </div>
  );
};

export default InicioPage;