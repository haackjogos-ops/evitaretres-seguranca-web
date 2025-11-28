import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PageContent {
  id: string;
  page_key: string;
  title: string;
  subtitle: string | null;
  content: any;
}

export const useAllPagesContent = () => {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadPages = async () => {
    const { data, error } = await supabase
      .from("pages_content")
      .select("*")
      .order("page_key");

    if (error) {
      console.error("Erro ao carregar páginas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as páginas",
        variant: "destructive",
      });
    } else {
      setPages(data || []);
    }
    setIsLoading(false);
  };

  const updatePage = async (id: string, title: string, subtitle: string | null) => {
    const { error } = await supabase
      .from("pages_content")
      .update({ title, subtitle })
      .eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Sucesso",
      description: "Página atualizada com sucesso",
    });
    return true;
  };

  const createPage = async (page_key: string, title: string, subtitle: string | null) => {
    const { error } = await supabase
      .from("pages_content")
      .insert({ page_key, title, subtitle });

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a página",
        variant: "destructive",
      });
      return false;
    }

    await loadPages();
    toast({
      title: "Sucesso",
      description: "Página criada com sucesso",
    });
    return true;
  };

  useEffect(() => {
    loadPages();

    const channel = supabase
      .channel("pages_content_all")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pages_content",
        },
        () => {
          loadPages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { pages, isLoading, updatePage, createPage, refetch: loadPages };
};
