import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Truck, Building2, CircleDot, Mountain, Users } from "lucide-react";

const Courses = () => {
  const courses = [
    {
      icon: Zap,
      title: "NR 10",
      subtitle: "Eletricidade e SEP",
      description: "Segurança em instalações e serviços em eletricidade.",
    },
    {
      icon: Truck,
      title: "NR 11",
      subtitle: "Empilhadeira e movimentação de cargas",
      description: "Operação segura de empilhadeiras e transporte de materiais.",
    },
    {
      icon: Building2,
      title: "NR 18",
      subtitle: "Construção civil",
      description: "Condições e meio ambiente de trabalho na indústria da construção.",
    },
    {
      icon: CircleDot,
      title: "NR 33",
      subtitle: "Espaço confinado",
      description: "Segurança e saúde nos trabalhos em espaços confinados.",
    },
    {
      icon: Mountain,
      title: "NR 35",
      subtitle: "Trabalho em altura",
      description: "Segurança e saúde no trabalho em altura.",
    },
    {
      icon: Users,
      title: "SIPAT e CIPA",
      subtitle: "Prevenção de acidentes",
      description: "Semana Interna de Prevenção de Acidentes e Comissão Interna.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Cursos
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Cursos especializados exigidos por normas regulamentadoras
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <course.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  <CardDescription className="font-semibold">
                    {course.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{course.description}</p>
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

export default Courses;
