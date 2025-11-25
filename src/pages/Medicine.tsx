import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { UserCheck, FileText, Stethoscope } from "lucide-react";

const Medicine = () => {
  const { settings } = useSiteSettings();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Medicina | Segurança do Trabalho
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Serviços completos em medicina e segurança ocupacional
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quadro 01 - ATENDIMENTO PERSONALIZADO */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10">
                    <UserCheck className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Atendimento Personalizado</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Cursos e treinamentos inloco no conforto de seu ambiente e data e horário desejado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Visitas técnicas periódicas com relatórios online em tempo real em seu smartphone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Atendimento em tempo integral presencial ou remoto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Implantação e controle para atendimento na NOVA NR01 Riscos psicossociais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">Tratamento diferenciado de nossa equipe</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Quadro 02 - DOCUMENTOS */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Documentos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>PGR</strong> - Programa de Gerenciamento de Riscos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>LTCAT</strong> - Laudo Técnico das condições Ambientais de Trabalho</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>PCMSO</strong> - Programa de Controle Médico de Saúde Ocupacional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>CAT</strong> - Comunicado de Acidente de Trabalho</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>PPP</strong> - Perfil Profissiográfico Previdenciário</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>AET</strong> - Análise Ergonômica do Trabalho</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>APRE</strong> - Análise Preliminar de Risco Ergonômico</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>FRE</strong> - Ficha de registro de EPI</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Quadro 03 - EXAMES */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10">
                    <Stethoscope className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Exames</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>ASO</strong> - Atestados de saúde ocupacionais: Admissão, Mudança de função/riscos, Retorno ao trabalho, demissão e abono de atestados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>COMPLEMENTARES</strong> - Audiometria, Espirometria, Eletrocardiograma, Eletroencefalograma, Acuidade visual</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong>LABORATORIAIS</strong> - Encaminhamento interno a parceiros</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
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

export default Medicine;
