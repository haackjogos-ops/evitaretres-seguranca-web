import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MedicineService {
  id: string;
  section_type: string;
  title: string;
  display_order: number;
  is_active: boolean;
}

export const useMedicineServices = () => {
  const [documents, setDocuments] = useState<MedicineService[]>([]);
  const [exams, setExams] = useState<MedicineService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadServices = async () => {
    const { data, error } = await supabase
      .from("medicine_services")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (!error && data) {
      setDocuments(data.filter(s => s.section_type === 'document'));
      setExams(data.filter(s => s.section_type === 'exam'));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadServices();

    const channel = supabase
      .channel("medicine_services_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "medicine_services",
        },
        () => {
          loadServices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { documents, exams, isLoading, refetch: loadServices };
};
