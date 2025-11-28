import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Type,
  Image,
  Square,
  Minus,
  Trash2,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
} from "lucide-react";

interface PdfEditorToolbarProps {
  onAddText: () => void;
  onAddImage: () => void;
  onAddRectangle: () => void;
  onAddLine: () => void;
  onDeleteSelected: () => void;
  onClearAll: () => void;
  onUndo: () => void;
  onRedo: () => void;
  textColor: string;
  setTextColor: (color: string) => void;
  fillColor: string;
  setFillColor: (color: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  isBold: boolean;
  setIsBold: (bold: boolean) => void;
  isItalic: boolean;
  setIsItalic: (italic: boolean) => void;
  isUnderline: boolean;
  setIsUnderline: (underline: boolean) => void;
  canUndo: boolean;
  canRedo: boolean;
}

const FONTS = [
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Georgia", label: "Georgia" },
  { value: "Courier New", label: "Courier New" },
  { value: "Verdana", label: "Verdana" },
];

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72];

export const PdfEditorToolbar = ({
  onAddText,
  onAddImage,
  onAddRectangle,
  onAddLine,
  onDeleteSelected,
  onClearAll,
  onUndo,
  onRedo,
  textColor,
  setTextColor,
  fillColor,
  setFillColor,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  isBold,
  setIsBold,
  isItalic,
  setIsItalic,
  isUnderline,
  setIsUnderline,
  canUndo,
  canRedo,
}: PdfEditorToolbarProps) => {
  return (
    <div className="space-y-3 p-4 bg-muted rounded-lg">
      {/* Linha 1: Ferramentas de inserção */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground mr-2">Inserir:</span>
        <Button onClick={onAddText} size="sm" variant="outline" title="Adicionar Texto">
          <Type className="h-4 w-4 mr-1" />
          Texto
        </Button>
        <Button onClick={onAddImage} size="sm" variant="outline" title="Adicionar Imagem">
          <Image className="h-4 w-4 mr-1" />
          Imagem
        </Button>
        <Button onClick={onAddRectangle} size="sm" variant="outline" title="Adicionar Retângulo">
          <Square className="h-4 w-4 mr-1" />
          Retângulo
        </Button>
        <Button onClick={onAddLine} size="sm" variant="outline" title="Adicionar Linha">
          <Minus className="h-4 w-4 mr-1" />
          Linha
        </Button>

        <div className="h-6 w-px bg-border mx-2" />

        <Button
          onClick={onUndo}
          size="sm"
          variant="outline"
          disabled={!canUndo}
          title="Desfazer"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={onRedo}
          size="sm"
          variant="outline"
          disabled={!canRedo}
          title="Refazer"
        >
          <Redo2 className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border mx-2" />

        <Button onClick={onDeleteSelected} size="sm" variant="outline" title="Excluir Selecionado">
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
        <Button onClick={onClearAll} size="sm" variant="destructive" title="Limpar Tudo">
          Limpar Tudo
        </Button>
      </div>

      {/* Linha 2: Formatação de texto */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground mr-2">Texto:</span>
        
        <Select value={fontFamily} onValueChange={setFontFamily}>
          <SelectTrigger className="w-[150px] h-9">
            <SelectValue placeholder="Fonte" />
          </SelectTrigger>
          <SelectContent>
            {FONTS.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                <span style={{ fontFamily: font.value }}>{font.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={fontSize.toString()} onValueChange={(v) => setFontSize(Number(v))}>
          <SelectTrigger className="w-[80px] h-9">
            <SelectValue placeholder="Tamanho" />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1">
          <Button
            onClick={() => setIsBold(!isBold)}
            size="sm"
            variant={isBold ? "default" : "outline"}
            className="h-9 w-9 p-0"
            title="Negrito"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setIsItalic(!isItalic)}
            size="sm"
            variant={isItalic ? "default" : "outline"}
            className="h-9 w-9 p-0"
            title="Itálico"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setIsUnderline(!isUnderline)}
            size="sm"
            variant={isUnderline ? "default" : "outline"}
            className="h-9 w-9 p-0"
            title="Sublinhado"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border mx-1" />

        <div className="flex items-center gap-2">
          <Label htmlFor="text-color" className="text-sm whitespace-nowrap">
            Cor Texto:
          </Label>
          <Input
            id="text-color"
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-10 h-9 p-1 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="fill-color" className="text-sm whitespace-nowrap">
            Preenchimento:
          </Label>
          <Input
            id="fill-color"
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
            className="w-10 h-9 p-1 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
