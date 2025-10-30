import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Benefit {
  id: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

export const useBenefits = () => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBenefits = async () => {
    const { data, error } = await supabase
      .from("benefits")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (!error && data) {
      setBenefits(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadBenefits();

    const channel = supabase
      .channel("benefits_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "benefits",
        },
        () => {
          loadBenefits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { benefits, isLoading, refetch: loadBenefits };
};
