import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Certificate {
  id: string;
  student_name: string;
  course_type: string;
  course_name: string;
  course_norm: string;
  course_hours: string;
  course_date: string;
  issue_date: string;
  archive_code: string;
  registration_number: string;
  issue_location: string;
  pdf_url: string | null;
  qr_code_url: string | null;
  course_logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCertificates = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("is_active", true)
        .order("student_name", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Certificate[];
    },
  });

  // Agrupar certificados por nome do aluno
  const groupedCertificates = certificates?.reduce((acc, cert) => {
    const studentName = cert.student_name;
    if (!acc[studentName]) {
      acc[studentName] = [];
    }
    acc[studentName].push(cert);
    return acc;
  }, {} as Record<string, Certificate[]>) || {};

  const createMutation = useMutation({
    mutationFn: async (certificate: any) => {
      const { data, error } = await supabase
        .from("certificates")
        .insert([certificate])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast({
        title: "Certificado criado",
        description: "O certificado foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar certificado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Certificate> & { id: string }) => {
      const { data, error } = await supabase
        .from("certificates")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast({
        title: "Certificado atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar certificado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Debug: verificar usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Tentando excluir certificado:", id);
      console.log("Usuário atual:", user?.id);
      
      // Debug: verificar se usuário tem role admin
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user?.id);
      console.log("Roles do usuário:", roles, rolesError);

      const { error } = await supabase
        .from("certificates")
        .update({ is_active: false })
        .eq("id", id);

      console.log("Resultado da exclusão:", error);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificates"] });
      toast({
        title: "Certificado excluído",
        description: "O certificado foi removido com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir certificado",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    certificates,
    groupedCertificates,
    isLoading,
    createCertificate: createMutation.mutateAsync,
    updateCertificate: updateMutation.mutateAsync,
    deleteCertificate: deleteMutation.mutateAsync,
  };
};
