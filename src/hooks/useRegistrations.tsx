import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Registration {
  id: string;
  name: string;
  company: string | null;
  cnpj: string | null;
  email: string;
  phone: string;
  service_type: string;
  message: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const useRegistrations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Registration[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (registration: Omit<Registration, "id" | "status" | "created_at" | "updated_at" | "notes">) => {
      const { data, error } = await supabase
        .from("registrations")
        .insert([registration])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      toast({
        title: "Inscrição enviada!",
        description: "Recebemos sua inscrição. Nossa equipe entrará em contato em breve.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar inscrição",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Registration> & { id: string }) => {
      const { data, error } = await supabase
        .from("registrations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      toast({
        title: "Inscrição atualizada",
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
        .from("registrations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      toast({
        title: "Inscrição excluída",
        description: "A inscrição foi removida com sucesso.",
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
    registrations,
    isLoading,
    createRegistration: createMutation.mutate,
    updateRegistration: updateMutation.mutate,
    deleteRegistration: deleteMutation.mutate,
    isCreating: createMutation.isPending,
  };
};
