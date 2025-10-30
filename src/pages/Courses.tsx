import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Courses = () => {
  const courses = [
    {
      emoji: "⚡",
      title: "NR 10",
      subtitle: "Eletricidade e SEP",
      description: "Serviços em eletricidade e SEP (Sistema Elétrico de Potência).",
    },
    {
      emoji: "🚛",
      title: "NR 11",
      subtitle: "Transporte e movimentação de cargas",
      description: "Empilhadeira, Guindalto, Monovia, Pórtico e outros equipamentos de movimentação.",
    },
    {
      emoji: "👷",
      title: "NR 18",
      subtitle: "Construção civil",
      description: "Segurança na indústria da construção civil.",
    },
    {
      emoji: "🕳️",
      title: "NR 33",
      subtitle: "Espaço confinado",
      description: "Segurança e saúde nos trabalhos em espaços confinados.",
    },
    {
      emoji: "🪜",
      title: "NR 35",
      subtitle: "Trabalho em altura",
      description: "Trabalhos em altura com segurança.",
    },
    {
      emoji: "👥",
      title: "NR 05 - CIPA",
      subtitle: "Comissão Interna de Prevenção de Acidentes",
      description: "CIPA (designado/comissão interna de prevenção de acidentes).",
    },
    {
      emoji: "📋",
      title: "SIPAT",
      subtitle: "Semana Interna de Prevenção de Acidentes",
      description: "Semana interna a prevenção de acidentes.",
    },
    {
      emoji: "⚙️",
      title: "NR 12",
      subtitle: "Máquinas e Equipamentos",
      description: "Segurança na operação, referências técnicas e exposição de máquinas e equipamentos.",
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
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <span className="text-3xl">{course.emoji}</span>
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
