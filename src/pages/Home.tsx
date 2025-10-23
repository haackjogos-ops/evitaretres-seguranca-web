import { Shield, Users, BookOpen, Activity, ClipboardCheck, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import heroImage from "@/assets/hero-safety.jpg";
import evitareLogo from "@/assets/evitare-logo.png";

const Home = () => {
  const services = [
    {
      title: "Sobre",
      description: "Conheça nossa missão, visão e valores.",
      icon: Shield,
      action: { label: "Saiba mais", path: "/sobre" },
    },
    {
      title: "Vantagens",
      description: "Benefícios da assessoria anual e suporte completo.",
      icon: ClipboardCheck,
      action: { label: "Ver vantagens", path: "/vantagens" },
    },
    {
      title: "Treinamentos",
      description: "Capacitação em normas regulamentadoras e segurança.",
      icon: Users,
      action: { label: "Ver treinamentos", path: "/treinamentos" },
    },
    {
      title: "Cursos",
      description: "Cursos especializados com certificação reconhecida.",
      icon: BookOpen,
      action: { label: "Ver cursos", path: "/cursos" },
    },
    {
      title: "Monitoramento",
      description: "Inspeções e checklists periódicos de segurança.",
      icon: Activity,
      action: { label: "Conheça", path: "/monitoramento" },
    },
    {
      title: "Medicina",
      description: "Exames e documentos ocupacionais completos.",
      icon: Shield,
      action: { label: "Veja serviços", path: "/medicina" },
    },
    {
      title: "Contato",
      description: "Entre em contato conosco para mais informações.",
      icon: Phone,
      action: { label: "Fale conosco", path: "/contato" },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <img src={evitareLogo} alt="EVITARE" className="h-24 md:h-32 mx-auto mb-6" />
          <p className="text-xl md:text-3xl mb-4 font-semibold">
            Você já imaginou ter todas as novidades da empresa
          </p>
          <p className="text-2xl md:text-4xl mb-8 font-bold">
            na palma da sua mão?
          </p>
          <Link to="/contato">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Fale Conosco
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          O que fazemos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="font-semibold mb-2">EVITARE – Assessoria em Segurança e Medicina do Trabalho</p>
          <p className="text-sm">Rua Coronel Marcos Rovaris, 328 – Sala 2 – Centro – Turvo</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
