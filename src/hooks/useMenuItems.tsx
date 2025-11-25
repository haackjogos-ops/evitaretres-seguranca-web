import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  id: string;
  label: string;
  path: string;
  display_order: number;
  is_active: boolean;
}

export const useMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMenuItems = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (!error && data) {
      setMenuItems(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadMenuItems();

    const channel = supabase
      .channel("menu_items_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_items",
        },
        () => {
          loadMenuItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { menuItems, isLoading, refetch: loadMenuItems };
};
