
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Service } from '../types';
import { CalendarDays, DollarSign, Users, Scissors, RefreshCw, Plus, Calendar as CalendarIcon, UserPlus, TrendingUp, Clock } from 'lucide-react';
import ProfileModal from '../components/ProfileModal';
import DashboardSkeleton from '../components/DashboardSkeleton';

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

const AppointmentItem: React.FC<{ appointment: any; service?: Service }> = ({ appointment, service }) => (
    <div className="flex items-center justify-between p-3 bg-light rounded-md">
        <div>
            <p className="font-semibold text-gray-800">{appointment.clientName}</p>
            <p className="text-sm text-gray-500">{service?.name || 'Serviço não encontrado'}</p>
        </div>
        <p className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded-md">
            {appointment.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
    </div>
);

const EmptyState: React.FC<{ message: string; subMessage: string }> = ({ message, subMessage }) => (
    <div className="flex flex-col items-center justify-center text-center text-gray-500 h-full py-8">
        <CalendarDays className="w-12 h-12 text-gray-300 mb-4" />
        <p className="font-semibold">{message}</p>
        <p className="text-sm">{subMessage}</p>
    </div>
);


const WelcomeScreen: React.FC<{ onOpenProfileModal: () => void }> = ({ onOpenProfileModal }) => (
    <div className="text-center bg-white p-10 rounded-xl shadow-2xl max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-4xl font-bold text-dark mb-4">Bem-vindo(a) ao Beauty Pro!</h1>
        <p className="text-lg text-gray-600 mb-6">
            Seu painel está quase pronto. O primeiro passo é criar seu perfil público para que seus clientes possam te encontrar.
        </p>
        <button 
            onClick={onOpenProfileModal}
            className="bg-secondary text-white font-bold py-3 px-8 rounded-full hover:bg-pink-600 transition-transform transform hover:scale-105 inline-block text-lg"
        >
            Criar Meu Perfil Agora
        </button>
    </div>
);

const DashboardPage: React.FC = () => {
  const { appointments, profile, services, loading } = useAppContext();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const stats = useMemo(() => {
    if (!profile) return { today: [], tomorrow: [], billing: { today: 0, month: 0 }, clients: 0, activeServices: 0 };

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    
    const appointmentsToday = appointments.filter(apt => isSameDay(apt.startTime, today));
    const appointmentsTomorrow = appointments.filter(apt => isSameDay(apt.startTime, tomorrow));
    const appointmentsThisMonth = appointments.filter(apt => apt.startTime.getMonth() === today.getMonth() && apt.startTime.getFullYear() === today.getFullYear());
    
    const getServicePrice = (serviceId: number) => services.find(s => s.id === serviceId)?.price || 0;

    const billingToday = appointmentsToday.reduce((sum, apt) => sum + getServicePrice(apt.serviceId), 0);
    const billingMonth = appointmentsThisMonth.reduce((sum, apt) => sum + getServicePrice(apt.serviceId), 0);
    
    const totalClients = new Set(appointments.map(a => a.clientWhatsapp)).size;
    const activeServices = services.filter(s => profile.services.includes(s.id)).length;

    return {
        today: appointmentsToday.sort((a,b) => a.startTime.getTime() - b.startTime.getTime()),
        tomorrow: appointmentsTomorrow.sort((a,b) => a.startTime.getTime() - b.startTime.getTime()),
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
          <>
            <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} professional={null} />
            <WelcomeScreen onOpenProfileModal={() => setIsProfileModalOpen(true)} />
          </>
      );
  }

  return (
    <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Bem-vindo de volta, {profile.name.split(' ')[0]}! Aqui está um resumo do seu dia.</p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
            
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <StatCard title="Agendamentos Hoje" value={stats.today.length} icon={CalendarDays} gradient="bg-gradient-to-br from-indigo-400 to-indigo-500" />
                    <StatCard title="Faturamento Hoje" value={`R$ ${stats.billing.today.toFixed(2)}`} icon={DollarSign} gradient="bg-gradient-to-br from-green-400 to-green-500" />
                    <StatCard title="Total de Clientes" value={stats.clients} icon={Users} gradient="bg-gradient-to-br from-purple-400 to-purple-500" />
                    <StatCard title="Serviços Ativos" value={stats.activeServices} icon={Scissors} gradient="bg-gradient-to-br from-pink-400 to-pink-500" />
                </div>
                
                <DashboardPanel 
                    title={`Agendamentos de Hoje (${stats.today.length})`} 
                    icon={CalendarDays}
                    action={<button className="p-2 rounded-full hover:bg-gray-100"><RefreshCw className="w-4 h-4 text-gray-500" /></button>}
                >
                    {stats.today.length > 0 ? (
                        <div className="space-y-2">
                           {stats.today.map(apt => (
                               <AppointmentItem key={apt.id} appointment={apt} service={services.find(s => s.id === apt.serviceId)} />
                           ))}
                        </div>
                    ) : (
                        <EmptyState message="Nenhum agendamento para hoje" subMessage="Que tal aproveitar para organizar seus serviços?" />
                    )}
                </DashboardPanel>
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
                <DashboardPanel title={`Amanhã (${stats.tomorrow.length})`} icon={Clock}>
                    {stats.tomorrow.length > 0 ? (
                        <div className="space-y-2">
                            {stats.tomorrow.slice(0, 3).map(apt => (
                               <AppointmentItem key={apt.id} appointment={apt} service={services.find(s => s.id === apt.serviceId)} />
                            ))}
                            {stats.tomorrow.length > 3 && <p className="text-center text-sm text-gray-500 mt-2">+ {stats.tomorrow.length - 3} agendamentos</p>}
                        </div>
                    ) : (
                        <p className="text-sm text-center text-gray-500 py-4">Nenhum agendamento para amanhã.</p>
                    )}
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

export default DashboardPage;