
import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Loader2, Users } from 'lucide-react';

const ClientsPage: React.FC = () => {
    const { appointments, loading } = useAppContext();

    const clients = useMemo(() => {
        const clientMap = new Map<string, { name: string; appointments: number; lastSeen: Date }>();
        
        appointments.forEach(apt => {
            const client = clientMap.get(apt.clientWhatsapp);
            if (client) {
                client.appointments += 1;
                if (apt.startTime > client.lastSeen) {
                    client.lastSeen = apt.startTime;
                }
            } else {
                clientMap.set(apt.clientWhatsapp, {
                    name: apt.clientName,
                    appointments: 1,
                    lastSeen: apt.startTime,
                });
            }
        });

        return Array.from(clientMap.entries()).map(([whatsapp, data]) => ({ ...data, whatsapp }))
            .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());

    }, [appointments]);

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Meus Clientes</h1>
                <p className="text-gray-500 mt-1">Veja o histórico e informações de todos os seus clientes.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="overflow-x-auto">
                    {clients.length > 0 ? (
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Nome</th>
                                    <th scope="col" className="px-6 py-3">WhatsApp</th>
                                    <th scope="col" className="px-6 py-3 text-center">Nº de Agendamentos</th>
                                    <th scope="col" className="px-6 py-3">Última Visita</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map(client => (
                                    <tr key={client.whatsapp} className="bg-white border-b hover:bg-gray-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {client.name}
                                        </th>
                                        <td className="px-6 py-4">{client.whatsapp}</td>
                                        <td className="px-6 py-4 text-center">{client.appointments}</td>
                                        <td className="px-6 py-4">{client.lastSeen.toLocaleDateString('pt-BR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <div className="text-center py-10">
                            <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700">Nenhum cliente encontrado</h3>
                            <p className="text-gray-500">Seus clientes aparecerão aqui assim que fizerem o primeiro agendamento.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientsPage;
