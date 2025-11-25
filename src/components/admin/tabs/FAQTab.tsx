import { useState, useEffect } from "react";
import { useFAQ } from "@/hooks/useFAQ";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ItemCard } from "@/components/admin/ItemCard";
import { ItemModal } from "@/components/admin/ItemModal";
import { ViewToggle } from "../ViewToggle";

export const FAQTab = () => {
  const { faqItems, isLoading, createFAQItem, updateFAQItem, deleteFAQItem } = useFAQ();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [formValues, setFormValues] = useState({
    question: "",
    answer: "",
    category: "geral",
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("admin-view-mode-faq");
    if (saved) setViewMode(saved as "grid" | "list");
  }, []);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("admin-view-mode-faq", mode);
  };

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
    return <div className="text-center py-8 text-muted-foreground">Carregando perguntas...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
              <CardDescription>{faqItems.length} perguntas cadastradas</CardDescription>
            </div>
            <div className="flex gap-2">
              <ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
              <Button onClick={handleOpenNew}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Pergunta
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {faqItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma pergunta cadastrada ainda.
            </div>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
              {faqItems.map((item) => (
                <ItemCard
                  key={item.id}
                  emoji="❓"
                  title={item.question}
                  subtitle={item.category}
                  description={item.answer}
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
        ]}
        values={formValues}
        onChange={(field, value) => setFormValues({ ...formValues, [field]: value })}
        onSave={handleSave}
      />
    </>
  );
};

export default FAQTab;
