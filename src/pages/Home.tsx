import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useServices } from "@/hooks/useServices";
import heroImage from "@/assets/hero-safety.jpg";

const Home = () => {
  const { settings } = useSiteSettings();
  const { services } = useServices();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${settings.heroSection?.bannerUrl ? `${settings.heroSection.bannerUrl}?v=${Date.now()}` : heroImage})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {settings.heroSection?.title || "EVITARE"}
          </h1>
          <p className="text-xl md:text-3xl mb-4 font-semibold">
            {settings.heroSection?.subtitle || "Você já imaginou ter todas as novidades da empresa"}
          </p>
          <p className="text-2xl md:text-4xl mb-8 font-bold">
            {settings.heroSection?.ctaText || "na palma da sua mão?"}
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
