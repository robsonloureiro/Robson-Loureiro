import React, { useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';
import { Home, CalendarDays, Users, Scissors, BarChart3, MessageSquare, LogOut, Sparkles, User } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { profile, appointments, services } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Início', href: '/dashboard', icon: Home },
    { name: 'Agendamentos', href: '/dashboard/appointments', icon: CalendarDays },
    { name: 'Clientes', href: '/dashboard/clients', icon: Users },
    { name: 'Serviços', href: '/dashboard/services', icon: Scissors },
    { name: 'Perfil', href: '/dashboard/profile', icon: User },
    { name: 'Estatísticas', href: '/dashboard/stats', icon: BarChart3 },
    { name: 'Suporte', href: '/dashboard/support', icon: MessageSquare },
  ];

  const enabledPages = ['Início', 'Agendamentos', 'Clientes', 'Serviços', 'Perfil', 'Estatísticas', 'Suporte']; // Array de páginas ativas

  const dailyStats = useMemo(() => {
      const today = new Date();
      const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
      
      const appointmentsToday = appointments.filter(apt => isSameDay(apt.startTime, today));
      const getServicePrice = (serviceId: number) => services.find(s => s.id === serviceId)?.price || 0;
      const billingToday = appointmentsToday.reduce((sum, apt) => sum + getServicePrice(apt.serviceId), 0);

      return {
          count: appointmentsToday.length,
          billing: billingToday.toFixed(2),
      };
  }, [appointments, services]);

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r flex flex-col hidden lg:flex">
      <div className="h-20 flex items-center px-6 border-b">
        <Link to="/dashboard" className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple to-secondary p-2 rounded-lg text-white">
                <Sparkles />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900">Beauty Pro</h1>
                <p className="text-xs text-gray-500">Sistema de Agendamento</p>
            </div>
        </Link>
      </div>
      
      <nav className="flex-grow px-4 py-6">
        <h2 className="px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu Principal</h2>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                onClick={(e) => {
                    if (!enabledPages.includes(item.name)) {
                        e.preventDefault();
                        alert(`A página "${item.name}" ainda não foi implementada.`);
                    }
                }}
                end={item.href === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-gray-600 font-medium ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-gray-100'
                  } ${!enabledPages.includes(item.name) ? 'opacity-50 cursor-not-allowed' : ''}`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 px-2">
            <h2 className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status do Dia</h2>
            <div className="text-sm space-y-2 text-gray-600 font-medium">
                <div className="flex justify-between items-center">
                    <span>Agendamentos Hoje</span>
                    <span className="text-primary font-bold">{dailyStats.count}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span>Faturamento</span>
                    <span className="text-green-600 font-bold">R$ {dailyStats.billing}</span>
                </div>
            </div>
        </div>
      </nav>
      
      <div className="p-4 border-t">
        {profile ? (
            <div className="flex items-center gap-3 bg-light p-3 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p className="font-semibold text-sm text-gray-800">{profile.name}</p>
                    <p className="text-xs text-gray-500">Plano: PRO</p>
                </div>
            </div>
        ) : (
             <div className="h-[60px]"></div>
        )}
        <button 
            onClick={handleLogout} 
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors border">
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;