import { useState, useEffect } from "react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ItemCard } from "@/components/admin/ItemCard";
import { ItemModal } from "@/components/admin/ItemModal";
import { ViewToggle } from "../ViewToggle";

export const TestimonialsTab = () => {
  const { testimonials, isLoading, createTestimonial, updateTestimonial, deleteTestimonial } =
    useTestimonials();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [formValues, setFormValues] = useState({
    name: "",
    company: "",
    position: "",
    avatar_url: "",
    content: "",
    rating: 5,
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("admin-view-mode-testimonials");
    if (saved) setViewMode(saved as "grid" | "list");
  }, []);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("admin-view-mode-testimonials", mode);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormValues(item);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este depoimento?")) {
      deleteTestimonial(id);
    }
  };

  const handleSave = () => {
    if (editingItem) {
      updateTestimonial({ id: editingItem.id, ...formValues });
    } else {
      createTestimonial(formValues);
    }
    setModalOpen(false);
    setEditingItem(null);
    setFormValues({
      name: "",
      company: "",
      position: "",
      avatar_url: "",
      content: "",
      rating: 5,
      is_active: true,
      display_order: 0,
    });
  };

  const handleOpenNew = () => {
    setEditingItem(null);
    setFormValues({
      name: "",
      company: "",
      position: "",
      avatar_url: "",
      content: "",
      rating: 5,
      is_active: true,
      display_order: 0,
    });
    setModalOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando depoimentos...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Depoimentos</CardTitle>
              <CardDescription>{testimonials.length} depoimentos cadastrados</CardDescription>
            </div>
            <div className="flex gap-2">
              <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              <Button onClick={handleOpenNew}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Depoimento
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {testimonials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum depoimento cadastrado ainda.
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
              {testimonials.map((item) => (
                <ItemCard
                  key={item.id}
                  emoji="⭐"
                  title={item.name}
                  subtitle={item.company ? `${item.position || ""} - ${item.company}` : item.position}
                  description={item.content}
                  isActive={item.is_active}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDelete(item.id)}
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
        title={editingItem ? "Editar Depoimento" : "Novo Depoimento"}
        fields={[
          { name: "name", label: "Nome", type: "text", required: true },
          { name: "company", label: "Empresa", type: "text" },
          { name: "position", label: "Cargo", type: "text" },
          { name: "avatar_url", label: "URL do Avatar", type: "text" },
          { name: "content", label: "Depoimento", type: "textarea", required: true },
          {
            name: "rating",
            label: "Avaliação",
            type: "select",
            required: true,
            options: [
              { value: "1", label: "1 Estrela" },
              { value: "2", label: "2 Estrelas" },
              { value: "3", label: "3 Estrelas" },
              { value: "4", label: "4 Estrelas" },
              { value: "5", label: "5 Estrelas" },
            ],
          },
        ]}
        values={formValues}
        onChange={(field, value) => setFormValues({ ...formValues, [field]: value })}
        onSave={handleSave}
      />
    </>
  );
};

export default TestimonialsTab;
