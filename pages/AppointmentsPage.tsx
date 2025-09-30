
import React from 'react';
import { useAppContext } from '../context/AppContext';
import DashboardCalendar from '../components/DashboardCalendar';
import { Loader2 } from 'lucide-react';

const AppointmentsPage: React.FC = () => {
    const { appointments, loading } = useAppContext();

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Meus Agendamentos</h1>
                <p className="text-gray-500 mt-1">Visualize e gerencie todos os seus agendamentos em um calendário completo.</p>
            </div>
            
            {loading ? (
                 <div className="flex justify-center items-center h-96">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                 </div>
            ) : (
                <DashboardCalendar appointments={appointments} />
            )}
        </div>
    );
};

export default AppointmentsPage;
