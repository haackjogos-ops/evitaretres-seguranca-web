import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Canvas, IText, Rect, Line } from "fabric";
import * as fabric from "fabric";
import * as pdfjsLib from "pdfjs-dist";
import { Save, Loader2 } from "lucide-react";
import { PdfEditorToolbar } from "./PdfEditorToolbar";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Carregando PDF...");
  const { toast } = useToast();

  // Text formatting state
  const [textColor, setTextColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("#3b82f6");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // History state for undo/redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isHistoryAction = useRef(false);

  const saveToHistory = useCallback(() => {
    if (isHistoryAction.current || !fabricCanvasRef.current) return;

    const json = JSON.stringify(fabricCanvasRef.current.toJSON());
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(json);
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [historyIndex]);

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

  // Update selected object when formatting changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject && (activeObject.type === "i-text" || activeObject.type === "text")) {
      const textObj = activeObject as IText;
      textObj.set({
        fill: textColor,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fontWeight: isBold ? "bold" : "normal",
        fontStyle: isItalic ? "italic" : "normal",
        underline: isUnderline,
      });
      fabricCanvasRef.current.renderAll();
    }
  }, [textColor, fontSize, fontFamily, isBold, isItalic, isUnderline]);

  const loadPdf = async () => {
    try {
      setLoading(true);
      setLoadingMessage("Baixando PDF...");
      console.log("Carregando PDF:", pdfUrl);

      // CORS FIX: Fetch PDF as ArrayBuffer instead of using URL directly
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error(`Erro ao baixar PDF: ${response.status} ${response.statusText}`);
      }

      setLoadingMessage("Processando PDF...");
      const arrayBuffer = await response.arrayBuffer();

      // Load PDF from ArrayBuffer
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log("PDF carregado com sucesso, páginas:", pdf.numPages);

      const page = await pdf.getPage(1);

      // Configure scale for better quality
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      // Create temporary canvas to render PDF
      const tempCanvas = document.createElement("canvas");
      const context = tempCanvas.getContext("2d");
      tempCanvas.width = viewport.width;
      tempCanvas.height = viewport.height;

      if (!context) {
        throw new Error("Não foi possível criar contexto do canvas");
      }

      setLoadingMessage("Renderizando PDF...");

      // Render PDF to temporary canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext as any).promise;

      // Initialize Fabric.js canvas
      if (canvasRef.current) {
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
        }

        fabricCanvasRef.current = new Canvas(canvasRef.current, {
          width: viewport.width,
          height: viewport.height,
        });

        // Set PDF image as background
        fabricCanvasRef.current.backgroundImage = new fabric.Image(tempCanvas, {
          originX: "left",
          originY: "top",
        });
        fabricCanvasRef.current.renderAll();

        // Setup event listeners for history
        fabricCanvasRef.current.on("object:added", saveToHistory);
        fabricCanvasRef.current.on("object:modified", saveToHistory);
        fabricCanvasRef.current.on("object:removed", saveToHistory);

        // Update formatting state when selection changes
        fabricCanvasRef.current.on("selection:created", updateFormattingFromSelection);
        fabricCanvasRef.current.on("selection:updated", updateFormattingFromSelection);

        // Save initial state
        saveToHistory();
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

  const updateFormattingFromSelection = () => {
    if (!fabricCanvasRef.current) return;

    const activeObject = fabricCanvasRef.current.getActiveObject();
    if (activeObject && (activeObject.type === "i-text" || activeObject.type === "text")) {
      const textObj = activeObject as IText;
      setTextColor((textObj.fill as string) || "#000000");
      setFontSize(textObj.fontSize || 16);
      setFontFamily(textObj.fontFamily || "Arial");
      setIsBold(textObj.fontWeight === "bold");
      setIsItalic(textObj.fontStyle === "italic");
      setIsUnderline(textObj.underline || false);
    }
  };

  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = new IText("Clique para editar", {
      left: 100,
      top: 100,
      fontSize: fontSize,
      fill: textColor,
      fontFamily: fontFamily,
      fontWeight: isBold ? "bold" : "normal",
      fontStyle: isItalic ? "italic" : "normal",
      underline: isUnderline,
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgElement = document.createElement("img");
      imgElement.onload = () => {
        const fabricImage = new fabric.Image(imgElement, {
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5,
        });

        // Limit max size
        const maxSize = 300;
        if (fabricImage.width && fabricImage.width > maxSize) {
          fabricImage.scaleToWidth(maxSize);
        }
        if (fabricImage.height && fabricImage.height > maxSize) {
          fabricImage.scaleToHeight(maxSize);
        }

        fabricCanvasRef.current?.add(fabricImage);
        fabricCanvasRef.current?.setActiveObject(fabricImage);
        fabricCanvasRef.current?.renderAll();
      };
      imgElement.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = "";
  };

  const addRectangle = () => {
    if (!fabricCanvasRef.current) return;

    const rect = new Rect({
      left: 100,
      top: 100,
      width: 150,
      height: 100,
      fill: "transparent",
      stroke: fillColor,
      strokeWidth: 2,
    });

    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
    fabricCanvasRef.current.renderAll();
  };

  const addLine = () => {
    if (!fabricCanvasRef.current) return;

    const line = new Line([50, 100, 250, 100], {
      left: 100,
      top: 100,
      stroke: fillColor,
      strokeWidth: 2,
    });

    fabricCanvasRef.current.add(line);
    fabricCanvasRef.current.setActiveObject(line);
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
      fabricCanvasRef.current?.remove(obj);
    });
    fabricCanvasRef.current.renderAll();
  };

  const undo = () => {
    if (historyIndex <= 0 || !fabricCanvasRef.current) return;

    isHistoryAction.current = true;
    const newIndex = historyIndex - 1;
    const state = history[newIndex];

    fabricCanvasRef.current.loadFromJSON(JSON.parse(state), () => {
      fabricCanvasRef.current?.renderAll();
      setHistoryIndex(newIndex);
      isHistoryAction.current = false;
    });
  };

  const redo = () => {
    if (historyIndex >= history.length - 1 || !fabricCanvasRef.current) return;

    isHistoryAction.current = true;
    const newIndex = historyIndex + 1;
    const state = history[newIndex];

    fabricCanvasRef.current.loadFromJSON(JSON.parse(state), () => {
      fabricCanvasRef.current?.renderAll();
      setHistoryIndex(newIndex);
      isHistoryAction.current = false;
    });
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
      <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>📄 Editor de Certificado</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Toolbar */}
          <PdfEditorToolbar
            onAddText={addText}
            onAddImage={addImage}
            onAddRectangle={addRectangle}
            onAddLine={addLine}
            onDeleteSelected={deleteSelected}
            onClearAll={clearAll}
            onUndo={undo}
            onRedo={redo}
            textColor={textColor}
            setTextColor={setTextColor}
            fillColor={fillColor}
            setFillColor={setFillColor}
            fontSize={fontSize}
            setFontSize={setFontSize}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            isBold={isBold}
            setIsBold={setIsBold}
            isItalic={isItalic}
            setIsItalic={setIsItalic}
            isUnderline={isUnderline}
            setIsUnderline={setIsUnderline}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
          />

          {/* Hidden file input for image upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Canvas */}
          <div className="flex-1 border rounded-lg overflow-auto bg-muted/50 p-4">
            {loading && (
              <div className="flex flex-col items-center justify-center h-96 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div className="text-muted-foreground">{loadingMessage}</div>
              </div>
            )}
            <div className={loading ? "hidden" : "flex justify-center"}>
              <canvas ref={canvasRef} />
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            💡 <strong>Dicas:</strong> Clique duplo no texto para editar • Arraste para
            mover • Use as alças para redimensionar • Selecione um elemento e use a
            toolbar para formatar
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
