import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMenuItems } from "@/hooks/useMenuItems";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Menu } from "lucide-react";
import { ItemCard } from "../ItemCard";
import { ItemModal } from "../ItemModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

export const MenuTab = () => {
  const { menuItems, refetch } = useMenuItems();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState({ label: "", path: "" });
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setCurrentItem(null);
    setFormData({ label: "", path: "" });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setCurrentItem(item);
    setFormData({ label: item.label, path: item.path });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.label || !formData.path) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    if (currentItem) {
      const { error } = await supabase
        .from("menu_items")
        .update({
          label: formData.label,
          path: formData.path,
        })
        .eq("id", currentItem.id);

      if (error) {
        toast({
          title: "Erro ao atualizar",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Item atualizado com sucesso!" });
        setModalOpen(false);
        refetch();
      }
    } else {
      const maxOrder = menuItems.length > 0 
        ? Math.max(...menuItems.map(i => i.display_order)) 
        : -1;

      const { error } = await supabase.from("menu_items").insert({
        label: formData.label,
        path: formData.path,
        display_order: maxOrder + 1,
      });

      if (error) {
        toast({
          title: "Erro ao criar",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Item criado com sucesso!" });
        setModalOpen(false);
        refetch();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Item excluído com sucesso!" });
      refetch();
    }
    setDeleteDialog(null);
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    const currentIndex = menuItems.findIndex((item) => item.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === menuItems.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const currentItem = menuItems[currentIndex];
    const targetItem = menuItems[targetIndex];

    await supabase
      .from("menu_items")
      .update({ display_order: targetItem.display_order })
      .eq("id", currentItem.id);

    await supabase
      .from("menu_items")
      .update({ display_order: currentItem.display_order })
      .eq("id", targetItem.id);

    refetch();
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("menu_items")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: !currentStatus ? "Item ativado" : "Item desativado",
      });
      refetch();
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Menu className="h-5 w-5 text-primary" />
                Gerenciar Menu
              </CardTitle>
              <CardDescription className="mt-1">
                Configure os itens do menu de navegação
              </CardDescription>
            </div>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <ItemCard
                key={item.id}
                title={item.label}
                subtitle={item.path}
                isActive={item.is_active}
                onEdit={() => handleEdit(item)}
                onDelete={() => setDeleteDialog(item.id)}
                onMoveUp={index > 0 ? () => handleMove(item.id, "up") : undefined}
                onMoveDown={
                  index < menuItems.length - 1
                    ? () => handleMove(item.id, "down")
                    : undefined
                }
                onToggleActive={() => handleToggleActive(item.id, item.is_active)}
              />
            ))}
            {menuItems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum item de menu cadastrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ItemModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={currentItem ? "Editar Item do Menu" : "Novo Item do Menu"}
        onSave={handleSave}
        isLoading={saving}
        values={formData}
        onChange={(name, value) => setFormData({ ...formData, [name]: value })}
        fields={[
          {
            name: "label",
            label: "Nome do Item",
            type: "text",
            required: true,
          },
          {
            name: "path",
            label: "Caminho (URL)",
            type: "text",
            required: true,
          },
        ]}
      />

      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este item do menu? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
