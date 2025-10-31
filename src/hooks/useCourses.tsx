import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Course {
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

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCourses = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (!error && data) {
      setCourses(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCourses();

    const channel = supabase
      .channel("courses_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "courses",
        },
        () => {
          loadCourses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { courses, isLoading, refetch: loadCourses };
};
