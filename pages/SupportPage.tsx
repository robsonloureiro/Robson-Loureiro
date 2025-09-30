
import React from 'react';
import { MessageSquare, LifeBuoy, BookOpen } from 'lucide-react';

const SupportPage: React.FC = () => {
    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Ajuda e Suporte</h1>
                <p className="text-gray-500 mt-1">Precisa de ajuda? Encontre respostas aqui ou entre em contato conosco.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Contact Form Placeholder */}
                <div className="bg-white p-8 rounded-xl shadow-sm border">
                    <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-primary" />
                        Envie uma Mensagem
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Nossa equipe de suporte responderá o mais breve possível.
                    </p>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Assunto</label>
                            <input type="text" id="subject" className="mt-1 block w-full px-3 py-2 bg-gray-100 text-dark border border-gray-300 rounded-md shadow-sm cursor-not-allowed" disabled placeholder="Ex: Dúvida sobre pagamentos" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Sua Mensagem</label>
                            <textarea id="message" rows={5} className="mt-1 block w-full px-3 py-2 bg-gray-100 text-dark border border-gray-300 rounded-md shadow-sm cursor-not-allowed" disabled placeholder="Descreva sua dúvida ou problema aqui..."></textarea>
                        </div>
                        <button type="button" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-primary/50 cursor-not-allowed" disabled>
                            Enviar (Em Breve)
                        </button>
                    </form>
                </div>

                {/* FAQ and Resources */}
                <div className="space-y-6">
                     <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h3 className="text-xl font-bold text-dark mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-secondary"/>
                            Perguntas Frequentes
                        </h3>
                        <ul className="space-y-2 text-sm text-primary underline">
                            <li><a href="#" className="hover:text-secondary">Como configuro meus horários?</a></li>
                            <li><a href="#" className="hover:text-secondary">Como integro com pagamentos online?</a></li>
                            <li><a href="#" className="hover:text-secondary">Posso exportar meus dados de clientes?</a></li>
                        </ul>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h3 className="text-xl font-bold text-dark mb-3 flex items-center gap-2">
                            <LifeBuoy className="w-5 h-5 text-secondary"/>
                            Contato Direto
                        </h3>
                        <p className="text-gray-700">
                           <strong>Email:</strong> suporte@beautybook.com
                        </p>
                         <p className="text-gray-700 mt-1">
                           <strong>WhatsApp:</strong> +55 (11) 98765-4321
                        </p>
                         <p className="text-sm text-gray-500 mt-2">
                           Horário de atendimento: Seg-Sex, 9h às 18h.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
