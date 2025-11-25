import { useState, useEffect } from "react";
import { useMonitoringServices } from "@/hooks/useMonitoringServices";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { ItemCard } from "../ItemCard";
import { ItemModal } from "../ItemModal";
import { ViewToggle } from "../ViewToggle";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const MonitoringTab = () => {
  const { services, isLoading, refetch } = useMonitoringServices();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  useEffect(() => {
    const saved = localStorage.getItem("admin-view-mode-monitoring");
    if (saved) setViewMode(saved as "grid" | "list");
  }, []);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("admin-view-mode-monitoring", mode);
  };

  const fields = [
    { name: "logo_url", label: "Logo/Imagem (opcional)", type: "image" as const },
    { 
      name: "logo_size", 
      label: "Tamanho da Logo", 
      type: "select" as const,
      options: [
        { value: "small", label: "Pequeno" },
        { value: "medium", label: "Médio" },
        { value: "large", label: "Grande" }
      ]
    },
    { name: "icon", label: "Ícone (usado se não houver logo)", type: "icon" as const, required: true },
    { name: "title", label: "Título", type: "text" as const, required: true },
    { name: "subtitle", label: "Subtítulo", type: "text" as const },
    { name: "description", label: "Descrição", type: "textarea" as const, required: true },
  ];

  const handleAdd = () => {
    setCurrentItem(null);
    setFormData({ icon: "Star", title: "", subtitle: "", description: "" });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setCurrentItem(item);
    setFormData(item);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast({ title: "Erro", description: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    setSaving(true);
    const data = {
      icon: formData.icon || "Star",
      logo_url: formData.logo_url || null,
      logo_size: formData.logo_size || "small",
      title: formData.title,
      subtitle: formData.subtitle || null,
      description: formData.description,
      display_order: currentItem ? currentItem.display_order : (services.length > 0 ? Math.max(...services.map(s => s.display_order)) + 1 : 0),
      is_active: currentItem ? currentItem.is_active : true,
    };

    const { error } = currentItem
      ? await supabase.from("monitoring_services").update(data).eq("id", currentItem.id)
      : await supabase.from("monitoring_services").insert([data]);

    setSaving(false);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: currentItem ? "Serviço atualizado" : "Serviço adicionado" });
      setModalOpen(false);
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("monitoring_services").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: "Serviço excluído" });
      setDeleteDialog(null);
      refetch();
    }
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    const index = services.findIndex(s => s.id === id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const item = services[index];
    const target = services[targetIndex];

    await Promise.all([
      supabase.from("monitoring_services").update({ display_order: target.display_order }).eq("id", item.id),
      supabase.from("monitoring_services").update({ display_order: item.display_order }).eq("id", target.id),
    ]);

    refetch();
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("monitoring_services").update({ is_active: !currentStatus }).eq("id", id);
    if (!error) refetch();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gerenciar Serviços de Monitoramento</CardTitle>
              <CardDescription>{services.length} serviços cadastrados</CardDescription>
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
          ) : services.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Nenhum serviço cadastrado</div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
              {services.map((service, index) => (
                <ItemCard
                  key={service.id}
                  logoUrl={service.logo_url || undefined}
                  icon={service.icon}
                  title={service.title}
                  subtitle={service.subtitle || undefined}
                  description={service.description}
                  isActive={service.is_active}
                  isFirst={index === 0}
                  isLast={index === services.length - 1}
                  onEdit={() => handleEdit(service)}
                  onDelete={() => setDeleteDialog(service.id)}
                  onMoveUp={() => handleMove(service.id, "up")}
                  onMoveDown={() => handleMove(service.id, "down")}
                  onToggleActive={() => handleToggleActive(service.id, service.is_active)}
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
        title={currentItem ? "Editar Serviço" : "Adicionar Serviço"}
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
              Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.
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
