import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const WhatsAppButton = () => {
  const { settings } = useSiteSettings();
  const whatsappNumber = settings.contact?.whatsapp || "5548999999999";
  const message = "Olá! Gostaria de saber mais sobre os serviços da EVITARE.";
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 animate-fade-in"
    >
      <Button 
        size="lg"
        className="rounded-full h-14 w-14 shadow-lg hover:scale-110 transition-transform bg-accent hover:bg-accent/90"
      >
        <MessageCircle className="h-7 w-7" />
      </Button>
    </a>
  );
};

export default WhatsAppButton;
