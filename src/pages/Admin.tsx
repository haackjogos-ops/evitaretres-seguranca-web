import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import Header from "@/components/Header";

const Admin = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const { settings, refetch } = useSiteSettings();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [colors, setColors] = useState({
    primary: "",
    secondary: "",
    accent: "",
    background: "",
    foreground: "",
  });

  const [contact, setContact] = useState({
    phone: "",
    email: "",
    whatsapp: "",
    instagram: "",
    facebook: "",
    address: "",
  });

  const [branding, setBranding] = useState({
    siteName: "",
    tagline: "",
    logoUrl: "",
  });

  const [heroSection, setHeroSection] = useState({
    title: "",
    subtitle: "",
    ctaText: "",
    bannerUrl: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate("/auth");
    }
  }, [user, isAdmin, isLoading, navigate]);

  useEffect(() => {
    if (settings.colors) setColors(settings.colors);
    if (settings.contact) setContact(settings.contact);
    if (settings.branding) setBranding({ ...settings.branding, logoUrl: settings.branding.logoUrl || "" });
    if (settings.heroSection) setHeroSection({ ...settings.heroSection, bannerUrl: settings.heroSection.bannerUrl || "" });
  }, [settings]);

  const updateSetting = async (key: string, value: any) => {
    const { error } = await supabase
      .from("site_settings")
      .update({ value })
      .eq("key", key);

    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Atualizado com sucesso!",
        description: `${key} foi atualizado.`,
      });
      refetch();
    }
  };

  const uploadFile = async (file: File, folder: string) => {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Math.random()}.${fileExt}`;

    const { error: uploadError, data } = await supabase.storage
      .from('site-assets')
      .upload(fileName, file, {
        upsert: true,
      });

    setUploading(false);

    if (uploadError) {
      toast({
        title: "Erro ao fazer upload",
        description: uploadError.message,
        variant: "destructive",
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('site-assets')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, 'logos');
    if (url) {
      setBranding({ ...branding, logoUrl: url });
      toast({
        title: "Logo carregada!",
        description: "Não esqueça de salvar as alterações.",
      });
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, 'banners');
    if (url) {
      setHeroSection({ ...heroSection, bannerUrl: url });
      toast({
        title: "Banner carregado!",
        description: "Não esqueça de salvar as alterações.",
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Painel Administrativo</h1>
          <Button onClick={signOut} variant="outline">
            Sair
          </Button>
        </div>

        <Tabs defaultValue="colors" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">Cores</TabsTrigger>
            <TabsTrigger value="contact">Contato</TabsTrigger>
            <TabsTrigger value="branding">Marca</TabsTrigger>
            <TabsTrigger value="hero">Banner Principal</TabsTrigger>
          </TabsList>

          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Cores</CardTitle>
                <CardDescription>
                  Configure as cores do site. Use formato HSL (ex: 220 90% 56%)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary">Cor Primária</Label>
                  <Input
                    id="primary"
                    value={colors.primary}
                    onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                    placeholder="220 90% 56%"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary">Cor Secundária</Label>
                  <Input
                    id="secondary"
                    value={colors.secondary}
                    onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                    placeholder="210 50% 40%"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent">Cor de Destaque</Label>
                  <Input
                    id="accent"
                    value={colors.accent}
                    onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                    placeholder="330 90% 56%"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="background">Cor de Fundo</Label>
                  <Input
                    id="background"
                    value={colors.background}
                    onChange={(e) => setColors({ ...colors, background: e.target.value })}
                    placeholder="0 0% 100%"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foreground">Cor do Texto</Label>
                  <Input
                    id="foreground"
                    value={colors.foreground}
                    onChange={(e) => setColors({ ...colors, foreground: e.target.value })}
                    placeholder="222.2 84% 4.9%"
                  />
                </div>
                <Button onClick={() => updateSetting("colors", colors)}>
                  Salvar Cores
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>
                  Configure as informações de contato exibidas no site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="+5548999999999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="contato@evitare.com.br"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={contact.whatsapp}
                    onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                    placeholder="5548999999999"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={contact.instagram}
                    onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                    placeholder="evitare"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={contact.facebook}
                    onChange={(e) => setContact({ ...contact, facebook: e.target.value })}
                    placeholder="evitare"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={contact.address}
                    onChange={(e) => setContact({ ...contact, address: e.target.value })}
                    placeholder="Rua Coronel Marcos Rovaris, 328..."
                  />
                </div>
                <Button onClick={() => updateSetting("contact", contact)}>
                  Salvar Contato
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Marca e Identidade</CardTitle>
                <CardDescription>
                  Configure o nome e tagline do site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nome do Site</Label>
                  <Input
                    id="siteName"
                    value={branding.siteName}
                    onChange={(e) => setBranding({ ...branding, siteName: e.target.value })}
                    placeholder="EVITARE"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tagline">Slogan</Label>
                  <Input
                    id="tagline"
                    value={branding.tagline}
                    onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                    placeholder="Você já imaginou ter todas as novidades..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo do Site</Label>
                  {branding.logoUrl && (
                    <div className="mb-2">
                      <img src={branding.logoUrl} alt="Logo atual" className="h-16 object-contain" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      id="logoUrl"
                      value={branding.logoUrl}
                      onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
                      placeholder="https://... ou faça upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      onClick={() => document.getElementById('logo-file')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Enviando..." : "Upload"}
                    </Button>
                    <input
                      id="logo-file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </div>
                </div>
                <Button onClick={() => updateSetting("branding", branding)}>
                  Salvar Marca
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero">
            <Card>
              <CardHeader>
                <CardTitle>Seção Principal (Hero)</CardTitle>
                <CardDescription>
                  Configure o banner e textos principais da página inicial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Título</Label>
                  <Input
                    id="heroTitle"
                    value={heroSection.title}
                    onChange={(e) => setHeroSection({ ...heroSection, title: e.target.value })}
                    placeholder="EVITARE"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Subtítulo</Label>
                  <Input
                    id="heroSubtitle"
                    value={heroSection.subtitle}
                    onChange={(e) => setHeroSection({ ...heroSection, subtitle: e.target.value })}
                    placeholder="Você já imaginou ter todas as novidades da empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroCta">Texto CTA</Label>
                  <Input
                    id="heroCta"
                    value={heroSection.ctaText}
                    onChange={(e) => setHeroSection({ ...heroSection, ctaText: e.target.value })}
                    placeholder="na palma da sua mão?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bannerUrl">Imagem do Banner</Label>
                  {heroSection.bannerUrl && (
                    <div className="mb-2">
                      <img src={heroSection.bannerUrl} alt="Banner atual" className="h-32 object-cover w-full rounded" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      id="bannerUrl"
                      value={heroSection.bannerUrl}
                      onChange={(e) => setHeroSection({ ...heroSection, bannerUrl: e.target.value })}
                      placeholder="https://... ou faça upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      onClick={() => document.getElementById('banner-file')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Enviando..." : "Upload"}
                    </Button>
                    <input
                      id="banner-file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBannerUpload}
                    />
                  </div>
                </div>
                <Button onClick={() => updateSetting("heroSection", heroSection)}>
                  Salvar Banner
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
