import Header from "@/components/Header";
import { useFAQ } from "@/hooks/useFAQ";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FAQ = () => {
  const { faqItems, isLoading } = useFAQ();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-muted-foreground">Carregando perguntas frequentes...</p>
          </div>
        </section>
      </div>
    );
  }

  const activeFAQs = faqItems.filter((item) => item.is_active);
  const categories = Array.from(new Set(activeFAQs.map((item) => item.category)));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-xl text-center text-muted-foreground mb-12">
            Tire suas dúvidas sobre nossos serviços
          </p>

          {categories.length > 1 ? (
            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <Accordion type="single" collapsible className="w-full">
                    {activeFAQs
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <AccordionItem key={item.id} value={item.id}>
                          <AccordionTrigger className="text-left">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {activeFAQs.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
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

export default FAQ;
