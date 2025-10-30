import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PageContent {
  id: string;
  page_key: string;
  title: string;
  subtitle: string | null;
  content: any;
}

export const usePageContent = (pageKey: string) => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadContent = async () => {
    const { data, error } = await supabase
      .from("pages_content")
      .select("*")
      .eq("page_key", pageKey)
      .single();

    if (!error && data) {
      setContent(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadContent();

    const channel = supabase
      .channel(`pages_content_${pageKey}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pages_content",
          filter: `page_key=eq.${pageKey}`,
        },
        () => {
          loadContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pageKey]);

  return { content, isLoading, refetch: loadContent };
};
