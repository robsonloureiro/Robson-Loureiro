

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Calendar, Users2, CreditCard, BarChart2, Clock, Smartphone, 
    Star, Check, ChevronDown, TrendingUp, CalendarPlus, User, Quote
} from 'lucide-react';

type StatCardProps = { value: string; label: string, className?: string };
const StatCard = ({ value, label, className }: StatCardProps) => (
    <div className={`text-center ${className}`}>
        <p className="text-4xl lg:text-5xl font-bold text-primary">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
);

type FeatureCardProps = { icon: React.ElementType, title: string, children: React.ReactNode };
// FIX: Explicitly type component with React.FC to fix 'key' prop type error.
const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, children }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="mb-4 inline-block bg-light p-3 rounded-xl">
            <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-dark mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{children}</p>
    </div>
);

type TestimonialCardProps = { quote: string, name: string, role: string, company: string, metric: string, metricLabel: string, avatar: string };
// FIX: Explicitly type component with React.FC to fix 'key' prop type error.
const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role, company, metric, metricLabel, avatar }) => (
    <div className="bg-light p-8 rounded-2xl h-full flex flex-col justify-between">
        <div>
            <Quote className="w-8 h-8 text-primary-light mb-4" />
            <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
            </div>
            <p className="text-gray-700 italic">"{quote}"</p>
        </div>
        <div className="mt-6">
            <div className="bg-white p-4 rounded-lg text-center mb-6 shadow-inner">
                <p className="text-3xl font-bold text-primary">{metric}</p>
                <p className="text-sm text-gray-600">{metricLabel}</p>
            </div>
            <div className="flex items-center">
                <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white" />
                <div>
                    <p className="font-semibold text-dark">{name}</p>
                    <p className="text-sm text-gray-500">{role} @ <span className="font-medium">{company}</span></p>
                </div>
            </div>
        </div>
    </div>
);

type PricingCardProps = { plan: string, price: string, description: string, features: string[], limitations?: string[], popular?: boolean, cta: string, ctaSubtitle?: string };
const PricingCard = ({ plan, price, description, features, limitations, popular, cta, ctaSubtitle }: PricingCardProps) => (
    <div className={`relative p-8 rounded-2xl w-full max-w-md ${popular ? 'border-2 border-primary bg-white' : 'bg-light border-2 border-transparent'}`}>
        {popular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2"><span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">MAIS POPULAR</span></div>}
        <h3 className="text-2xl font-bold text-dark text-center">{plan}</h3>
        <p className="text-5xl font-bold text-dark text-center my-4">{price}<span className="text-lg font-normal text-gray-500">/mês</span></p>
        <p className="text-gray-600 text-center text-sm mb-8 h-10">{description}</p>
        <div className="space-y-3 mb-8">
            <p className="text-sm font-semibold text-gray-500 uppercase">INCLUÍDO NO PLANO</p>
            {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                </div>
            ))}
        </div>
        {limitations && limitations.length > 0 && (
             <div className="space-y-3 mb-8">
                <p className="text-sm font-semibold text-gray-500 uppercase">LIMITAÇÕES</p>
                {limitations.map((limitation, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                            <div className="w-3 h-3 border-2 border-gray-300 rounded-full"></div>
                        </div>
                        <span className="text-gray-500 text-sm">{limitation}</span>
                    </div>
                ))}
            </div>
        )}
        <Link to="/auth" className={`w-full text-center block font-semibold py-3 px-6 rounded-lg transition-colors ${popular ? 'bg-primary text-white hover:bg-violet-700' : 'bg-white text-primary hover:bg-gray-50 shadow-sm'}`}>
            {cta}
        </Link>
        {ctaSubtitle && <p className="text-center text-xs text-gray-500 mt-2">{ctaSubtitle}</p>}
    </div>
);

type FaqItemProps = { q: string, a: string };
// FIX: Explicitly type component with React.FC to fix 'key' prop type error.
const FaqItem: React.FC<FaqItemProps> = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left gap-4">
                <h4 className="font-semibold text-dark text-md">{q}</h4>
                <ChevronDown className={`w-5 h-5 text-primary transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <p className="mt-3 text-gray-600 text-sm animate-fade-in">{a}</p>}
        </div>
    )
}

const HomePage: React.FC = () => {
    const features = [
        { icon: Calendar, title: "Agendamento Inteligente", description: "Sistema automatizado que gerencia sua agenda 24/7. Seus clientes podem agendar a qualquer hora, com confirmação automática e lembretes." },
        { icon: Users2, title: "Gestão Completa de Clientes", description: "Histórico completo, preferências, contatos e observações especiais. Ofereça um atendimento personalizado e mantenha relacionamentos duradouros." },
        { icon: CreditCard, title: "Pagamentos Integrados", description: "Receba pagamentos online, gerencie mensalidades e tenha controle total da sua receita. Integração com PIX, cartões e outras formas de pagamento." },
        { icon: BarChart2, title: "Relatórios e Analytics", description: "Acompanhe sua performance, clientes mais frequentes, serviços populares e receita. Tome decisões baseadas em dados reais." },
        { icon: Clock, title: "Otimização de Horários", description: "IA que sugere os melhores horários baseado no histórico e preferências dos clientes. Maximize sua produtividade e reduza cancelamentos." },
        { icon: Smartphone, title: "App Mobile Nativo", description: "Aplicativo completo para você e seus clientes. Gerencie tudo na palma da mão, receba notificações e mantenha-se sempre conectado." },
    ];

    const testimonials = [
        { name: "Carla Santos", role: "Cabeleireira", company: "Salão Bella Vista", quote: "Desde que comecei a usar o BeautyBook, meus agendamentos aumentaram 40% e não tenho mais confusão com horários. Os clientes adoram poder agendar pelo celular!", metric: "+40%", metricLabel: "agendamentos", avatar: "https://i.pravatar.cc/150?img=1" },
        { name: "Marina Costa", role: "Nail Designer", company: "Studio M Nails", quote: "O sistema de lembretes automáticos reduziu drasticamente as faltas. Agora consigo planejar melhor meu dia e ter uma receita mais previsível.", metric: "-70%", metricLabel: "faltas", avatar: "https://i.pravatar.cc/150?img=25" },
        { name: "Roberto Silva", role: "Barbeiro", company: "Barbearia Clássica", quote: "Interface super simples de usar. Meus clientes mais velhos conseguem agendar sem dificuldade, e eu tenho controle total da minha agenda em tempo real.", metric: "+60%", metricLabel: "satisfação", avatar: "https://i.pravatar.cc/150?img=32" },
    ];

    const faqs = [
        { q: "Posso cancelar a qualquer momento?", a: "Sim! Não há fidelidade. Você pode cancelar sua assinatura a qualquer momento e manter acesso até o fim do período pago." },
        { q: "Como funciona o período gratuito?", a: "O plano gratuito é permanente e inclui recursos básicos. O Premium oferece 30 dias grátis para você testar todos os recursos." },
        { q: "Meus dados ficam seguros?", a: "Absolutamente. Usamos criptografia de ponta a ponta e seguimos todas as normas da LGPD. Seus dados nunca são compartilhados." },
    ];

  return (
    <div className="bg-white font-sans overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32">
        <div className="container mx-auto px-4 z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in-up">
                <div className="inline-block bg-white border text-gray-600 text-xs px-3 py-1 rounded-full mb-4 shadow-sm">
                    <Star className="w-3 h-3 inline-block mr-1.5 text-yellow-400 fill-current" />
                    Mais de 1000 profissionais confiam em nós
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-dark leading-tight">
                    Transforme seu<br /> <span className="text-primary">negócio de beleza</span>
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                    Sistema completo de agendamento para barbeiros, manicures, designers de sobrancelhas e salões. Gerencie clientes, horários e pagamentos em uma plataforma única.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    <Link to="/auth" className="w-full sm:w-auto bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-violet-700 transition-colors shadow-lg flex items-center justify-center gap-2">
                        <CalendarPlus className="w-5 h-5"/> Começar Gratuitamente
                    </Link>
                    <Link to="#" className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                        <User className="w-5 h-5" /> Ver Demonstração
                    </Link>
                </div>
                 <div className="mt-16 flex justify-center lg:justify-start gap-8 sm:gap-12">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-dark">1000+</p>
                        <p className="text-sm text-gray-500">Profissionais</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-dark">50k+</p>
                        <p className="text-sm text-gray-500">Agendamentos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-dark">98%</p>
                        <p className="text-sm text-gray-500">Satisfação</p>
                    </div>
                </div>
            </div>
            <div className="relative h-[450px] hidden lg:block animate-fade-in">
                <img src="https://i.imgur.com/PIVxvS8.jpeg" alt="Profissional de beleza atendendo cliente" className="object-cover w-full h-full rounded-2xl shadow-2xl" />
                {/* Floating UI cards */}
                <div className="absolute bottom-10 -left-12 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl w-72 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex justify-between items-center mb-3">
                       <h4 className="font-bold text-sm text-dark">Próximos Agendamentos</h4>
                       <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-semibold">Hoje</span>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <div><p className="font-semibold text-gray-800">Maria Silva</p><p className="text-xs text-gray-500">Corte e Escova</p></div>
                            <span className="font-semibold text-xs bg-primary text-white px-3 py-1 rounded-md">Confirmado</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div><p className="font-semibold text-gray-800">Ana Costa</p><p className="text-xs text-gray-500">Manicure</p></div>
                            <span className="font-semibold text-xs bg-yellow-400 text-yellow-900 px-3 py-1 rounded-md">Pendente</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div><p className="font-semibold text-gray-800">João Santos</p><p className="text-xs text-gray-500">Barba</p></div>
                             <span className="font-semibold text-xs bg-primary text-white px-3 py-1 rounded-md">Confirmado</span>
                        </div>
                    </div>
                </div>
                 <div className="absolute top-8 -right-8 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl w-56 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <h4 className="font-bold text-sm text-dark mb-2">Receita do mês</h4>
                    <p className="text-3xl font-bold text-dark">R$ 2.850</p>
                    <p className="text-xs text-green-600 font-semibold flex items-center gap-1 mt-1"><TrendingUp className="w-4 h-4" /> +15% vs mês anterior</p>
                 </div>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-light">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-dark">Tudo que você precisa para <span className="text-primary">gerenciar seu negócio</span></h2>
                <p className="mt-4 text-gray-600">Recursos pensados especificamente para profissionais da área de beleza. Do agendamento ao pagamento, tudo integrado e funcionando perfeitamente.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                    <FeatureCard key={i} icon={feature.icon} title={feature.title}>
                        {feature.description}
                    </FeatureCard>
                ))}
            </div>
          </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <div className="inline-block bg-light text-gray-600 text-sm px-3 py-1 rounded-full mb-4">
                    <Star className="w-4 h-4 inline-block mr-1.5 text-yellow-400 fill-current" />
                    Avaliação 4.9/5.0
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-dark">Profissionais que transformaram <br /><span className="text-primary">seus negócios conosco</span></h2>
                <p className="mt-4 text-gray-600">Mais de 1.000 profissionais confiam no BeautyBook para gerenciar seus agendamentos. Veja como eles revolucionaram seus negócios.</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                {testimonials.map((t, i) => (
                    <TestimonialCard key={i} {...t} />
                ))}
            </div>
        </div>
      </section>

       {/* Social Proof Section 2 */}
      <section className="bg-white">
         <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatCard value="1000+" label="Profissionais Ativos" />
                <StatCard value="50k+" label="Agendamentos/Mês" />
                <StatCard value="4.9/5" label="Avaliação Média" />
                <StatCard value="24/7" label="Suporte Disponível" />
            </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 lg:py-28 bg-light">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-dark">Escolha o plano ideal <br/><span className="text-primary">para seu negócio</span></h2>
                <p className="mt-4 text-gray-600">Comece gratuitamente e evolua conforme seu negócio cresce. Sem contratos longos, sem pegadinhas. Cancele quando quiser.</p>
            </div>
            <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-8">
                <PricingCard
                    plan="Gratuito"
                    price="R$ 0"
                    description="Perfeito para começar"
                    features={[
                        "Até 50 agendamentos por mês",
                        "1 profissional",
                        "Página de agendamento básica",
                        "Notificações por email",
                        "Suporte por email",
                    ]}
                    limitations={[
                        "Marca d'água BeautyBook",
                        "Recursos básicos apenas",
                        "Sem relatórios avançados",
                    ]}
                    cta="Começar Grátis"
                />
                <PricingCard
                    plan="Premium"
                    price="R$ 47"
                    description="Para profissionais sérios"
                    features={[
                        "Agendamentos ilimitados",
                        "Até 3 profissionais",
                        "Página personalizada",
                        "Notificações SMS + Email",
                        "Pagamentos integrados",
                        "Relatórios avançados",
                        "App mobile dedicado",
                        "Suporte prioritário",
                        "Sem marca d'água",
                        "Integração WhatsApp",
                        "Backup automático",
                        "Cancelamento sem multa",
                    ]}
                    popular={true}
                    cta="Teste 30 Dias Grátis"
                    ctaSubtitle="30 dias grátis • Cancele a qualquer momento • Sem taxa de setup"
                />
            </div>
        </div>
      </section>
      
       {/* FAQ Section */}
      <section className="py-20 lg:py-28 bg-white">
         <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-extrabold text-dark text-center mb-8">Perguntas Frequentes</h2>
            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <FaqItem key={i} q={faq.q} a={faq.a} />
                ))}
            </div>
         </div>
      </section>
    </div>
  );
};

export default HomePage;