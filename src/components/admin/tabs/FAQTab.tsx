import { useState } from "react";
import { useFAQ } from "@/hooks/useFAQ";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/admin/ItemCard";
import { ItemModal } from "@/components/admin/ItemModal";
import { Plus } from "lucide-react";

const FAQTab = () => {
  const { faqItems, isLoading, createFAQItem, updateFAQItem, deleteFAQItem } = useFAQ();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formValues, setFormValues] = useState({
    question: "",
    answer: "",
    category: "geral",
    is_active: true,
    display_order: 0,
  });

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormValues(item);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta pergunta?")) {
      deleteFAQItem(id);
    }
  };

  const handleSave = () => {
    if (editingItem) {
      updateFAQItem({ id: editingItem.id, ...formValues });
    } else {
      createFAQItem(formValues);
    }
    setModalOpen(false);
    setEditingItem(null);
    setFormValues({
      question: "",
      answer: "",
      category: "geral",
      is_active: true,
      display_order: 0,
    });
  };

  const handleOpenNew = () => {
    setEditingItem(null);
    setFormValues({
      question: "",
      answer: "",
      category: "geral",
      is_active: true,
      display_order: 0,
    });
    setModalOpen(true);
  };

  if (isLoading) {
    return <div>Carregando perguntas...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Perguntas Frequentes (FAQ)</h2>
        <Button onClick={handleOpenNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Pergunta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqItems.map((item) => (
          <ItemCard
            key={item.id}
            title={item.question}
            subtitle={item.category}
            description={item.answer}
            icon="❓"
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item.id)}
            isActive={item.is_active}
          />
        ))}
      </div>

      <ItemModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingItem ? "Editar Pergunta" : "Nova Pergunta"}
        fields={[
          { name: "question", label: "Pergunta", type: "text", required: true },
          { name: "answer", label: "Resposta", type: "textarea", required: true },
          {
            name: "category",
            label: "Categoria",
            type: "select",
            required: true,
            options: [
              { value: "geral", label: "Geral" },
              { value: "treinamento", label: "Treinamento" },
              { value: "curso", label: "Curso" },
              { value: "monitoramento", label: "Monitoramento" },
              { value: "medicina", label: "Medicina do Trabalho" },
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

export default FAQTab;
