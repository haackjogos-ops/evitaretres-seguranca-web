-- Create simple function for tables without updated_by column
CREATE OR REPLACE FUNCTION public.update_updated_at_simple()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate triggers for tables WITHOUT updated_by column

-- services
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_simple();

-- benefits
DROP TRIGGER IF EXISTS update_benefits_updated_at ON public.benefits;
CREATE TRIGGER update_benefits_updated_at
  BEFORE UPDATE ON public.benefits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_simple();

-- about_sections
DROP TRIGGER IF EXISTS update_about_sections_updated_at ON public.about_sections;
CREATE TRIGGER update_about_sections_updated_at
  BEFORE UPDATE ON public.about_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_simple();

-- medicine_services
DROP TRIGGER IF EXISTS update_medicine_services_updated_at ON public.medicine_services;
CREATE TRIGGER update_medicine_services_updated_at
  BEFORE UPDATE ON public.medicine_services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_simple();

-- pages_content
DROP TRIGGER IF EXISTS update_pages_content_updated_at ON public.pages_content;
CREATE TRIGGER update_pages_content_updated_at
  BEFORE UPDATE ON public.pages_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_simple();

-- testimonials
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_simple();

-- faq_items
DROP TRIGGER IF EXISTS update_faq_items_updated_at ON public.faq_items;
CREATE TRIGGER update_faq_items_updated_at
  BEFORE UPDATE ON public.faq_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_simple();

-- registrations
DROP TRIGGER IF EXISTS update_registrations_updated_at ON public.registrations;
CREATE TRIGGER update_registrations_updated_at
  BEFORE UPDATE ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_simple();