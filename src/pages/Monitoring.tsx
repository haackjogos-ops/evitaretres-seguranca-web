import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Car, Users, Shield, ClipboardCheck } from "lucide-react";

const Monitoring = () => {
  const services = [
    {
      icon: Flame,
      title: "Extintores e Hidrantes",
      description: "Inspeção, manutenção e recarga de equipamentos de combate a incêndio.",
    },
    {
      icon: Car,
      title: "Frota e Veículos",
      description: "Checklists e monitoramento da segurança dos veículos da empresa.",
    },
    {
      icon: Users,
      title: "CIPA",
      description: "Acompanhamento e suporte à Comissão Interna de Prevenção de Acidentes.",
    },
    {
      icon: Shield,
      title: "Brigada de Incêndio",
      description: "Formação, treinamento e acompanhamento da brigada.",
    },
    {
      icon: ClipboardCheck,
      title: "Checklists e Relatórios",
      description: "Relatórios periódicos de inspeção e conformidade com as normas.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Monitoramento
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Acompanhamento e inspeções periódicas de segurança
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Card key={service.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="font-semibold mb-2">EVITARE – Assessoria em Segurança e Medicina do Trabalho</p>
          <p className="text-sm">Rua Coronel Marcos Rovaris, 328 – Sala 2 – Centro – Turvo</p>
        </div>
      </footer>
    </div>
  );
};

export default Monitoring;
