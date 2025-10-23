import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Wrench, Users, Flame, Heart, AlertTriangle } from "lucide-react";

const Trainings = () => {
  const trainings = [
    {
      icon: Shield,
      title: "NR 06",
      subtitle: "EPI e segurança individual",
      description: "Admissional, Periódicos, Retorno ao trabalho, Ordens de serviço. Registro de entrega de EPI, regras de segurança, utilização e higiene do EPI e EPC.",
    },
    {
      icon: Wrench,
      title: "NR 12",
      subtitle: "Máquinas e equipamentos",
      description: "Segurança no trabalho com máquinas e equipamentos. Ferramentas elétricas em geral.",
    },
    {
      icon: Users,
      title: "NR 17",
      subtitle: "Ergonomia",
      description: "Ergonomia: transporte manual de cargas e postura adequada no trabalho.",
    },
    {
      icon: Flame,
      title: "NR 23",
      subtitle: "Brigada e combate a incêndio",
      description: "Formação de brigada de incêndio e técnicas de combate a incêndios.",
    },
    {
      icon: Heart,
      title: "Primeiros Socorros",
      subtitle: "Atendimento emergencial",
      description: "Procedimentos básicos de primeiros socorros no ambiente de trabalho.",
    },
    {
      icon: AlertTriangle,
      title: "Evacuação",
      subtitle: "Saída de emergência",
      description: "Evacuação de área em emergências e procedimentos de segurança.",
    },
    {
      icon: Wrench,
      title: "Montagem de Andaimes",
      subtitle: "Segurança em altura",
      description: "Montagens e desmontagens seguras de andaimes.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Treinamentos
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Capacitação em normas regulamentadoras e segurança do trabalho
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainings.map((training) => (
              <Card key={training.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <training.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{training.title}</CardTitle>
                  <CardDescription className="font-semibold">
                    {training.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{training.description}</p>
                </CardContent>
                <CardFooter>
                  <Link to="/inscricao" className="w-full">
                    <Button className="w-full">Fazer inscrição</Button>
                  </Link>
                </CardFooter>
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

export default Trainings;
