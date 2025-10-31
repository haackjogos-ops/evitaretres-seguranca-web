import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MonitoringService {
  id: string;
  icon: string;
  logo_url?: string | null;
  logo_size?: string;
  title: string;
  subtitle: string | null;
  description: string;
  display_order: number;
  is_active: boolean;
}

export const useMonitoringServices = () => {
  const [services, setServices] = useState<MonitoringService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadServices = async () => {
    const { data, error } = await supabase
      .from("monitoring_services")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (!error && data) {
      setServices(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadServices();

    const channel = supabase
      .channel("monitoring_services_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "monitoring_services",
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

  return { services, isLoading, refetch: loadServices };
};
