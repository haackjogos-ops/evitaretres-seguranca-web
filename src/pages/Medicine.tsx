import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Stethoscope } from "lucide-react";

const Medicine = () => {
  const documents = [
    "PGR - Programa de Gerenciamento de Riscos",
    "PCMSO - Programa de Controle Médico de Saúde Ocupacional",
    "LTCAT - Laudo Técnico das Condições Ambientais do Trabalho",
    "PPP - Perfil Profissiográfico Previdenciário",
  ];

  const exams = [
    "ASO - Atestado de Saúde Ocupacional",
    "Audiometria",
    "Espirometria",
    "Eletroencefalograma",
    "Psicológico NR33",
    "Psicológico NR35",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Medicina e Segurança do Trabalho
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Documentos e exames ocupacionais completos
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Documentos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {documents.map((doc) => (
                    <li key={doc} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Stethoscope className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Exames</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {exams.map((exam) => (
                    <li key={exam} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{exam}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
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

export default Medicine;
