import Header from "@/components/Header";
import ContactButtons from "@/components/ContactButtons";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Entre em Contato
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Estamos prontos para atender sua empresa
          </p>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-primary/10">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Nosso Endereço</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                Rua Coronel Marcos Rovaris, 328 – Sala 2<br />
                Centro – Turvo, SC
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Canais de Atendimento
            </h2>
            <ContactButtons />
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

export default Contact;
