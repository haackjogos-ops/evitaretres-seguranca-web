import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageContent } from "@/hooks/usePageContent";
import { useCourses } from "@/hooks/useCourses";
import { useTrainings } from "@/hooks/useTrainings";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import * as Icons from "lucide-react";

const Courses = () => {
  const { content } = usePageContent("courses");
  const { courses } = useCourses();
  const { trainings } = useTrainings();
  const { settings } = useSiteSettings();

  // Combinar cursos e treinamentos em um único array ordenado
  const allItems = [...courses, ...trainings].sort((a, b) => 
    a.display_order - b.display_order
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {content?.title || "Cursos e Treinamentos"}
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            {content?.subtitle || "Capacitação completa em normas regulamentadoras e segurança do trabalho"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allItems.map((item) => {
              const IconComponent = (Icons as any)[item.icon] || Icons.Star;
              return (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {item.logo_url ? (
                        <img 
                          src={`${item.logo_url}?v=${Date.now()}`}
                          alt={item.title}
                          className={`object-contain rounded-lg border-2 border-primary/20 ${
                            item.logo_size === 'large' ? 'w-20 h-20' :
                            item.logo_size === 'medium' ? 'w-16 h-16' :
                            'w-12 h-12'
                          }`}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription className="font-semibold">
                      {item.subtitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Link to="/inscricao" className="w-full">
                      <Button className="w-full">Fazer inscrição</Button>
                    </Link>
                  </CardFooter>
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

export default Courses;
