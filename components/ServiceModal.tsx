import React, { useState, useEffect } from 'react';
import { Service } from '../types';
import { X } from 'lucide-react';
import { ICONS } from '../data/mock';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Omit<Service, 'id'>) => void;
  service: Service | null;
}

const iconKeys = Object.keys(ICONS);

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, onSave, service }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(50);
  const [selectedIcon, setSelectedIcon] = useState('Scissors');

  useEffect(() => {
    if (service) {
      setName(service.name);
      setDescription(service.description);
      setDuration(service.duration);
      setPrice(service.price);
      setSelectedIcon(service.icon || 'Scissors');
    } else {
      // Reset form for new service
      setName('');
      setDescription('');
      setDuration(30);
      setPrice(50);
      setSelectedIcon('Scissors');
    }
  }, [service, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if(!name || duration <= 0 || price < 0) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }
    onSave({
      name,
      description,
      duration,
      price,
      icon: selectedIcon,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-dark">{service ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Fechar modal">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
          <div>
            <label htmlFor="service-name" className="block text-sm font-medium text-gray-700">Nome do Serviço</label>
            <input type="text" id="service-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white text-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="service-desc" className="block text-sm font-medium text-gray-700">Descrição</label>
            <textarea id="service-desc" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white text-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="service-duration" className="block text-sm font-medium text-gray-700">Duração (minutos)</label>
                <input type="number" id="service-duration" value={duration} onChange={e => setDuration(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white text-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div>
                <label htmlFor="service-price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                <input type="number" id="service-price" value={price} onChange={e => setPrice(Number(e.target.value))} className="mt-1 block w-full px-3 py-2 bg-white text-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
            <div className="bg-light p-3 rounded-lg overflow-x-auto">
                <div className="flex items-center gap-2">
                    {iconKeys.map(key => {
                        const Icon = ICONS[key];
                        const isSelected = selectedIcon === key;
                        return (
                            <button 
                                key={key} 
                                onClick={() => setSelectedIcon(key)} 
                                className={`p-3 rounded-full transition-colors flex-shrink-0 ${ isSelected ? 'bg-primary text-white' : 'bg-transparent text-gray-500 hover:ring-2 hover:ring-primary/30' }`}
                                aria-label={`Selecionar ícone ${key}`}
                                title={key}
                                aria-pressed={isSelected}
                            >
                                <Icon className="w-5 h-5"/>
                            </button>
                        )
                    })}
                </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4 border-t pt-6">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;