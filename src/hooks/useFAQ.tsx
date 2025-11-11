import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useFAQ = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: faqItems = [], isLoading } = useQuery({
    queryKey: ["faq_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faq_items")
        .select("*")
        .order("category", { ascending: true })
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as FAQItem[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (faqItem: Omit<FAQItem, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("faq_items")
        .insert([faqItem])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq_items"] });
      toast({
        title: "Pergunta adicionada",
        description: "A pergunta foi criada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar pergunta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FAQItem> & { id: string }) => {
      const { data, error } = await supabase
        .from("faq_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq_items"] });
      toast({
        title: "Pergunta atualizada",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("faq_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faq_items"] });
      toast({
        title: "Pergunta excluída",
        description: "A pergunta foi removida com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    faqItems,
    isLoading,
    createFAQItem: createMutation.mutate,
    updateFAQItem: updateMutation.mutate,
    deleteFAQItem: deleteMutation.mutate,
  };
};
