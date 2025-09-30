import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Service } from '../types';
import ServiceModal from '../components/ServiceModal';
import { PlusCircle, Edit, Trash2, Clock, DollarSign, Sparkles, Loader2 } from 'lucide-react';
import { ICONS } from '../data/mock';

const ServiceCard: React.FC<{ service: Service; onEdit: () => void; onDelete: () => void }> = ({ service, onEdit, onDelete }) => {
    const IconComponent = ICONS[service.icon] || Sparkles;
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border flex flex-col justify-between">
            <div>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 text-primary p-3 rounded-lg">
                            <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-start gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {service.duration} min</span>
                    <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> R$ {service.price.toFixed(2)}</span>
                </div>
            </div>
            <div className="mt-4 flex justify-end gap-2 border-t pt-4">
                <button onClick={onEdit} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-primary py-2 px-3 rounded-md hover:bg-gray-100 transition-colors">
                    <Edit className="w-4 h-4" />
                    Editar
                </button>
                <button onClick={onDelete} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-secondary py-2 px-3 rounded-md hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Excluir
                </button>
            </div>
        </div>
    );
};

const EmptyState: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
    <div className="text-center bg-white p-10 rounded-xl shadow-sm border-2 border-dashed">
        <h2 className="text-2xl font-bold text-dark mb-2">Nenhum serviço cadastrado</h2>
        <p className="text-gray-600 mb-6">Comece adicionando os serviços que você oferece.</p>
        <button
            onClick={onAdd}
            className="bg-secondary text-white font-bold py-2 px-6 rounded-full hover:bg-pink-600 transition-transform transform hover:scale-105 inline-flex items-center gap-2"
        >
            <PlusCircle className="w-5 h-5" />
            Adicionar Primeiro Serviço
        </button>
    </div>
);


const ServicesPage: React.FC = () => {
    const { profile, services, addService, updateService, deleteService, loading } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState<Service | null>(null);

    const professionalServices = useMemo(() => {
        if (!profile) return [];
        return services.filter(s => profile.services.includes(s.id));
    }, [profile, services]);
    
    const handleOpenModal = (service: Service | null) => {
        setCurrentService(service);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentService(null);
    };

    const handleSaveService = async (serviceData: Omit<Service, 'id' | 'created_at'>) => {
        try {
            if (currentService) {
                // Editing existing service
                await updateService({ ...currentService, ...serviceData });
            } else {
                // Adding new service
                await addService(serviceData);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save service:", error);
            alert("Ocorreu um erro ao salvar o serviço. Tente novamente.");
        }
    };

    const handleDeleteService = async (serviceId: number) => {
        if (window.confirm('Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.')) {
            try {
                await deleteService(serviceId);
            } catch (error) {
                console.error("Failed to delete service:", error);
                alert("Ocorreu um erro ao excluir o serviço. Tente novamente.");
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gerenciar Serviços</h1>
                    <p className="text-gray-500 mt-1">Adicione, edite ou remova os serviços oferecidos no seu perfil.</p>
                </div>
                <button
                    onClick={() => handleOpenModal(null)}
                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <PlusCircle className="w-5 h-5" />
                    Novo Serviço
                </button>
            </div>
            
            {professionalServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {professionalServices.map(service => (
                        <ServiceCard 
                            key={service.id}
                            service={service}
                            onEdit={() => handleOpenModal(service)}
                            onDelete={() => handleDeleteService(service.id)}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState onAdd={() => handleOpenModal(null)} />
            )}

            <ServiceModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveService}
                service={currentService}
            />
        </div>
    );
};

export default ServicesPage;
