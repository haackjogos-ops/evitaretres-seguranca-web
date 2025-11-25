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
import { Upload, Palette, Phone, Bookmark, Image, Home, Info, GraduationCap, BookOpen, Award, Activity, Stethoscope, Heart, LogOut, FileText, MessageSquare, HelpCircle, Menu } from "lucide-react";
import Header from "@/components/Header";
import { ColorPicker } from "@/components/admin/ColorPicker";
import { ServicesTab } from "@/components/admin/tabs/ServicesTab";
import { AboutTab } from "@/components/admin/tabs/AboutTab";
import { TrainingsTab } from "@/components/admin/tabs/TrainingsTab";
import { CoursesTab } from "@/components/admin/tabs/CoursesTab";
import { BenefitsTab } from "@/components/admin/tabs/BenefitsTab";
import { MonitoringTab } from "@/components/admin/tabs/MonitoringTab";
import { MedicineTab } from "@/components/admin/tabs/MedicineTab";
import RegistrationsTab from "@/components/admin/tabs/RegistrationsTab";
import TestimonialsTab from "@/components/admin/tabs/TestimonialsTab";
import FAQTab from "@/components/admin/tabs/FAQTab";
import { MenuTab } from "@/components/admin/tabs/MenuTab";
import { Separator } from "@/components/ui/separator";

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
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie o conteúdo e configurações do site</p>
          </div>
          <Button onClick={signOut} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <Tabs defaultValue="colors" className="space-y-8">
          <div className="bg-background border rounded-lg py-6 px-4 shadow-sm overflow-x-auto">
            <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8 lg:grid-cols-16 gap-3 bg-transparent min-h-[60px]">
              <TabsTrigger value="colors" className="gap-2 py-3">
                <Palette className="h-5 w-5" />
                <span className="hidden sm:inline">Cores</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-2 py-3">
                <Phone className="h-5 w-5" />
                <span className="hidden sm:inline">Contato</span>
              </TabsTrigger>
              <TabsTrigger value="branding" className="gap-2 py-3">
                <Bookmark className="h-5 w-5" />
                <span className="hidden sm:inline">Marca</span>
              </TabsTrigger>
              <TabsTrigger value="hero" className="gap-2 py-3">
                <Image className="h-5 w-5" />
                <span className="hidden sm:inline">Banner</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-2 py-3">
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline">Home</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="gap-2 py-3">
                <Info className="h-5 w-5" />
                <span className="hidden sm:inline">Sobre</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="gap-2 py-3">
                <BookOpen className="h-5 w-5" />
                <span className="hidden sm:inline">Cursos</span>
              </TabsTrigger>
              <TabsTrigger value="trainings" className="gap-2 py-3">
                <GraduationCap className="h-5 w-5" />
                <span className="hidden sm:inline">Seg. do Trabalho</span>
              </TabsTrigger>
              <TabsTrigger value="benefits" className="gap-2 py-3">
                <Award className="h-5 w-5" />
                <span className="hidden sm:inline">Vantagens</span>
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="gap-2 py-3">
                <Activity className="h-5 w-5" />
                <span className="hidden sm:inline">Monitoramento</span>
              </TabsTrigger>
              <TabsTrigger value="medicine" className="gap-2 py-3">
                <Heart className="h-5 w-5" />
                <span className="hidden sm:inline">Seg. Trabalho e Medicina</span>
              </TabsTrigger>
              <TabsTrigger value="registrations" className="gap-2 py-3">
                <FileText className="h-5 w-5" />
                <span className="hidden sm:inline">Inscrições</span>
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="gap-2 py-3">
                <MessageSquare className="h-5 w-5" />
                <span className="hidden sm:inline">Depoimentos</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="gap-2 py-3">
                <HelpCircle className="h-5 w-5" />
                <span className="hidden sm:inline">FAQ</span>
              </TabsTrigger>
              <TabsTrigger value="menu" className="gap-2 py-3">
                <Menu className="h-5 w-5" />
                <span className="hidden sm:inline">Menu</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="colors" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="space-y-2 p-8">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Palette className="h-6 w-6 text-primary" />
                  Gerenciar Cores
                </CardTitle>
                <CardDescription className="text-base">
                  Configure as cores do site. Use formato HSL (ex: 220 90% 56%)
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-8 px-8 pb-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <ColorPicker
                    id="primary"
                    label="Cor Primária"
                    value={colors.primary}
                    onChange={(value) => setColors({ ...colors, primary: value })}
                    placeholder="220 90% 56%"
                  />
                  <ColorPicker
                    id="secondary"
                    label="Cor Secundária"
                    value={colors.secondary}
                    onChange={(value) => setColors({ ...colors, secondary: value })}
                    placeholder="210 50% 40%"
                  />
                  <ColorPicker
                    id="accent"
                    label="Cor de Destaque"
                    value={colors.accent}
                    onChange={(value) => setColors({ ...colors, accent: value })}
                    placeholder="330 90% 56%"
                  />
                  <ColorPicker
                    id="background"
                    label="Cor de Fundo"
                    value={colors.background}
                    onChange={(value) => setColors({ ...colors, background: value })}
                    placeholder="0 0% 100%"
                  />
                  <ColorPicker
                    id="foreground"
                    label="Cor do Texto"
                    value={colors.foreground}
                    onChange={(value) => setColors({ ...colors, foreground: value })}
                    placeholder="222.2 84% 4.9%"
                  />
                </div>
                <Separator className="my-8" />
                <div className="flex justify-end">
                  <Button onClick={() => updateSetting("colors", colors)} size="lg" className="px-8">
                    Salvar Cores
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="space-y-2 p-8">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Phone className="h-6 w-6 text-primary" />
                  Informações de Contato
                </CardTitle>
                <CardDescription className="text-base">
                  Configure as informações de contato exibidas no site
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-8 px-8 pb-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-base font-medium">Telefone</Label>
                    <Input
                      id="phone"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      placeholder="+5548999999999"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      placeholder="contato@evitare.com.br"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="whatsapp" className="text-base font-medium">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={contact.whatsapp}
                      onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                      placeholder="5548999999999"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="instagram" className="text-base font-medium">Instagram</Label>
                    <Input
                      id="instagram"
                      value={contact.instagram}
                      onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                      placeholder="evitare"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="facebook" className="text-base font-medium">Facebook</Label>
                    <Input
                      id="facebook"
                      value={contact.facebook}
                      onChange={(e) => setContact({ ...contact, facebook: e.target.value })}
                      placeholder="evitare"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3 sm:col-span-2">
                    <Label htmlFor="address" className="text-base font-medium">Endereço</Label>
                    <Input
                      id="address"
                      value={contact.address}
                      onChange={(e) => setContact({ ...contact, address: e.target.value })}
                      placeholder="Rua Coronel Marcos Rovaris, 328..."
                      className="h-12 text-base"
                    />
                  </div>
                </div>
                <Separator className="my-8" />
                <div className="flex justify-end">
                  <Button onClick={() => updateSetting("contact", contact)} size="lg" className="px-8">
                    Salvar Contato
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="space-y-2 p-8">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Bookmark className="h-6 w-6 text-primary" />
                  Marca e Identidade
                </CardTitle>
                <CardDescription className="text-base">
                  Configure o nome e tagline do site
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-8 px-8 pb-8">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="siteName" className="text-base font-medium">Nome do Site</Label>
                    <Input
                      id="siteName"
                      value={branding.siteName}
                      onChange={(e) => setBranding({ ...branding, siteName: e.target.value })}
                      placeholder="EVITARE"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="tagline" className="text-base font-medium">Slogan</Label>
                    <Input
                      id="tagline"
                      value={branding.tagline}
                      onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                      placeholder="Você já imaginou ter todas as novidades..."
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="logoUrl" className="text-base font-medium">Logo do Site</Label>
                    {branding.logoUrl && (
                      <div className="p-4 border rounded-lg bg-muted/30 flex items-center justify-center">
                        <img src={branding.logoUrl} alt="Logo atual" className="h-20 object-contain" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        id="logoUrl"
                        value={branding.logoUrl}
                        onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
                        placeholder="https://... ou faça upload"
                        className="h-10"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploading}
                        onClick={() => document.getElementById('logo-file')?.click()}
                        className="shrink-0"
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
                </div>
                <Separator className="my-8" />
                <div className="flex justify-end">
                  <Button onClick={() => updateSetting("branding", branding)} size="lg" className="px-8">
                    Salvar Marca
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hero" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Image className="h-5 w-5 text-primary" />
                  Seção Principal (Hero)
                </CardTitle>
                <CardDescription>
                  Configure o banner e textos principais da página inicial
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="heroTitle" className="text-sm font-medium">Título</Label>
                    <Input
                      id="heroTitle"
                      value={heroSection.title}
                      onChange={(e) => setHeroSection({ ...heroSection, title: e.target.value })}
                      placeholder="EVITARE"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroSubtitle" className="text-sm font-medium">Subtítulo</Label>
                    <Input
                      id="heroSubtitle"
                      value={heroSection.subtitle}
                      onChange={(e) => setHeroSection({ ...heroSection, subtitle: e.target.value })}
                      placeholder="Você já imaginou ter todas as novidades da empresa"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroCta" className="text-sm font-medium">Texto CTA</Label>
                    <Input
                      id="heroCta"
                      value={heroSection.ctaText}
                      onChange={(e) => setHeroSection({ ...heroSection, ctaText: e.target.value })}
                      placeholder="na palma da sua mão?"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="bannerUrl" className="text-sm font-medium">Imagem do Banner</Label>
                    {heroSection.bannerUrl && (
                      <div className="border rounded-lg overflow-hidden bg-muted/30">
                        <img src={heroSection.bannerUrl} alt="Banner atual" className="h-40 object-cover w-full" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Input
                        id="bannerUrl"
                        value={heroSection.bannerUrl}
                        onChange={(e) => setHeroSection({ ...heroSection, bannerUrl: e.target.value })}
                        placeholder="https://... ou faça upload"
                        className="h-10"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploading}
                        onClick={() => document.getElementById('banner-file')?.click()}
                        className="shrink-0"
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
                </div>
                <Separator className="my-6" />
                <div className="flex justify-end">
                  <Button onClick={() => updateSetting("heroSection", heroSection)} size="lg">
                    Salvar Banner
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>

          <TabsContent value="about">
            <AboutTab />
          </TabsContent>

          <TabsContent value="courses">
            <CoursesTab />
          </TabsContent>

          <TabsContent value="trainings">
            <TrainingsTab />
          </TabsContent>

          <TabsContent value="benefits">
            <BenefitsTab />
          </TabsContent>

          <TabsContent value="monitoring">
            <MonitoringTab />
          </TabsContent>

          <TabsContent value="medicine">
            <MedicineTab />
          </TabsContent>

          <TabsContent value="registrations">
            <RegistrationsTab />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsTab />
          </TabsContent>

          <TabsContent value="faq">
            <FAQTab />
          </TabsContent>

          <TabsContent value="menu">
            <MenuTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
