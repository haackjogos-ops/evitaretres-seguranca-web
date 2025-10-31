import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  label?: string;
}

export const ImageUpload = ({ value, onChange, label = "Logo/Imagem" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const extractFilePath = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/site-assets/');
      return pathParts[1] || null;
    } catch {
      return null;
    }
  };

  const deleteOldImage = async (oldUrl: string) => {
    const filePath = extractFilePath(oldUrl);
    if (filePath) {
      await supabase.storage.from('site-assets').remove([filePath]);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione uma imagem válida",
          variant: "destructive",
        });
        return;
      }

      // Validar tamanho (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "A imagem deve ter no máximo 2MB",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);

      // Deletar imagem antiga se existir
      if (value) {
        await deleteOldImage(value);
      }

      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload para o Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, {
          cacheControl: '300', // 5 minutos para reduzir cache
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath);

      onChange(publicUrl);

      toast({
        title: "Sucesso!",
        description: "Imagem enviada com sucesso",
      });
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar imagem",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value) {
      await deleteOldImage(value);
    }
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Logo preview"
            className="h-24 w-24 object-contain rounded-lg border-2 border-border bg-muted"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById('image-upload')?.click()}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Escolher imagem
              </>
            )}
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        PNG, JPG ou WEBP (máx. 2MB)
      </p>
    </div>
  );
};
