
import React from 'react';
import { BarChart3, DollarSign, Users, Scissors } from 'lucide-react';

const StatPlaceholderCard: React.FC<{ title: string; icon: React.ElementType }> = ({ title, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col items-center justify-center text-center">
        <div className="bg-light p-4 rounded-full mb-4">
            <Icon className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-2">Em breve: Gráficos e dados detalhados para ajudar você a crescer.</p>
        <div className="w-full h-32 bg-gray-200 rounded-lg mt-4 animate-pulse"></div>
    </div>
);

const StatisticsPage: React.FC = () => {
    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Estatísticas e Relatórios</h1>
                <p className="text-gray-500 mt-1">Acompanhe a performance do seu negócio com dados inteligentes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatPlaceholderCard title="Faturamento Mensal" icon={DollarSign} />
                <StatPlaceholderCard title="Serviços Mais Populares" icon={Scissors} />
                <StatPlaceholderCard title="Novos Clientes" icon={Users} />
                <StatPlaceholderCard title="Horários de Pico" icon={BarChart3} />
            </div>
        </div>
    );
};

export default StatisticsPage;
