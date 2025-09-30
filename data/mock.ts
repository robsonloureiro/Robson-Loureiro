import { Service, Professional, Appointment, User } from '../types';
import {
    Scissors,
    Brush,
    Paintbrush,
    Eye,
    Hand,
    // FIX: Replaced non-existent 'Foot' icon with 'Footprints'.
    Footprints,
    Sparkles,
    Heart,
    Droplets,
    Leaf
} from 'lucide-react';
import { ComponentType } from 'react';

export const ICONS: { [key: string]: ComponentType<{ className?: string }> } = {
    Scissors,
    Brush,
    Paintbrush,
    Eye,
    Hand,
    Footprints,
    Sparkles,
    Heart,
    Droplets,
    Leaf,
};

export const MOCK_SERVICES: Service[] = [
  { id: 1, name: 'Corte de Cabelo', description: 'Estilo, lavagem e secagem.', duration: 60, price: 80, icon: 'Scissors' },
  { id: 2, name: 'Barba', description: 'Modelagem e aparo da barba.', duration: 30, price: 50, icon: 'Brush' },
  { id: 3, name: 'Manicure', description: 'Cuidado completo para unhas e mãos.', duration: 45, price: 40, icon: 'Hand' },
  { id: 4, name: 'Limpeza de Pele', description: 'Tratamento facial profundo.', duration: 90, price: 150, icon: 'Sparkles' },
  { id: 5, name: 'Massagem Relaxante', description: 'Massagem para alívio de estresse.', duration: 60, price: 120, icon: 'Heart' },
];

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 1,
    user_id: 'auth-user-1',
    name: 'Ana Silva',
    specialty: 'Cabeleireira',
    bio: 'Especialista em cortes modernos e coloração. Com 10 anos de experiência, Ana transforma seu visual com criatividade e técnica.',
    photoUrl: 'https://picsum.photos/id/1027/200/200',
    services: [1, 4],
    availability: { 
      // FIX: Changed availability keys to strings to match the corrected Availability type.
      '2': [{ start: 9, end: 12 }, { start: 13, end: 18 }], // Terça com pausa para almoço
      '3': [{ start: 9, end: 12 }, { start: 13, end: 18 }], // Quarta com pausa para almoço
      '4': [{ start: 9, end: 18 }], 
      '5': [{ start: 9, end: 20 }], 
      '6': [{ start: 10, end: 16 }] 
    },
    bookingSlotInterval: 60,
  },
  {
    id: 2,
    user_id: 'auth-user-2',
    name: 'Bruno Costa',
    specialty: 'Barbeiro',
    bio: 'Mestre da navalha e tesoura, Bruno oferece um serviço de barbearia clássico com um toque contemporâneo.',
    photoUrl: 'https://picsum.photos/id/64/200/200',
    services: [2],
    availability: { 
      // FIX: Changed availability keys to strings to match the corrected Availability type.
      '1': [{ start: 10, end: 19 }], 
      '2': [{ start: 10, end: 19 }], 
      '3': [{ start: 10, end: 19 }], 
      '4': [{ start: 10, end: 19 }], 
      '5': [{ start: 10, end: 19 }] 
    },
    bookingSlotInterval: 60,
  },
  {
    id: 3,
    user_id: 'auth-user-3',
    name: 'Carla Dias',
    specialty: 'Manicure & Esteticista',
    bio: 'Com precisão e arte, Carla cuida da saúde e beleza de suas unhas e pele, utilizando os melhores produtos do mercado.',
    photoUrl: 'https://picsum.photos/id/1011/200/200',
    services: [3, 4],
    availability: { 
      // FIX: Changed availability keys to strings to match the corrected Availability type.
      '2': [{ start: 8, end: 17 }], 
      '3': [{ start: 8, end: 17 }], 
      '4': [{ start: 8, end: 17 }], 
      '5': [{ start: 8, end: 17 }], 
      '6': [{ start: 9, end: 13 }] 
    },
    bookingSlotInterval: 60,
  },
  {
    id: 4,
    user_id: 'auth-user-4',
    name: 'Daniel Martins',
    specialty: 'Massoterapeuta',
    bio: 'Daniel é especialista em diversas técnicas de massagem, promovendo bem-estar, alívio de dores e relaxamento profundo.',
    photoUrl: 'https://picsum.photos/id/1005/200/200',
    services: [5],
    availability: { 
      // FIX: Changed availability keys to strings to match the corrected Availability type.
      '1': [{ start: 14, end: 21 }], 
      '2': [{ start: 14, end: 21 }], 
      '3': [{ start: 14, end: 21 }], 
      '4': [{ start: 14, end: 21 }] 
    },
    bookingSlotInterval: 60,
  }
];

// Add some initial appointments to simulate a busy schedule
const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

export const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: 1,
        professionalId: 1,
        serviceId: 1,
        clientName: 'Joana',
        clientWhatsapp: '+5511999991111',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0, 0),
    },
    {
        id: 2,
        professionalId: 1,
        serviceId: 1,
        clientName: 'Maria',
        clientWhatsapp: '+5521999992222',
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0, 0),
    },
    {
        id: 3,
        professionalId: 2,
        serviceId: 2,
        clientName: 'Pedro',
        clientWhatsapp: '+5531999993333',
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 30, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0, 0),
    }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Cliente Exemplo', email: 'cliente@email.com', role: 'client' },
  { id: 'p1', name: 'Ana Silva', email: 'ana@email.com', role: 'professional' },
];