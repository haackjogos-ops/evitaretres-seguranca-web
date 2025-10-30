import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, GripVertical } from "lucide-react";

interface EditableItem {
  id: string;
  [key: string]: any;
}

interface ContentEditorProps {
  tableName: string;
  title: string;
  fields: { name: string; label: string; type?: string }[];
  onRefresh?: () => void;
}

export const ContentEditor = ({ tableName, title, fields, onRefresh }: ContentEditorProps) => {
  const [items, setItems] = useState<EditableItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  const loadItems = async () => {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setItems(data);
    }
  };

  useEffect(() => {
    loadItems();
  }, [tableName]);

  const handleSave = async () => {
    const { error } = editingId
      ? await supabase.from(tableName).update(formData).eq("id", editingId)
      : await supabase.from(tableName).insert([{ ...formData, display_order: items.length }]);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Salvo com sucesso!" });
      setEditingId(null);
      setFormData({});
      loadItems();
      onRefresh?.();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const { error } = await supabase.from(tableName).delete().eq("id", id);

    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Excluído com sucesso!" });
      loadItems();
      onRefresh?.();
    }
  };

  const handleEdit = (item: EditableItem) => {
    setEditingId(item.id);
    setFormData(item);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form */}
        <div className="border rounded-lg p-4 space-y-3">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  value={formData[field.name] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  placeholder={field.label}
                />
              ) : (
                <Input
                  value={formData[field.name] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  placeholder={field.label}
                />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <Button onClick={handleSave}>{editingId ? "Atualizar" : "Adicionar"}</Button>
            {editingId && (
              <Button variant="outline" onClick={() => { setEditingId(null); setFormData({}); }}>
                Cancelar
              </Button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-accent/50">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{item.title || item.description?.substring(0, 50)}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>Editar</Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
