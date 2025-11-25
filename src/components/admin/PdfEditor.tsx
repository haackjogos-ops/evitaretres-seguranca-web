import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Canvas, IText, Image as FabricImage } from "fabric";
import * as fabric from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import { Type, Trash2, Save } from "lucide-react";

// Configurar worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PdfEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string;
  onSave: (dataUrl: string) => void;
}

export const PdfEditor = ({ open, onOpenChange, pdfUrl, onSave }: PdfEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [loading, setLoading] = useState(true);
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);
  const { toast } = useToast();

  useEffect(() => {
    if (open && pdfUrl && canvasRef.current) {
      loadPdf();
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [open, pdfUrl]);

  const loadPdf = async () => {
    try {
      setLoading(true);
      console.log("Carregando PDF:", pdfUrl);

      // Carregar PDF com configuração de CORS
      const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
      });
      
      const pdf = await loadingTask.promise;
      console.log("PDF carregado com sucesso, páginas:", pdf.numPages);
      
      const page = await pdf.getPage(1);

      // Configurar escala
      const viewport = page.getViewport({ scale: 1.5 });

      // Criar canvas temporário para renderizar o PDF
      const tempCanvas = document.createElement("canvas");
      const context = tempCanvas.getContext("2d");
      tempCanvas.width = viewport.width;
      tempCanvas.height = viewport.height;

      if (!context) return;

      // Renderizar PDF no canvas temporário
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      
      await page.render(renderContext as any).promise;

      // Inicializar Fabric.js canvas
      if (canvasRef.current) {
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
        }

        fabricCanvasRef.current = new Canvas(canvasRef.current, {
          width: viewport.width,
          height: viewport.height,
        });

        // Definir a imagem do PDF como background
        fabricCanvasRef.current.backgroundImage = new fabric.Image(tempCanvas, {
          originX: "left",
          originY: "top",
        });
        fabricCanvasRef.current.renderAll();
      }

      console.log("PDF renderizado no canvas");
      setLoading(false);
    } catch (error: any) {
      console.error("Erro ao carregar PDF:", error);
      console.error("URL do PDF:", pdfUrl);
      console.error("Detalhes do erro:", error.name, error.message);
      
      toast({
        title: "Erro ao carregar PDF",
        description: `${error.message}. Verifique se o arquivo é um PDF válido.`,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = new IText("Clique para editar", {
      left: 100,
      top: 100,
      fontSize: fontSize,
      fill: textColor,
      fontFamily: "Arial",
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  };

  const deleteSelected = () => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject) {
      fabricCanvasRef.current.remove(activeObject);
      fabricCanvasRef.current.renderAll();
    }
  };

  const clearAll = () => {
    if (!fabricCanvasRef.current) return;

    const objects = fabricCanvasRef.current.getObjects();
    objects.forEach((obj) => {
      // Remover apenas objetos de texto (manter background)
      if (obj.type === "i-text" || obj.type === "text") {
        fabricCanvasRef.current?.remove(obj);
      }
    });
    fabricCanvasRef.current.renderAll();
  };

  const handleSave = () => {
    if (!fabricCanvasRef.current) return;

    try {
      const dataUrl = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 1,
      } as any);

      onSave(dataUrl);
      onOpenChange(false);

      toast({
        title: "Alterações salvas",
        description: "O certificado foi atualizado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editor de Certificado</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Ferramentas */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <Button onClick={addText} size="sm" variant="outline">
              <Type className="h-4 w-4 mr-2" />
              Adicionar Texto
            </Button>

            <div className="flex items-center gap-2">
              <Label htmlFor="text-color" className="text-sm">
                Cor:
              </Label>
              <Input
                id="text-color"
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-16 h-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="font-size" className="text-sm">
                Tamanho:
              </Label>
              <Input
                id="font-size"
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-20"
                min={8}
                max={72}
              />
            </div>

            <Button onClick={deleteSelected} size="sm" variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Remover Selecionado
            </Button>

            <Button onClick={clearAll} size="sm" variant="outline">
              Limpar Tudo
            </Button>
          </div>

          {/* Canvas */}
          <div className="border rounded-lg overflow-auto bg-gray-100 p-4">
            {loading && (
              <div className="flex items-center justify-center h-96">
                <div className="text-muted-foreground">Carregando PDF...</div>
              </div>
            )}
            <canvas ref={canvasRef} className={loading ? "hidden" : ""} />
          </div>

          <div className="text-xs text-muted-foreground">
            💡 Dica: Clique no texto para editar, arraste para mover, e use as alças para
            redimensionar
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
