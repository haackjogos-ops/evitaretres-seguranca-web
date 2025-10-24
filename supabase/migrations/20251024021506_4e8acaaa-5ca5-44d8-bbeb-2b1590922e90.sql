-- Create storage bucket for site assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public to view site assets
CREATE POLICY "Public can view site assets"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'site-assets');

-- Only admins can upload site assets
CREATE POLICY "Admins can upload site assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'site-assets' 
  AND (storage.foldername(name))[1] IN ('logos', 'banners')
  AND public.has_role(auth.uid(), 'admin')
);

-- Only admins can update site assets
CREATE POLICY "Admins can update site assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'site-assets'
  AND public.has_role(auth.uid(), 'admin')
);

-- Only admins can delete site assets
CREATE POLICY "Admins can delete site assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'site-assets'
  AND public.has_role(auth.uid(), 'admin')
);