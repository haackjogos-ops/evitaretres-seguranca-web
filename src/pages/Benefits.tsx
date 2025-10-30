import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { useBenefits } from "@/hooks/useBenefits";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Benefits = () => {
  const { content } = usePageContent("benefits");
  const { benefits } = useBenefits();
  const { settings } = useSiteSettings();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {content?.title || "Vantagem de uma Assessoria Anual"}
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            {content?.subtitle || "Investimento inteligente com suporte completo para sua empresa"}
          </p>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Por que escolher a EVITARE?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit.id} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/20">
            <h2 className="text-2xl font-bold text-center mb-4">
              Demonstrativo de Implantação
            </h2>
            <p className="text-center text-muted-foreground mb-6">
              Para todas as empresas de todos os portes que tenham ao menos um funcionário
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-background rounded-lg">
                <p className="font-semibold">PCMSO</p>
                <p className="text-sm text-muted-foreground">Empresa a partir de 1 trabalhador</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="font-semibold">PGR</p>
                <p className="text-sm text-muted-foreground">Gestão de riscos</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="font-semibold">Treinamento</p>
                <p className="text-sm text-muted-foreground">Uso correto de EPI</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="font-semibold">CIPA</p>
                <p className="text-sm text-muted-foreground">Fiscalização</p>
              </div>
            </div>
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

export default Benefits;
