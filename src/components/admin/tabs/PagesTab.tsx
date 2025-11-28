import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAllPagesContent } from "@/hooks/useAllPagesContent";
import { 
  Home, Info, Stethoscope, BookOpen, GraduationCap, 
  Award, Activity, Phone, FileEdit, Save, Loader2, Plus 
} from "lucide-react";

const PAGE_CONFIG = [
  { key: "home", label: "Página Inicial", icon: Home },
  { key: "about", label: "Sobre", icon: Info },
  { key: "medicine", label: "Medicina", icon: Stethoscope },
  { key: "courses", label: "Cursos", icon: BookOpen },
  { key: "trainings", label: "Treinamentos", icon: GraduationCap },
  { key: "benefits", label: "Vantagens", icon: Award },
  { key: "monitoring", label: "Monitoramento", icon: Activity },
  { key: "contact", label: "Contato", icon: Phone },
];

const PagesTab = () => {
  const { pages, isLoading, updatePage, createPage } = useAllPagesContent();
  const [editData, setEditData] = useState<Record<string, { title: string; subtitle: string }>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const data: Record<string, { title: string; subtitle: string }> = {};
    pages.forEach((page) => {
      data[page.page_key] = {
        title: page.title,
        subtitle: page.subtitle || "",
      };
    });
    
    // Initialize missing pages with empty values
    PAGE_CONFIG.forEach((config) => {
      if (!data[config.key]) {
        data[config.key] = { title: "", subtitle: "" };
      }
    });
    
    setEditData(data);
  }, [pages]);

  const handleSave = async (pageKey: string) => {
    const data = editData[pageKey];
    if (!data) return;

    setSaving(pageKey);
    
    const existingPage = pages.find((p) => p.page_key === pageKey);
    
    if (existingPage) {
      await updatePage(existingPage.id, data.title, data.subtitle || null);
    } else {
      await createPage(pageKey, data.title, data.subtitle || null);
    }
    
    setSaving(null);
  };

  const handleChange = (pageKey: string, field: "title" | "subtitle", value: string) => {
    setEditData((prev) => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [field]: value,
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileEdit className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Gerenciar Títulos das Páginas</h2>
      </div>

      <div className="grid gap-4">
        {PAGE_CONFIG.map((config) => {
          const Icon = config.icon;
          const data = editData[config.key] || { title: "", subtitle: "" };
          const existingPage = pages.find((p) => p.page_key === config.key);
          const isSaving = saving === config.key;

          return (
            <Card key={config.key}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="h-5 w-5 text-primary" />
                  {config.label}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({config.key})
                  </span>
                  {!existingPage && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Não configurado
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${config.key}`}>Título</Label>
                    <Input
                      id={`title-${config.key}`}
                      value={data.title}
                      onChange={(e) => handleChange(config.key, "title", e.target.value)}
                      placeholder="Digite o título da página"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`subtitle-${config.key}`}>Subtítulo</Label>
                    <Input
                      id={`subtitle-${config.key}`}
                      value={data.subtitle}
                      onChange={(e) => handleChange(config.key, "subtitle", e.target.value)}
                      placeholder="Digite o subtítulo da página"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleSave(config.key)}
                    disabled={isSaving || !data.title}
                    size="sm"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : existingPage ? (
                      <Save className="h-4 w-4 mr-2" />
                    ) : (
                      <Plus className="h-4 w-4 mr-2" />
                    )}
                    {existingPage ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PagesTab;
