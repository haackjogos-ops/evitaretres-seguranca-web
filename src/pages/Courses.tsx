import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { usePageContent } from "@/hooks/usePageContent";
import { useCourses } from "@/hooks/useCourses";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import * as Icons from "lucide-react";

const Courses = () => {
  const { content } = usePageContent("courses");
  const { courses } = useCourses();
  const { settings } = useSiteSettings();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {content?.title || "Cursos"}
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            {content?.subtitle || "Cursos especializados exigidos por normas regulamentadoras"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const IconComponent = (Icons as any)[course.icon] || Icons.Star;
              return (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {course.logo_url ? (
                        <img 
                          src={`${course.logo_url}?v=${Date.now()}`}
                          alt={course.title}
                          className={`object-contain rounded-lg border-2 border-primary/20 ${
                            course.logo_size === 'large' ? 'w-20 h-20' :
                            course.logo_size === 'medium' ? 'w-16 h-16' :
                            'w-12 h-12'
                          }`}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                      )}
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
