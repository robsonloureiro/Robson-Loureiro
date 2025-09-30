
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
            <div className="flex flex-col items-center md:items-start">
                <p className="text-xl font-bold text-gray-800">BeautyBook</p>
                <p className="text-sm text-gray-500 mt-1">&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
                <Link to="#" className="hover:underline">Sobre</Link>
                <Link to="#" className="hover:underline">Termos de Uso</Link>
                <Link to="#" className="hover:underline">Política de Privacidade</Link>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;