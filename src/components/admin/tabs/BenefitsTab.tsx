import { useState, useEffect } from "react";
import { useBenefits } from "@/hooks/useBenefits";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { ItemCard } from "../ItemCard";
import { ItemModal } from "../ItemModal";
import { ViewToggle } from "../ViewToggle";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const BenefitsTab = () => {
  const { benefits, isLoading, refetch } = useBenefits();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  useEffect(() => {
    const saved = localStorage.getItem("admin-view-mode-benefits");
    if (saved) setViewMode(saved as "grid" | "list");
  }, []);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("admin-view-mode-benefits", mode);
  };

  const fields = [
    { name: "description", label: "Descrição", type: "textarea" as const, required: true },
  ];

  const handleAdd = () => {
    setCurrentItem(null);
    setFormData({ description: "" });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setCurrentItem(item);
    setFormData(item);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.description) {
      toast({ title: "Erro", description: "Preencha a descrição", variant: "destructive" });
      return;
    }

    setSaving(true);
    const data = {
      description: formData.description,
      display_order: currentItem ? currentItem.display_order : (benefits.length > 0 ? Math.max(...benefits.map(b => b.display_order)) + 1 : 0),
      is_active: currentItem ? currentItem.is_active : true,
    };

    const { error } = currentItem
      ? await supabase.from("benefits").update(data).eq("id", currentItem.id)
      : await supabase.from("benefits").insert([data]);

    setSaving(false);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: currentItem ? "Vantagem atualizada" : "Vantagem adicionada" });
      setModalOpen(false);
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("benefits").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: "Vantagem excluída" });
      setDeleteDialog(null);
      refetch();
    }
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    const index = benefits.findIndex(b => b.id === id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= benefits.length) return;

    const item = benefits[index];
    const target = benefits[targetIndex];

    await Promise.all([
      supabase.from("benefits").update({ display_order: target.display_order }).eq("id", item.id),
      supabase.from("benefits").update({ display_order: item.display_order }).eq("id", target.id),
    ]);

    refetch();
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("benefits").update({ is_active: !currentStatus }).eq("id", id);
    if (!error) refetch();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gerenciar Vantagens</CardTitle>
              <CardDescription>{benefits.length} vantagens cadastradas</CardDescription>
            </div>
            <div className="flex gap-2">
              <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Carregando...</div>
          ) : benefits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhuma vantagem cadastrada</div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
              {benefits.map((benefit, index) => (
                <ItemCard
                  key={benefit.id}
                  title={benefit.description}
                  isActive={benefit.is_active}
                  isFirst={index === 0}
                  isLast={index === benefits.length - 1}
                  onEdit={() => handleEdit(benefit)}
                  onDelete={() => setDeleteDialog(benefit.id)}
                  onMoveUp={() => handleMove(benefit.id, "up")}
                  onMoveDown={() => handleMove(benefit.id, "down")}
                  onToggleActive={() => handleToggleActive(benefit.id, benefit.is_active)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ItemModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={currentItem ? "Editar Vantagem" : "Adicionar Vantagem"}
        fields={fields}
        values={formData}
        onChange={(name, value) => setFormData({ ...formData, [name]: value })}
        onSave={handleSave}
        isLoading={saving}
      />

      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta vantagem? Esta ação não pode ser desfeita.
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
