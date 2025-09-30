import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Appointment, Professional, Service, AppointmentRow, ProfessionalUpdate, ProfessionalInsert } from '../types';
import { supabase } from '../lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { loginUser, logoutUser } from '../lib/oneSignal';

interface AppContextType {
  session: Session | null;
  profile: Professional | null;
  setProfile: React.Dispatch<React.SetStateAction<Professional | null>>;
  appointments: Appointment[];
  addAppointment: (newAppointment: Omit<Appointment, 'id' | 'created_at'>) => Promise<void>;
  services: Service[];
  addService: (newService: Omit<Service, 'id' | 'created_at'>) => Promise<void>;
  updateService: (updatedService: Service) => Promise<void>;
  deleteService: (serviceId: number) => Promise<void>;
  updateProfile: (updatedProfile: ProfessionalUpdate) => Promise<void>;
  createProfile: (newProfileData: ProfessionalInsert) => Promise<void>;
  loading: boolean;
  allProfessionals: Professional[]; // Para a página pública de perfis
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper para converter linha do DB em objeto do App
const parseAppointmentRow = (row: AppointmentRow): Appointment => ({
    ...row,
    startTime: new Date(row.startTime),
    endTime: new Date(row.endTime),
});

// Define column strings here for reuse and to avoid implicit '*' selects
const professionalColumns = 'id, created_at, user_id, name, specialty, bio, photoUrl, services, availability, bookingSlotInterval';
const serviceColumns = 'id, created_at, name, description, duration, price, icon';
const appointmentColumns = 'id, created_at, professionalId, serviceId, clientName, clientWhatsapp, startTime, endTime';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Se o cliente supabase não foi inicializado, mostra uma tela de configuração.
  if (!supabase) {
    return (
      <div className="flex items-center justify-center h-screen bg-light p-4 font-sans">
        <div className="text-center bg-white p-10 rounded-xl shadow-2xl max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Configuração do Banco de Dados Necessária</h1>
          <p className="text-gray-700 mb-2 text-lg">
            Parece que a conexão com o banco de dados ainda não foi configurada.
          </p>
          <p className="text-gray-600 mb-6">
            Para que o aplicativo funcione, por favor, edite o arquivo <code className="bg-gray-200 text-red-600 font-mono p-1 rounded-md">lib/supabaseClient.ts</code> e insira a <strong>URL</strong> e a chave <strong>pública (anon key)</strong> do seu projeto Supabase.
          </p>
          <a 
            href="https://supabase.com/dashboard" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors text-lg"
          >
            Acessar Painel do Supabase
          </a>
        </div>
      </div>
    );
  }

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Professional | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  // Lida com o estado de autenticação e notificações
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loginUser(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loginUser(session.user.id);
      } else {
        logoutUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Busca os dados do usuário logado e os dados públicos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Busca todos os dados públicos (profissionais e serviços) primeiro.
        const [profResponse, servicesResponse] = await Promise.all([
          supabase.from('professionals').select(professionalColumns),
          supabase.from('services').select(serviceColumns)
        ]);

        if (profResponse.error) throw profResponse.error;
        if (servicesResponse.error) throw servicesResponse.error;

        setAllProfessionals(profResponse.data || []);
        setServices(servicesResponse.data || []);


        // Se houver uma sessão, busca os dados específicos do profissional logado
        if (session) {
          const { user } = session;
          const { data: profileData, error: profileError } = await supabase
            .from('professionals')
            .select(professionalColumns)
            .eq('user_id', user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') { // PGRST116: no rows found
             throw profileError;
          }
          
          if (profileData) {
            setProfile(profileData);
            
            // Busca agendamentos DO PROFISSIONAL LOGADO
            const { data: appointmentsData, error: appointmentsError } = await supabase
                .from('appointments')
                .select(appointmentColumns)
                .eq('professionalId', profileData.id);

            if (appointmentsError) throw appointmentsError;
            
            setAppointments((appointmentsData as AppointmentRow[] || []).map(parseAppointmentRow));
          } else {
             // Usuário logado mas sem perfil. Limpa os dados.
             setProfile(null);
             setAppointments([]);
          }
        } else {
          // Nenhum usuário logado, limpa os dados específicos do usuário
          setProfile(null);
          setAppointments([]);
        }

      } catch (error: any) {
        let detail = 'Ocorreu um erro desconhecido.';
        if (error) {
            // Constrói uma mensagem de erro mais detalhada a partir do objeto de erro do Supabase
            const message = error.message || 'Sem mensagem de erro.';
            const details = error.details || 'Sem detalhes adicionais.';
            const hint = error.hint || 'Nenhuma dica disponível.';
            
            detail = `Mensagem: ${message}\nDetalhes: ${details}\nDica: ${hint}`;

            // Adiciona uma dica comum sobre RLS se for um erro de permissão
            if (error.code === '42501' || error.message.includes('permission denied')) { // permission denied
                detail += `\n\nIsso geralmente significa que a Segurança em Nível de Linha (RLS) está ativa, mas não há uma política que permita esta ação. Verifique as políticas de RLS para as tabelas 'professionals' e 'services' no seu painel do Supabase.`;
            }
        }
        console.error("Error fetching data from Supabase:", error);
        alert(`Não foi possível carregar os dados. Verifique sua conexão e as configurações do Supabase.\n\nDetalhes do Erro:\n${detail}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);


  const addAppointment = useCallback(async (newAppointment: Omit<Appointment, 'id' | 'created_at'>) => {
    const appointmentRow = {
        ...newAppointment,
        startTime: newAppointment.startTime.toISOString(),
        endTime: newAppointment.endTime.toISOString(),
    };

    const { data, error } = await supabase
        .from('appointments')
        .insert(appointmentRow)
        .select(appointmentColumns)
        .single();
    
    if (error) {
        console.error("Error adding appointment:", error);
        throw error;
    }
    // O estado de agendamentos é do profissional logado,
    // então se um cliente agenda, é correto não atualizar aqui.
    // O profissional verá na próxima vez que os dados forem carregados.
  }, []);

    const createProfile = useCallback(async (newProfileData: ProfessionalInsert) => {
        const { data, error } = await supabase
            .from('professionals')
            .insert(newProfileData)
            .select(professionalColumns)
            .single();
        
        if (error) {
            console.error("Error creating profile:", error);
            throw error;
        }
        if (data) {
            setProfile(data);
            setAllProfessionals(prev => [...prev, data]);
        }
    }, []);

  const updateProfile = useCallback(async (updatedProfileData: ProfessionalUpdate) => {
    if (!profile) return;
    const { id } = profile;
    const { data, error } = await supabase
        .from('professionals')
        .update(updatedProfileData)
        .eq('id', id)
        .select(professionalColumns)
        .single();

    if (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
    if(data) {
       setProfile(data);
       setAllProfessionals(prev => prev.map(p => p.id === id ? data : p));
    }
  }, [profile]);

  const addService = useCallback(async (newServiceData: Omit<Service, 'id' | 'created_at'>) => {
    if (!profile) return;

    // 1. Insert the new service
    const { data: newService, error: serviceError } = await supabase
        .from('services')
        .insert(newServiceData)
        .select(serviceColumns)
        .single();
    
    if (serviceError) {
        console.error("Error adding service:", serviceError);
        throw serviceError;
    }
    if (!newService) return;

    // 2. Update the professional's services array
    const updatedServicesIds = [...profile.services, newService.id];
    const { data: updatedProfessional, error: profError } = await supabase
        .from('professionals')
        .update({ services: updatedServicesIds })
        .eq('id', profile.id)
        .select(professionalColumns)
        .single();
    
    if (profError) {
        console.error("Error updating professional's services:", profError);
        throw profError;
    }

    // 3. Update local state
    setServices(prev => [...prev, newService]);
    if(updatedProfessional) {
        setProfile(updatedProfessional);
    }
  }, [profile]);

  const updateService = useCallback(async (updatedService: Service) => {
    const { id, created_at, ...updateData } = updatedService;
    const { data, error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', id)
        .select(serviceColumns)
        .single();

    if (error) {
        console.error("Error updating service:", error);
        throw error;
    }
    if (data) {
        setServices(prev => prev.map(s => s.id === id ? data : s));
    }
  }, []);

  const deleteService = useCallback(async (serviceId: number) => {
      if (!profile) return;

      // 1. Remove service from the professional's services array and refetch profile
      const updatedServicesIds = profile.services.filter(id => id !== serviceId);
      const { data: updatedProfessional, error: profError } = await supabase
            .from('professionals')
            .update({ services: updatedServicesIds })
            .eq('id', profile.id)
            .select(professionalColumns)
            .single();

      if (profError) {
          console.error("Error updating professional on service delete:", profError);
          throw profError;
      }
      
      // 2. Delete the service itself (RLS should prevent deleting others' services)
      const { error } = await supabase.from('services').delete().eq('id', serviceId);

      if (error) {
          console.error("Error deleting service:", error);
          throw error;
      }

      // 3. Update local state with fetched data
      setServices(prev => prev.filter(s => s.id !== serviceId));
      if (updatedProfessional) {
          setProfile(updatedProfessional);
      }
  }, [profile]);


  return (
    <AppContext.Provider value={{ 
        session,
        profile,
        setProfile,
        appointments, addAppointment, 
        services, addService, updateService, deleteService,
        updateProfile,
        createProfile,
        loading,
        allProfessionals,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};