import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageContent } from "@/hooks/usePageContent";
import { useMonitoringServices } from "@/hooks/useMonitoringServices";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import * as Icons from "lucide-react";

const Monitoring = () => {
  const { content } = usePageContent("monitoring");
  const { services } = useMonitoringServices();
  const { settings } = useSiteSettings();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {content?.title || "Monitoramento"}
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            {content?.subtitle || "Acompanhamento e inspeções periódicas de segurança"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => {
              const IconComponent = (Icons as any)[service.icon] || Icons.Star;
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {service.logo_url ? (
                        <img 
                          src={service.logo_url} 
                          alt={service.title}
                          className="w-14 h-14 object-contain rounded-lg border-2 border-primary/20"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20">
                          <IconComponent className="h-7 w-7 text-primary" />
                        </div>
                      )}
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

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

export default Monitoring;
