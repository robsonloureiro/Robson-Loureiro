import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Professional } from '../types';

const ProfessionalCard: React.FC<{ professional: Professional }> = ({ professional }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
        <div className="md:flex">
            <div className="md:flex-shrink-0">
                <img className="h-48 w-full object-cover md:w-48" src={professional.photoUrl} alt={professional.name} />
            </div>
            <div className="p-8 flex flex-col justify-between">
                <div>
                    <div className="uppercase tracking-wide text-sm text-primary font-semibold">{professional.specialty}</div>
                    <h2 className="block mt-1 text-lg leading-tight font-bold text-dark">{professional.name}</h2>
                    <p className="mt-2 text-gray-500 line-clamp-3">{professional.bio}</p>
                </div>
                <Link 
                    to={`/profile/${professional.id}`} 
                    className="mt-4 inline-flex items-center gap-2 font-semibold text-secondary hover:text-pink-700"
                >
                    Ver Perfil e Agendar <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    </div>
);

const AllProfessionalsPage: React.FC = () => {
    const { allProfessionals, loading } = useAppContext();

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                 <Sparkles className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-dark leading-tight">
                    Encontre o <span className="text-primary">Profissional Ideal</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Navegue por nossa lista de especialistas talentosos e agende seu próximo atendimento com facilidade.
                </p>
            </div>

            {loading ? (
                <div className="space-y-8">
                    {[...Array(3)].map((_, i) => (
                       <div key={i} className="bg-white rounded-xl shadow-md h-48 animate-pulse flex items-center p-8">
                           <div className="h-32 w-32 rounded-lg bg-gray-300"></div>
                           <div className="flex-grow ml-8 space-y-4">
                               <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                               <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                               <div className="h-4 bg-gray-200 rounded w-full"></div>
                               <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                           </div>
                       </div>
                    ))}
                </div>
            ) : allProfessionals.length > 0 ? (
                <div className="space-y-8">
                    {allProfessionals.map(prof => (
                        <ProfessionalCard key={prof.id} professional={prof} />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-light p-10 rounded-xl">
                    <h2 className="text-xl font-semibold">Nenhum profissional encontrado.</h2>
                    <p className="text-gray-600 mt-2">Parece que ainda não há profissionais cadastrados. Volte em breve!</p>
                </div>
            )}
        </div>
    );
};

export default AllProfessionalsPage;
