-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
$$;

-- RLS policy for user_roles: only admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create site_settings table for managing site configuration
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings
CREATE POLICY "Anyone can view settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can update settings
CREATE POLICY "Only admins can update settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert settings
CREATE POLICY "Only admins can insert settings"
ON public.site_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete settings
CREATE POLICY "Only admins can delete settings"
ON public.site_settings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('colors', '{"primary": "220 90% 56%", "secondary": "210 50% 40%", "accent": "330 90% 56%", "background": "0 0% 100%", "foreground": "222.2 84% 4.9%"}'),
  ('contact', '{"phone": "+5548999999999", "email": "contato@evitare.com.br", "whatsapp": "5548999999999", "instagram": "evitare", "facebook": "evitare", "address": "Rua Coronel Marcos Rovaris, 328 – Sala 2 – Centro – Turvo"}'),
  ('branding', '{"siteName": "EVITARE", "tagline": "Você já imaginou ter todas as novidades da empresa na palma da sua mão?", "logoUrl": null}'),
  ('heroSection', '{"title": "EVITARE", "subtitle": "Você já imaginou ter todas as novidades da empresa", "ctaText": "na palma da sua mão?", "bannerUrl": null}');