-- Remove old qr_codes table
DROP TABLE IF EXISTS public.qr_codes;

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Student data
  student_name TEXT NOT NULL,
  
  -- Course data
  course_type TEXT NOT NULL, -- "INICIAL", "RECICLAGEM", etc.
  course_name TEXT NOT NULL,
  course_norm TEXT NOT NULL, -- "NR-35", "NR-10", etc.
  course_hours TEXT NOT NULL, -- "08 horas"
  
  -- Dates and registration
  course_date DATE NOT NULL,
  archive_code TEXT NOT NULL, -- "09 – 2025"
  registration_number TEXT NOT NULL UNIQUE,
  issue_location TEXT NOT NULL DEFAULT 'Turvo',
  issue_date DATE NOT NULL,
  
  -- Generated files
  pdf_url TEXT,
  qr_code_url TEXT, -- Public URL to access certificate
  
  -- Controls
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active certificates"
ON public.certificates
FOR SELECT
USING (is_active = true);

CREATE POLICY "Only admins can insert certificates"
ON public.certificates
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update certificates"
ON public.certificates
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete certificates"
ON public.certificates
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create updated_at trigger
CREATE TRIGGER update_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create storage bucket for certificates
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true);

-- Storage policies for certificates bucket
CREATE POLICY "Anyone can view certificates"
ON storage.objects
FOR SELECT
USING (bucket_id = 'certificates');

CREATE POLICY "Only admins can upload certificates"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'certificates' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update certificates"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'certificates' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete certificates"
ON storage.objects
FOR DELETE
USING (bucket_id = 'certificates' AND has_role(auth.uid(), 'admin'));