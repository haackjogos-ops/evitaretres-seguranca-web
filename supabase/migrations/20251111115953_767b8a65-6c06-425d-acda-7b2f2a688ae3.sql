-- Create qr_codes table
CREATE TABLE public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  link TEXT NOT NULL,
  whatsapp_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view qr codes"
  ON public.qr_codes 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can insert qr codes"
  ON public.qr_codes 
  FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update qr codes"
  ON public.qr_codes 
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete qr codes"
  ON public.qr_codes 
  FOR DELETE 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON public.qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();