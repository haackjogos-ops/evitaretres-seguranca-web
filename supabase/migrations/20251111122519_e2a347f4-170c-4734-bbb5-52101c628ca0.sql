-- Create registrations table to store form submissions
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  cnpj TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Anyone can insert registrations (public form)
CREATE POLICY "Anyone can create registrations"
ON public.registrations
FOR INSERT
WITH CHECK (true);

-- Only admins can view registrations
CREATE POLICY "Only admins can view registrations"
ON public.registrations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update registrations
CREATE POLICY "Only admins can update registrations"
ON public.registrations
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete registrations
CREATE POLICY "Only admins can delete registrations"
ON public.registrations
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  position TEXT,
  avatar_url TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can view active testimonials
CREATE POLICY "Anyone can view active testimonials"
ON public.testimonials
FOR SELECT
USING (is_active = true);

-- Only admins can insert testimonials
CREATE POLICY "Only admins can insert testimonials"
ON public.testimonials
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update testimonials
CREATE POLICY "Only admins can update testimonials"
ON public.testimonials
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete testimonials
CREATE POLICY "Only admins can delete testimonials"
ON public.testimonials
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create FAQ table
CREATE TABLE public.faq_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'geral',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

-- Anyone can view active FAQ items
CREATE POLICY "Anyone can view active faq items"
ON public.faq_items
FOR SELECT
USING (is_active = true);

-- Only admins can insert FAQ items
CREATE POLICY "Only admins can insert faq items"
ON public.faq_items
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update FAQ items
CREATE POLICY "Only admins can update faq items"
ON public.faq_items
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete FAQ items
CREATE POLICY "Only admins can delete faq items"
ON public.faq_items
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at using the correct function name
CREATE TRIGGER update_registrations_updated_at
BEFORE UPDATE ON public.registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_faq_items_updated_at
BEFORE UPDATE ON public.faq_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();