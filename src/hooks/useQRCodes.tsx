import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useQRCodes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: qrCodes = [], isLoading } = useQuery({
    queryKey: ["qr_codes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("qr_codes")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newQRCode: any) => {
      const { data, error } = await supabase
        .from("qr_codes")
        .insert([newQRCode])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr_codes"] });
      toast({ title: "QR Code criado com sucesso!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar QR Code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from("qr_codes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr_codes"] });
      toast({ title: "QR Code atualizado!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar QR Code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("qr_codes")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qr_codes"] });
      toast({ title: "QR Code excluído!" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir QR Code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    qrCodes,
    isLoading,
    createQRCode: createMutation.mutate,
    updateQRCode: updateMutation.mutate,
    deleteQRCode: deleteMutation.mutate,
  };
};
