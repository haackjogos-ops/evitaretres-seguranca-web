import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, File, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PdfUploadProps {
  onUploadComplete: (url: string) => void;
  certificateId?: string;
}

export const PdfUpload = ({ onUploadComplete, certificateId }: PdfUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione um arquivo PDF.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 10MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${certificateId || Date.now()}.${fileExt}`;
      const filePath = `pdfs/${new Date().getFullYear()}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(filePath, selectedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      
      toast({
        title: "PDF enviado com sucesso!",
        description: "O arquivo foi carregado.",
      });

      setSelectedFile(null);
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro ao enviar PDF",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div>
        <Label htmlFor="pdf-upload" className="text-base font-semibold">
          Enviar PDF Existente
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Faça upload de um certificado PDF já criado (máximo 10MB)
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="flex-1"
          disabled={uploading}
        />
        
        {selectedFile && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setSelectedFile(null)}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {selectedFile && (
        <div className="flex items-center gap-2 p-3 bg-background rounded border">
          <File className="h-4 w-4 text-primary" />
          <span className="text-sm flex-1">{selectedFile.name}</span>
          <span className="text-xs text-muted-foreground">
            {(selectedFile.size / 1024).toFixed(2)} KB
          </span>
        </div>
      )}

      {selectedFile && (
        <Button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Enviando..." : "Enviar PDF"}
        </Button>
      )}
    </div>
  );
};
