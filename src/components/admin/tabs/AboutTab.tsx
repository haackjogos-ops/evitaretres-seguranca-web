import { useState } from "react";
import { useAboutSections } from "@/hooks/useAboutSections";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export const AboutTab = () => {
  const { sections, isLoading, refetch } = useAboutSections();
  const { toast } = useToast();
  const [editingSections, setEditingSections] = useState<Record<string, any>>({});

  const handleChange = (sectionKey: string, field: string, value: string) => {
    setEditingSections(prev => ({
      ...prev,
      [sectionKey]: {
        ...(prev[sectionKey] || sections.find(s => s.section_key === sectionKey)),
        [field]: value,
      }
    }));
  };

  const handleSave = async (sectionKey: string) => {
    const data = editingSections[sectionKey];
    if (!data) return;

    const { error } = await supabase
      .from("about_sections")
      .update({
        title: data.title,
        description: data.description,
        icon_name: data.icon_name,
      })
      .eq("section_key", sectionKey);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: "Seção atualizada" });
      setEditingSections(prev => {
        const newState = { ...prev };
        delete newState[sectionKey];
        return newState;
      });
      refetch();
    }
  };

  const getSectionData = (sectionKey: string) => {
    return editingSections[sectionKey] || sections.find(s => s.section_key === sectionKey);
  };

  const sectionKeys = ["mission", "vision", "values", "differential"];
  const sectionLabels = {
    mission: "Missão",
    vision: "Visão",
    values: "Valores",
    differential: "Diferencial",
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Carregando...</div>
      ) : (
        sectionKeys.map((key) => {
          const section = getSectionData(key);
          if (!section) return null;

          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle>{sectionLabels[key as keyof typeof sectionLabels]}</CardTitle>
                <CardDescription>Configure esta seção da página Sobre Nós</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Ícone (Lucide)</Label>
                  <Input
                    value={section.icon_name || ""}
                    onChange={(e) => handleChange(key, "icon_name", e.target.value)}
                    placeholder="Target"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={section.title || ""}
                    onChange={(e) => handleChange(key, "title", e.target.value)}
                    placeholder="Digite o título"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={section.description || ""}
                    onChange={(e) => handleChange(key, "description", e.target.value)}
                    placeholder="Digite a descrição"
                    rows={4}
                  />
                </div>
                <Button onClick={() => handleSave(key)} disabled={!editingSections[key]}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};
