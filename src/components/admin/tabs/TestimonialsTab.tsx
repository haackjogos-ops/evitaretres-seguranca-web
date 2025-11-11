import { useState } from "react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/admin/ItemCard";
import { ItemModal } from "@/components/admin/ItemModal";
import { Plus } from "lucide-react";

const TestimonialsTab = () => {
  const { testimonials, isLoading, createTestimonial, updateTestimonial, deleteTestimonial } =
    useTestimonials();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
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
    return <div>Carregando depoimentos...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Depoimentos</h2>
        <Button onClick={handleOpenNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Depoimento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((item) => (
          <ItemCard
            key={item.id}
            title={item.name}
            subtitle={item.company || undefined}
            description={item.content}
            icon="⭐"
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
            isActive={item.is_active}
          />
        ))}
      </div>

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
          { name: "display_order", label: "Ordem de Exibição", type: "text" },
        ]}
        values={formValues}
        onChange={(field, value) => setFormValues({ ...formValues, [field]: value })}
        onSave={handleSave}
      />
    </div>
  );
};

export default TestimonialsTab;
