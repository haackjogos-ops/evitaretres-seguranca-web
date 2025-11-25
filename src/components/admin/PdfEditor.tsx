import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, IText, Rect, Circle } from "fabric";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Type, Square, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PdfEditorProps {
  pdfUrl?: string;
  onSave?: (canvas: FabricCanvas) => void;
}

export const PdfEditor = ({ pdfUrl, onSave }: PdfEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(20);
  const [textToAdd, setTextToAdd] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 1131, // A4 ratio
      backgroundColor: "#ffffff",
    });

    setFabricCanvas(canvas);

    // Load PDF as background if provided
    if (pdfUrl) {
      // In a real implementation, you'd use pdf.js to render the PDF
      // For now, we'll just show a placeholder
      toast({
        title: "Editor carregado",
        description: "Adicione texto, formas e anotações ao certificado.",
      });
    }

    return () => {
      canvas.dispose();
    };
  }, [pdfUrl]);

  const addText = () => {
    if (!fabricCanvas || !textToAdd.trim()) return;

    const text = new IText(textToAdd, {
      left: 100,
      top: 100,
      fontSize: fontSize,
      fill: activeColor,
      fontFamily: 'Arial',
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    setTextToAdd("");
    
    toast({
      title: "Texto adicionado",
      description: "Você pode mover e editar o texto no canvas.",
    });
  };

  const addRectangle = () => {
    if (!fabricCanvas) return;

    const rect = new Rect({
      left: 100,
      top: 100,
      fill: 'transparent',
      stroke: activeColor,
      strokeWidth: 2,
      width: 200,
      height: 100,
    });

    fabricCanvas.add(rect);
    fabricCanvas.setActiveObject(rect);
  };

  const addSignaturePlaceholder = () => {
    if (!fabricCanvas) return;

    const signatureText = new IText('_____________________\nAssinatura', {
      left: 100,
      top: 100,
      fontSize: 16,
      fill: activeColor,
      fontFamily: 'Arial',
      textAlign: 'center',
    });

    fabricCanvas.add(signatureText);
    fabricCanvas.setActiveObject(signatureText);
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;
    
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject) {
      fabricCanvas.remove(activeObject);
      toast({
        title: "Objeto removido",
      });
    }
  };

  const handleSave = () => {
    if (!fabricCanvas || !onSave) return;
    onSave(fabricCanvas);
    toast({
      title: "Alterações salvas",
      description: "As modificações foram aplicadas ao certificado.",
    });
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;

    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });

    const link = document.createElement('a');
    link.download = 'certificado-editado.png';
    link.href = dataURL;
    link.click();

    toast({
      title: "Download iniciado",
      description: "O certificado editado foi baixado.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="space-y-2">
          <Label htmlFor="text-input">Adicionar Texto</Label>
          <div className="flex gap-2">
            <Input
              id="text-input"
              value={textToAdd}
              onChange={(e) => setTextToAdd(e.target.value)}
              placeholder="Digite o texto..."
              onKeyPress={(e) => e.key === 'Enter' && addText()}
            />
            <Button type="button" onClick={addText} size="icon">
              <Type className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-size">Tamanho da Fonte</Label>
          <Select value={fontSize.toString()} onValueChange={(v) => setFontSize(Number(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12px</SelectItem>
              <SelectItem value="16">16px</SelectItem>
              <SelectItem value="20">20px</SelectItem>
              <SelectItem value="24">24px</SelectItem>
              <SelectItem value="32">32px</SelectItem>
              <SelectItem value="48">48px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color-picker">Cor</Label>
          <Input
            id="color-picker"
            type="color"
            value={activeColor}
            onChange={(e) => setActiveColor(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Ferramentas</Label>
          <div className="flex gap-2">
            <Button type="button" onClick={addRectangle} variant="outline" size="sm">
              <Square className="h-4 w-4 mr-1" />
              Retângulo
            </Button>
            <Button type="button" onClick={addSignaturePlaceholder} variant="outline" size="sm">
              <Type className="h-4 w-4 mr-1" />
              Assinatura
            </Button>
            <Button type="button" onClick={deleteSelected} variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              Deletar
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-auto bg-gray-100 p-4">
        <canvas ref={canvasRef} className="mx-auto shadow-lg" />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" onClick={handleDownload} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Baixar Imagem
        </Button>
        {onSave && (
          <Button type="button" onClick={handleSave}>
            Salvar Alterações
          </Button>
        )}
      </div>
    </div>
  );
};
