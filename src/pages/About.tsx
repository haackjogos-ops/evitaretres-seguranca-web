import Header from "@/components/Header";
import { Target, Eye, Heart, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Missão",
      description:
        "Promover ambientes de trabalho mais seguros e saudáveis, com soluções completas em segurança, medicina e treinamento ocupacional.",
    },
    {
      icon: Eye,
      title: "Visão",
      description:
        "Ser referência regional em qualidade, confiança e atendimento humanizado.",
    },
    {
      icon: Heart,
      title: "Valores",
      description:
        "Ética, responsabilidade, compromisso com a segurança e respeito às pessoas.",
    },
    {
      icon: Star,
      title: "Diferencial",
      description:
        "A EVITARE realiza todo o processo de implantação, monitoramento e acompanhamento das normas de segurança, com suporte técnico e jurídico completo, treinamentos personalizados e visitas periódicas às empresas.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Sobre a EVITARE
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-16">
            Compromisso com a segurança e saúde no trabalho
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
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

export default About;
