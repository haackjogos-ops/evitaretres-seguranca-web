import { Phone, MessageCircle, Mail, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactButtons = () => {
  const contacts = [
    {
      icon: Phone,
      label: "Telefone",
      href: "tel:+5548999999999",
      color: "bg-primary hover:bg-primary/90",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: "https://wa.me/5548999999999",
      color: "bg-accent hover:bg-accent/90",
    },
    {
      icon: Mail,
      label: "E-mail",
      href: "mailto:contato@evitare.com.br",
      color: "bg-secondary hover:bg-secondary/90",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com/evitare",
      color: "bg-primary hover:bg-primary/90",
    },
    {
      icon: Facebook,
      label: "Facebook",
      href: "https://facebook.com/evitare",
      color: "bg-accent hover:bg-accent/90",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {contacts.map((contact) => (
        <a
          key={contact.label}
          href={contact.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button className={`w-full h-24 flex flex-col items-center justify-center gap-2 ${contact.color}`}>
            <contact.icon className="h-8 w-8" />
            <span className="text-sm font-medium">{contact.label}</span>
          </Button>
        </a>
      ))}
    </div>
  );
};

export default ContactButtons;
