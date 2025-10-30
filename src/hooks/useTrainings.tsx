import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Training {
  id: string;
  emoji: string;
  title: string;
  subtitle: string | null;
  description: string;
  display_order: number;
  is_active: boolean;
}

export const useTrainings = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTrainings = async () => {
    const { data, error } = await supabase
      .from("trainings")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (!error && data) {
      setTrainings(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadTrainings();

    const channel = supabase
      .channel("trainings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trainings",
        },
        () => {
          loadTrainings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { trainings, isLoading, refetch: loadTrainings };
};
