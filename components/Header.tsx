import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';
import { LogOut, CalendarDays, ArrowRight } from 'lucide-react';

const Header: React.FC = () => {
  const { session } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm py-4 sticky top-0 z-30">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <div className="bg-light p-2 rounded-lg">
            <CalendarDays className="w-6 h-6 text-primary" />
          </div>
          <span className="text-dark">BeautyBook</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/professionals" className="text-gray-600 hover:text-primary">Profissionais</Link>
          <Link to="#" className="text-gray-600 hover:text-primary">Recursos</Link>
          <Link to="#" className="text-gray-600 hover:text-primary">Planos</Link>
          <Link to="#" className="text-gray-600 hover:text-primary">Contato</Link>
        </nav>
        <div>
          {session ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-primary">
                Meu Painel
              </Link>
              <button onClick={handleLogout} className="bg-primary text-white px-4 py-2 text-sm rounded-md hover:bg-primary-light flex items-center gap-2 transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
               <Link to="/auth" className="text-sm font-medium text-gray-600 hover:text-primary hidden sm:flex items-center gap-1">
                 <ArrowRight className="w-4 h-4" /> Entrar
               </Link>
               <Link to="/auth" className="bg-primary text-white px-5 py-2.5 text-sm font-semibold rounded-lg hover:bg-primary-light transition-colors shadow-md">
                 Começar Grátis
               </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;