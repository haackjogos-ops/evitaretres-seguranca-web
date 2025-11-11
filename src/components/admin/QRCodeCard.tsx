import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Download, Send, Trash2, Edit, Eye, EyeOff } from "lucide-react";
import { useRef } from "react";

interface QRCodeCardProps {
  clientName: string;
  link: string;
  whatsappNumber?: string;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

export const QRCodeCard = ({
  clientName,
  link,
  whatsappNumber,
  isActive,
  onEdit,
  onDelete,
  onToggleActive,
}: QRCodeCardProps) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `qrcode-${clientName}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const sendToWhatsApp = () => {
    if (!whatsappNumber) {
      alert("Número do WhatsApp não configurado");
      return;
    }

    const message = `Olá! Aqui está seu QR Code personalizado para ${clientName}. Link: ${link}`;
    const whatsappURL = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, '_blank');
  };

  return (
    <Card className={`${!isActive ? 'opacity-50' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{clientName}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleActive}
          >
            {isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={qrRef} className="flex justify-center p-4 bg-white rounded">
          <QRCodeSVG value={link} size={200} level="H" />
        </div>
        
        <div className="text-sm text-muted-foreground break-all">
          <strong>Link:</strong> {link}
        </div>
        
        {whatsappNumber && (
          <div className="text-sm text-muted-foreground">
            <strong>WhatsApp:</strong> {whatsappNumber}
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Button onClick={downloadQRCode} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </Button>
          
          {whatsappNumber && (
            <Button onClick={sendToWhatsApp} variant="outline" size="sm" className="bg-green-50 hover:bg-green-100">
              <Send className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          )}
          
          <Button onClick={onEdit} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          
          <Button onClick={onDelete} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
