import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import Testimonials from "@/components/Testimonials";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useServices } from "@/hooks/useServices";
import heroImage from "@/assets/hero-safety.jpg";
import { Phone, ArrowRight, Shield } from "lucide-react";

const Home = () => {
  const { settings } = useSiteSettings();
  const { services } = useServices();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ 
            backgroundImage: `url(${settings.heroSection?.bannerUrl ? `${settings.heroSection.bannerUrl}?v=${Date.now()}` : heroImage})` 
          }}
        >
          {/* Multi-layer overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/95 via-primary/80 to-primary-dark/90" />
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-primary/20 to-primary-dark/60" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-semibold animate-fade-in backdrop-blur-sm bg-secondary/90 hover:bg-secondary shadow-lg">
            <Shield className="w-4 h-4 mr-2" />
            Segurança e Medicina do Trabalho
          </Badge>
          
          {/* Main content with staggered animations */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 drop-shadow-2xl leading-tight">
              {settings.heroSection?.title || "EVITARE"}
            </h1>
            
            <div className="max-w-4xl mx-auto space-y-3">
              <p className="text-xl md:text-3xl font-semibold drop-shadow-lg">
                {settings.heroSection?.subtitle || "Você já imaginou ter todas as novidades da empresa"}
              </p>
              <p className="text-2xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text">
                {settings.heroSection?.ctaText || "na palma da sua mão?"}
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link to="/contato">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8 py-6 shadow-2xl hover:shadow-primary/50 hover-scale group transition-all duration-300 backdrop-blur-sm"
                >
                  <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Fale Conosco
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/#servicos">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:border-primary-foreground/50 backdrop-blur-sm shadow-xl hover-scale transition-all duration-300"
                >
                  Nossos Serviços
                  <Icons.ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="servicos" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          O que fazemos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = (Icons as any)[service.icon_name] || Icons.Shield;
            return (
              <ServiceCard 
                key={service.id} 
                title={service.title}
                description={service.description}
                icon={IconComponent}
                action={service.action_label && service.action_path ? {
                  label: service.action_label,
                  path: service.action_path
                } : undefined}
              />
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="font-semibold mb-2">
            {settings.branding?.siteName || "EVITARE"} – Assessoria em Segurança e Medicina do Trabalho
          </p>
          <p className="text-sm">
            {settings.contact?.address || "Rua Coronel Marcos Rovaris, 328 – Sala 2 – Centro – Turvo"}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
