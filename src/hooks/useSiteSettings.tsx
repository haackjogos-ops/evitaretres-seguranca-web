import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  contact?: {
    phone: string;
    email: string;
    whatsapp: string;
    instagram: string;
    facebook: string;
    address: string;
  };
  branding?: {
    siteName: string;
    tagline: string;
    logoUrl: string | null;
  };
  heroSection?: {
    title: string;
    subtitle: string;
    ctaText: string;
    bannerUrl: string | null;
  };
}

export const useSiteSettings = () => {
  // Carregar do localStorage primeiro (cache local)
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const cached = localStorage.getItem('site_settings');
    return cached ? JSON.parse(cached) : {};
  });
  const [isLoading, setIsLoading] = useState(() => {
    const cached = localStorage.getItem('site_settings');
    return !cached; // Só mostra loading se não tiver cache
  });

  const loadSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (!error && data) {
      const settingsObj: any = {};
      data.forEach((item) => {
        settingsObj[item.key] = item.value;
      });
      
      // Salvar no localStorage para cache
      localStorage.setItem('site_settings', JSON.stringify(settingsObj));
      setSettings(settingsObj);
      
      // Apply colors to CSS variables
      if (settingsObj.colors) {
        const root = document.documentElement;
        Object.entries(settingsObj.colors).forEach(([key, value]) => {
          root.style.setProperty(`--${key}`, value as string);
        });
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadSettings();

    // Subscribe to changes
    const channel = supabase
      .channel("site_settings_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
        },
        () => {
          loadSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, isLoading, refetch: loadSettings };
};
