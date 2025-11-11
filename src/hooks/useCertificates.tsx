import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCertificates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newCertificate: any) => {
      const { data, error } = await supabase
        .from("certificates")
        .insert([newCertificate])
        .select()
        .single();
      
      if (error) throw error;

      // Generate certificate PDF
      const { error: functionError } = await supabase.functions.invoke('generate-certificate', {
        body: { certificateId: data.id }
      });

      if (functionError) {
        console.error('Error generating PDF:', functionError);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast({ title: "Certificado criado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar certificado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("certificates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;

      // Regenerate PDF if needed
      if (updates.student_name || updates.course_name) {
        await supabase.functions.invoke('generate-certificate', {
          body: { certificateId: id }
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast({ title: "Certificado atualizado!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar certificado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast({ title: "Certificado excluído!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir certificado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    certificates,
    isLoading,
    createCertificate: createMutation.mutate,
    updateCertificate: updateMutation.mutate,
    deleteCertificate: deleteMutation.mutate,
  };
};