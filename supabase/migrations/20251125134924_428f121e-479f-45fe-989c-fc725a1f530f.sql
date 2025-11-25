-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Menu items are viewable by everyone"
ON public.menu_items
FOR SELECT
USING (is_active = true);

-- Create policy for admin insert
CREATE POLICY "Admins can insert menu items"
ON public.menu_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create policy for admin update
CREATE POLICY "Admins can update menu items"
ON public.menu_items
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create policy for admin delete
CREATE POLICY "Admins can delete menu items"
ON public.menu_items
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Insert default menu items
INSERT INTO public.menu_items (label, path, display_order, is_active) VALUES
  ('Início', '/', 0, true),
  ('Sobre', '/sobre', 1, true),
  ('Vantagens', '/vantagens', 2, true),
  ('Cursos | Treinamentos', '/cursos', 3, true),
  ('Monitoramento', '/monitoramento', 4, true),
  ('Segurança do Trabalho e Medicina', '/medicina', 5, true),
  ('Contato', '/contato', 6, true);