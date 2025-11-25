import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PdfUploadProps {
  onUploadComplete: (url: string) => void;
  currentFile?: string;
}

export const PdfUpload = ({ onUploadComplete, currentFile }: PdfUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validar tipo de arquivo
    if (selectedFile.type !== "application/pdf") {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo PDF.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamanho (máx 20MB)
    if (selectedFile.size > 20 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 20MB.",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    uploadFile(selectedFile);
  };

  const uploadFile = async (fileToUpload: File) => {
    setUploading(true);
    try {
      const fileExt = "pdf";
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("certificates")
        .upload(filePath, fileToUpload);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("certificates")
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);

      toast({
        title: "Upload concluído",
        description: "O PDF foi enviado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="pdf-upload"
          disabled={uploading}
        />
        <label
          htmlFor="pdf-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-primary">Clique para fazer upload</span> ou
            arraste um arquivo PDF aqui
          </div>
          <div className="text-xs text-muted-foreground">
            Máximo 20MB • Apenas PDF
          </div>
        </label>
      </div>

      {(file || currentFile) && (
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
          <FileText className="h-8 w-8 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {file?.name || "certificado.pdf"}
            </p>
            <p className="text-xs text-muted-foreground">
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Arquivo carregado"}
            </p>
          </div>
          {!uploading && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {uploading && (
            <div className="text-xs text-muted-foreground">Enviando...</div>
          )}
        </div>
      )}
    </div>
  );
};
