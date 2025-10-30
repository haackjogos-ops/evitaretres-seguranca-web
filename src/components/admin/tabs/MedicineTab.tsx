import { useState } from "react";
import { useMedicineServices } from "@/hooks/useMedicineServices";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { ItemCard } from "../ItemCard";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const MedicineTab = () => {
  const { documents, exams, isLoading, refetch } = useMedicineServices();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const handleAdd = (type: "document" | "exam") => {
    setCurrentItem(null);
    setFormData({ title: "", section_type: type });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setCurrentItem(item);
    setFormData(item);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast({ title: "Erro", description: "Preencha o título", variant: "destructive" });
      return;
    }

    setSaving(true);
    const allItems = formData.section_type === "document" ? documents : exams;
    const data = {
      title: formData.title,
      section_type: formData.section_type,
      display_order: currentItem ? currentItem.display_order : (allItems.length > 0 ? Math.max(...allItems.map(i => i.display_order)) + 1 : 0),
      is_active: currentItem ? currentItem.is_active : true,
    };

    const { error } = currentItem
      ? await supabase.from("medicine_services").update(data).eq("id", currentItem.id)
      : await supabase.from("medicine_services").insert([data]);

    setSaving(false);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: currentItem ? "Item atualizado" : "Item adicionado" });
      setModalOpen(false);
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("medicine_services").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: "Item excluído" });
      setDeleteDialog(null);
      refetch();
    }
  };

  const handleMove = async (id: string, direction: "up" | "down", items: any[]) => {
    const index = items.findIndex(i => i.id === id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const item = items[index];
    const target = items[targetIndex];

    await Promise.all([
      supabase.from("medicine_services").update({ display_order: target.display_order }).eq("id", item.id),
      supabase.from("medicine_services").update({ display_order: item.display_order }).eq("id", target.id),
    ]);

    refetch();
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("medicine_services").update({ is_active: !currentStatus }).eq("id", id);
    if (!error) refetch();
  };

  const renderSection = (items: any[], title: string, type: "document" | "exam") => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{items.length} itens cadastrados</CardDescription>
          </div>
          <Button onClick={() => handleAdd(type)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Nenhum item cadastrado</div>
        ) : (
          <div className="space-y-2">
            {items.map((item, index) => (
              <ItemCard
                key={item.id}
                title={item.title}
                isActive={item.is_active}
                isFirst={index === 0}
                isLast={index === items.length - 1}
                onEdit={() => handleEdit(item)}
                onDelete={() => setDeleteDialog(item.id)}
                onMoveUp={() => handleMove(item.id, "up", items)}
                onMoveDown={() => handleMove(item.id, "down", items)}
                onToggleActive={() => handleToggleActive(item.id, item.is_active)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Carregando...</div>
      ) : (
        <div className="space-y-4">
          {renderSection(documents, "Documentos", "document")}
          {renderSection(exams, "Exames", "exam")}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentItem ? "Editar Item" : "Adicionar Item"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={formData.section_type}
                onValueChange={(value) => setFormData({ ...formData, section_type: value })}
                disabled={!!currentItem}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Documento</SelectItem>
                  <SelectItem value="exam">Exame</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteDialog && handleDelete(deleteDialog)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
