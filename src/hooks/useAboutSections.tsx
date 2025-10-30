import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AboutSection {
  id: string;
  section_key: string;
  title: string;
  description: string;
  icon_name: string;
  display_order: number;
}

export const useAboutSections = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSections = async () => {
    const { data, error } = await supabase
      .from("about_sections")
      .select("*")
      .order("display_order");

    if (!error && data) {
      setSections(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadSections();

    const channel = supabase
      .channel("about_sections_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "about_sections",
        },
        () => {
          loadSections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { sections, isLoading, refetch: loadSections };
};
