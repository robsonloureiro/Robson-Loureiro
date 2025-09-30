import React, { useState, useEffect } from 'react';
import { Professional } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useAppContext } from '../context/AppContext';
import { X, UploadCloud, Loader2 } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional | null;
}

// Valores iniciais para um novo perfil
const initialProfileData = {
    name: '',
    specialty: '',
    bio: 'Especialista apaixonado(a) por realçar a beleza e bem-estar. Pronto(a) para oferecer a melhor experiência.',
    photoUrl: 'https://i.pravatar.cc/300', // Placeholder
    services: [],
    availability: { 
      '2': [{ start: 9, end: 18 }], 
      '3': [{ start: 9, end: 18 }], 
      '4': [{ start: 9, end: 18 }], 
      '5': [{ start: 9, end: 18 }], 
      '6': [{ start: 10, end: 16 }] 
    },
    bookingSlotInterval: 30,
};


const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, professional }) => {
  const { session, createProfile, updateProfile } = useAppContext();
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
        if (professional) { // Editando perfil existente
            setName(professional.name);
            setSpecialty(professional.specialty);
            setBio(professional.bio);
            setPhotoUrl(professional.photoUrl);
        } else { // Criando novo perfil
            setName('');
            setSpecialty('');
            setBio(initialProfileData.bio);
            setPhotoUrl(initialProfileData.photoUrl);
        }
        setPhotoFile(null); // Resetar arquivo ao abrir
    }
  }, [professional, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if(!name.trim() || !specialty.trim()) {
        alert("Nome e Especialidade são obrigatórios.");
        return;
    }
    if (!session) {
        alert("Erro: Sessão do usuário não encontrada. Por favor, faça login novamente.");
        return;
    }
    setIsSaving(true);

    try {
        let finalPhotoUrl = professional ? professional.photoUrl : photoUrl;

        // Se um novo arquivo de foto foi selecionado, faça o upload
        if (photoFile) {
            const fileExt = photoFile.name.split('.').pop();
            const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('profile-photos')
                .upload(filePath, photoFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from('profile-photos').getPublicUrl(filePath);
            finalPhotoUrl = urlData.publicUrl;
        }

        if (professional) { // ATUALIZAR perfil existente
            await updateProfile({ name, specialty, bio, photoUrl: finalPhotoUrl });
        } else { // CRIAR novo perfil
            const newProfileData = {
                ...initialProfileData,
                user_id: session.user.id,
                name,
                specialty,
                bio,
                photoUrl: finalPhotoUrl,
            };
            await createProfile(newProfileData);
        }
        onClose();
    } catch (error: any) {
        console.error("Erro ao salvar perfil:", error);
        const detail = error?.message ? error.message : JSON.stringify(error);
        let errorMessage = `Ocorreu um erro ao salvar o perfil. Detalhes: ${detail}`;
        
        if (error?.message && (error.message.includes('Bucket not found') || error.message.includes('bucket not found'))) {
             errorMessage += "\n\nIMPORTANTE: Parece que o 'bucket' de armazenamento de fotos não foi criado. Por favor, acesse seu painel do Supabase, vá para 'Storage' e crie um novo bucket público chamado 'profile-photos'.";
        }
        alert(errorMessage);
    } finally {
        setIsSaving(false);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("O arquivo é muito grande. O limite é de 2MB.");
        return;
      }
      setPhotoFile(file); // Salva o objeto File
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoUrl(e.target?.result as string); // Atualiza a preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-dark">{professional ? 'Editar Perfil' : 'Crie Seu Perfil'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200" aria-label="Fechar modal">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input type="text" id="profile-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white text-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="profile-specialty" className="block text-sm font-medium text-gray-700">Especialidade (Ex: Cabeleireiro, Barbeiro)</label>
            <input type="text" id="profile-specialty" value={specialty} onChange={e => setSpecialty(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white text-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label htmlFor="profile-bio" className="block text-sm font-medium text-gray-700">Bio / Descrição Curta</label>
            <textarea id="profile-bio" value={bio} onChange={e => setBio(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white text-dark border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Foto de Perfil</label>
            <div className="mt-2 flex items-center gap-4">
                {photoUrl && <img src={photoUrl} alt="Preview" className="rounded-full w-24 h-24 object-cover"/>}
                <div className="flex-grow">
                    <label htmlFor="profile-photo-upload" className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
                        <UploadCloud className="w-5 h-5"/>
                        <span>Anexar Foto</span>
                    </label>
                    <input id="profile-photo-upload" name="profile-photo-upload" type="file" className="sr-only" onChange={handlePhotoChange} accept="image/png, image/jpeg, image/webp" />
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP até 2MB.</p>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4 border-t pt-6">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold">Cancelar</button>
          <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-pink-600 font-semibold flex items-center justify-center w-32 disabled:bg-pink-300">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;