import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "./EmojiPicker";
import { IconPicker } from "./IconPicker";
import { ImageUpload } from "./ImageUpload";

interface Field {
  name: string;
  label: string;
  type: "text" | "textarea" | "emoji" | "icon" | "image";
  required?: boolean;
}

interface ItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: Field[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export const ItemModal = ({
  open,
  onOpenChange,
  title,
  fields,
  values,
  onChange,
  onSave,
  isLoading = false,
}: ItemModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              
              {field.type === "text" && (
                <Input
                  id={field.name}
                  value={values[field.name] || ""}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  placeholder={`Digite ${field.label.toLowerCase()}`}
                />
              )}
              
              {field.type === "textarea" && (
                <Textarea
                  id={field.name}
                  value={values[field.name] || ""}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  placeholder={`Digite ${field.label.toLowerCase()}`}
                  rows={4}
                />
              )}
              
              {field.type === "emoji" && (
                <EmojiPicker
                  value={values[field.name] || "😀"}
                  onChange={(emoji) => onChange(field.name, emoji)}
                />
              )}
              
              {field.type === "icon" && (
                <IconPicker
                  value={values[field.name] || "Star"}
                  onChange={(icon) => onChange(field.name, icon)}
                />
              )}
              
              {field.type === "image" && (
                <ImageUpload
                  value={values[field.name]}
                  onChange={(url) => onChange(field.name, url)}
                  label={field.label}
                />
              )}
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
